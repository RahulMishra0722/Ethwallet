import { ethers } from "ethers";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
        const wallet = ethers.Wallet.createRandom();
        return NextResponse.json({
            Publickey: wallet.publicKey,
            Adress: wallet.address,
            Mnemonic: wallet.mnemonic?.phrase
        }, { headers: { 'Cache-Control': 'no-store' } });
    } catch (error) {
        return NextResponse.json({
            message: 'Internal server error'
        });
    }
}
