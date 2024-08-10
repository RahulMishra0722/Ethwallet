import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import prisma from "../../../../lib/prisma";
export async function POST(req: NextRequest) {
    try {
        const { publicKey, password } = await req.json()
        const user = await prisma.user.findUnique({
            where: { publicKey: publicKey }
        })
        if (!user) {
            return NextResponse.json({
                message: 'user not found'
            }, {
                status: 404
            })
        }

        const isMatch = bcrypt.compare(password, user?.password)
        if (!isMatch) {
            return NextResponse.json({
                message: 'Incorrect password'
            }, {
                status: 401
            })
        }
        return NextResponse.json({
            message: 'Login successful'
        })
    } catch (error) {
        console.error({ Error: error })
        NextResponse.json({
            message: 'internal server error'
        }, {
            status: 500
        })
    }
}