import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { ObjectId } from "bson";

export async function POST(request: NextRequest) {
  console.log("CART_POST API HIT");
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    if (!decoded?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = decoded.id;
    const { items } = await request.json();

    // upsert cart (create if doesn't exist, otherwise update)
    const cart = await prisma.cart.upsert({
      where: { userId }, // 👈 works now because userId is unique
      update: {
        items: {
          create: items.map((item: any) => ({
            product: { connect: { id: item.productId } },
            quantity: item.quantity,
          })),
        },
      },
      create: {
        userId,
        items: {
          create: items.map((item: any) => ({
            product: { connect: { id: item.productId } },
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: { include: { product: true } },
      },
    });

    return NextResponse.json(cart, { status: 201 });
  } catch (error) {
    console.error("Error creating cart:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  console.log("CART_GET API HIT");
  try{
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    if (!decoded?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = decoded.id;
    const carts = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: { include: { product: true } },
      },
    });
    return NextResponse.json(carts, { status: 200 });

  }
  catch(error){
    console.error("Error fetching carts:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}


// export async function DELETE(request: NextRequest, { params } : { params: {id : string}}){
//     console.log(" delete api hit")
//     try {
//       if(!ObjectId.isValid(params.id)){
//         return NextResponse.json({message: "Invalid product ID"}, {status: 400});
//       }
//       const deletedProduct = await prisma.product.delete({
//         where: {id: params.id}

//       })
//       return NextResponse.json(deletedProduct, {status: 200});
//     }
//     catch (error) {
//       console.error("PRODUCTS_ID_DELETE Error", error);
//       return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//     }

// }