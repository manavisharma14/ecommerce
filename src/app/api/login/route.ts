import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const runtime = "nodejs"; // bcrypt needs Node runtime

const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = "session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
export async function POST(request: NextRequest){

    
    console.log('LOGIN_POST API HIT');
    try{
        const {email, password} = await request.json();
    
        if(!email || !password){
            return NextResponse.json({message: 'Invalid data'}, {status: 400});
        }

        const normalizedEmail = email.toLowerCase().trim();
        //find user
        const user = await prisma.user.findUnique({
            where: {email: normalizedEmail},
            select: {
                id: true,
                email: true,
                password: true
            }
        })

        if(!user){
            return NextResponse.json({message: 'User not found'}, {status: 404});
        }
        const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

        if(!JWT_SECRET){
            return NextResponse.json({message: 'Server misconfigured'}, {status: 500});
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            JWT_SECRET,
            {expiresIn: COOKIE_MAX_AGE}
        );
        // set cookie
        

        const res = NextResponse.json(
            {
              token,  // return token here
              user: { id: user.id, email: user.email },
            },
            { status: 200 }
          );

        return res;



    } catch(error){
        console.log('LOGIN_POST', error);
        return NextResponse.json({message: 'Internal error'}, {status: 500});
    }

    
}