import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt  from 'bcryptjs';
export async function POST(request: NextRequest){
    console.log('REGISTER_POST API HIT');
    try{
        const {email, password} = await request.json();

        if(!email || !password || password.length < 6){
            return NextResponse.json({message: 'Invalid data'}, {status: 400});
        }
        //check if user exists
        const existingUser = await prisma.user.findUnique({
            where: {email}
    
        })
        if(existingUser){
            return NextResponse.json({message: 'User already exists'}, {status: 400});
        }
    
        const normalizedEmail = email.toLowerCase().trim();
        const hashedPassword = await bcrypt.hash(password, 12);
    
        //save to db
        const user = await prisma.user.create({
            data: {
                email: normalizedEmail, 
                password: hashedPassword
            },
            select: {
                id: true,
                email: true,
            }
        })
        return NextResponse.json(user, {status: 201});
    }
    catch(error){
        console.log('REGISTER_POST', error);
        return NextResponse.json({message: 'Internal error'}, {status: 500});
    }
    
}