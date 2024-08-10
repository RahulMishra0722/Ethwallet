import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        const { publicKey, address, password, resetPassPhrase } = await req.json();


        if (!publicKey || !address || !password || !resetPassPhrase) {
            console.error("Error: Missing required fields", { publicKey, address, password, resetPassPhrase });
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                publicKey,
                password: hashedPassword,
                resetPassPhrase
            }
        });

        const wallet = await prisma.wallet.create({
            data: {
                publicKey: publicKey,
                userId: user.id,
                address
            }
        });

        return NextResponse.json({ user: user, wallet: wallet }, { status: 201 });

    } catch (error: unknown) {
        console.error("Error creating user:", {
            message: error.message,
            stack: error.stack,
        });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
