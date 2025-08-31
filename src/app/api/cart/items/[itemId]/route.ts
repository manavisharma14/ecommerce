import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ObjectId } from "bson"; 

 
// DELETE /api/cart/:itemId
export async function DELETE(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  console.log("DELETE CART ITEM API HIT", params.itemId);

  try {
    if (!ObjectId.isValid(params.itemId)) {
      return NextResponse.json({ message: "Invalid cart item ID" }, { status: 400 });
    }

    // delete from cartItem table
    const deletedItem = await prisma.cartItem.delete({
      where: { id: params.itemId },
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { itemId: string } }
){
  console.log("update cart items api hit")
  try{
    const { quantity } = await request.json();
    if (!ObjectId.isValid(params.itemId)) {
      return NextResponse.json({ message: "Invalid cart item ID" }, { status: 400 });
    }
    const updatedItem = await prisma.cartItem.update({
      where: { id: params.itemId },
      data: { quantity }
    })
    return NextResponse.json(
      { message: "Cart item updated", updatedItem },
      { status: 200 }
    );
  } catch (error) {
    console.error("CART_ITEM_UPDATE Error", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
