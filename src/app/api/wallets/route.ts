import { ethers } from "ethers";
import { NextResponse } from "next/server";

export async function GET(req: NextResponse) {
    try {
        const wallet = ethers.Wallet.createRandom();

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
