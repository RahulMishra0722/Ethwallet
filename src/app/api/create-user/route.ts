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

        // Check if a user with the same publicKey already exists
        const existingUser = await prisma.user.findUnique({
            where: { publicKey: publicKey },
        });

        if (existingUser) {
            console.error("Error: User with this publicKey already exists");
            return NextResponse.json({ error: "User with this publicKey already exists" }, { status: 409 });
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
        if (error instanceof Error) {
            console.error("Error creating user:", {
                message: error.message,
                stack: error.stack,
            });
        } else {
            console.error("Error creating user:", error);
        }

        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
