import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-08-27.basil",
});

export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature") as string;

  try {
    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;

      console.log("🎯 Webhook triggered for user:", userId);

      if (userId) {
        // fetch full cart again (since metadata only has IDs + qty)
        const cart = await prisma.cart.findUnique({
          where: { userId },
          include: { items: { include: { product: true } } },
        });

        if (!cart) {
          console.error("⚠️ No cart found for user", userId);
          return NextResponse.json({ received: true });
        }

        // create order
        const order = await prisma.order.create({
          data: {
            userId,
            totalAmount: session.amount_total! / 100,
            status: "PAID",
            paymentId: session.id,
            items: {
              create: cart.items.map((item) => ({
                productId: item.productId,
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
                imageUrl: item.product.imageUrl,
              })),
            },
          },
        });

        console.log("✅ Order created:", order.id);

        // clear cart
        await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}