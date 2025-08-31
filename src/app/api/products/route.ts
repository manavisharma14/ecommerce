import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(){
    console.log('PRODUCTS_GET API HIT');
    try{
        const products = await prisma.product.findMany();
        return NextResponse.json(products, {status: 200});
    } catch (error) {
        console.log('PRODUCTS_GET', error);
        return NextResponse.json({message: 'Internal error'}, {status: 500});
    }
}
export async function POST(request: NextRequest){
    try { 
        const body = await request.json();
        const { name, price, imageUrl, description, stock } = body;

        if(!name || !price || !imageUrl || !description){
            return NextResponse.json({message: 'All fields are required'}, {status: 400});
        }

        const product = await prisma.product.create({
            data: {
                name, 
                price: parseFloat(price),
                imageUrl,
                description,
                stock: parseInt(stock),
            }

            
        });
        return NextResponse.json(product, {status: 201});


    } catch (error) {
        console.log('PRODUCTS_POST', error);
        return NextResponse.json({message: 'Internal error'}, {status: 500});
    }
}