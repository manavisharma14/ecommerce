import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // 1. Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 2. Only send compact metadata (productId + qty only)
    const metadata = {
      userId,
      items: JSON.stringify(
        cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        }))
      ),
    };

    console.log("🛒 Compact metadata:", metadata);

    // 3. Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: cart.items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.name,
            images: [item.product.imageUrl],
          },
          unit_amount: Math.round(item.product.price * 100),
        },
        quantity: item.quantity,
      })),
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      metadata,
    });

    console.log("✅ Checkout Session created:", session.id);

    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    console.error("❌ Checkout Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}