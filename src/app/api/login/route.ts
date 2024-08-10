import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import prisma from "../../../../lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const { publicKey, password } = await req.json();
        const user = await prisma.user.findUnique({
            where: { publicKey: publicKey }
        });
        if (!user) {
            return NextResponse.json({
                message: 'User not found'
            }, {
                status: 404
            });
        }

        // Await the bcrypt.compare call
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({
                message: 'Incorrect password'
            }, {
                status: 401
            });
        }
        return NextResponse.json({
            message: 'Login successful'
        });
    } catch (error) {
        console.error({ Error: error });
        return NextResponse.json({
            message: 'Internal server error'
        }, {
            status: 500
        });
    }
}
