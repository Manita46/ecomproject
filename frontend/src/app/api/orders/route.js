import { NextResponse } from 'next/server';
const BACKEND = process.env.BACKEND_URL || 'http://localhost:5000';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const isAdmin = url.searchParams.get('isAdmin');

    const res = await fetch(
      `${BACKEND}/api/orders${isAdmin ? `?isAdmin=${isAdmin}` : ''}`,
      { cache: 'no-store' }
    );

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('GET /api/orders error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
