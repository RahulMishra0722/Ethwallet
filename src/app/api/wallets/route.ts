import { ethers } from "ethers";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
        const wallet = ethers.Wallet.createRandom();

        // Create a response object
        const response = NextResponse.json({
            Publickey: wallet.publicKey,
            Adress: wallet.address,
            Mnemonic: wallet.mnemonic?.phrase
        });

        // Set Cache-Control header
        response.headers.set('Cache-Control', 'no-store');

        return response;
    } catch (error) {
        console.error('Error generating wallet:', error);
        return NextResponse.json({
            message: 'Internal server error'
        });
    }
}

