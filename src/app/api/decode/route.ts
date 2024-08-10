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
    } catch (error) {
        return NextResponse.json({ error: `Error handling the request: ${error.message}` }, { status: 500 });
    }
}
