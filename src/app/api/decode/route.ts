import { NextResponse } from 'next/server';
import { decodeData } from '@/extras/encrypt';

export async function GET(request: Request) {
    const url = new URL(request.url);
    const key = url.searchParams.get('key');

    if (!key) {
        return NextResponse.json({ error: 'Missing key parameter' }, { status: 400 });
    }

    try {
        const data = await decodeData(key);
        return NextResponse.json(data);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: `Error handling the request: ${error.message}` }, { status: 500 });
        } else {
            return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
        }
    }
}
