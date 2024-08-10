import { ethers } from "ethers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const wallet = ethers.Wallet.createRandom();
        console.log({
            Publickey: wallet.publicKey,
            Adress: wallet.address,
            Mnemonic: wallet.mnemonic?.phrase
        })
        return NextResponse.json({
            Publickey: wallet.publicKey,
            Adress: wallet.address,
            Mnemonic: wallet.mnemonic?.phrase
        });
    } catch (error) {
        return NextResponse.json({
            message: 'Internal server error'
        });
    }
}

