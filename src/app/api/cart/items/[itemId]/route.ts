import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ObjectId } from "bson"; 

// DELETE /api/cart/items/[itemId]
export async function DELETE(
  req: NextRequest,
  context: { params: { itemId: string } }
) {
  const { itemId } = context.params;
  console.log("DELETE CART ITEM API HIT", itemId);

  try {
    if (!ObjectId.isValid(itemId)) {
      return NextResponse.json({ message: "Invalid cart item ID" }, { status: 400 });
    }

    const deletedItem = await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json(
      { message: "Cart item deleted", deletedItem },
      { status: 200 }
    );
  } catch (error) {
    console.error("CART_ITEM_DELETE Error", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// PUT /api/cart/items/[itemId]
export async function PUT(
  req: NextRequest,
  context: { params: { itemId: string } }
) {
  const { itemId } = context.params;
  console.log("UPDATE CART ITEM API HIT", itemId);

  try {
    const { quantity } = await req.json();

    if (!ObjectId.isValid(itemId)) {
      return NextResponse.json({ message: "Invalid cart item ID" }, { status: 400 });
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return NextResponse.json(
      { message: "Cart item updated", updatedItem },
      { status: 200 }
    );
  } catch (error) {
    console.error("CART_ITEM_UPDATE Error", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}