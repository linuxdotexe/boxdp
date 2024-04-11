import { type NextRequest } from 'next/server';

export const dynamic = 'force-dynamic' // defaults to auto
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    return Response.json({ hello: 'world' });
}

/*
, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
    }
*/