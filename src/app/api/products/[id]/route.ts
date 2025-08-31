import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ObjectId } from "bson"; // ✅ use bson to validate Mongo ObjectId

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log("products/[id] GET API HIT", params.id);

  try {
    // ✅ Validate ID before passing to Prisma
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ message: "Invalid product ID" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        price: true,
        imageUrl: true,
        description: true,
        stock: true,
      },
    });

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("PRODUCTS_ID_GET Error", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log("products/[id] DELETE API HIT", params.id);

  try {
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ message: "Invalid product ID" }, { status: 400 });
    }

    // First delete related CartItems
    await prisma.cartItem.deleteMany({
      where: { productId: params.id },
    });

    // Then delete the product
    const deletedProduct = await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json(deletedProduct, { status: 200 });
  } catch (error) {
    console.error("PRODUCTS_ID_DELETE Error", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}