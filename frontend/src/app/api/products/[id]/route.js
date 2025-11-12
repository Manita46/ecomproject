import { NextResponse } from 'next/server';
const BACKEND = process.env.BACKEND_URL || 'http://localhost:5000';

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const res = await fetch(`${BACKEND}/api/products/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('PUT /api/products/:id error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const res = await fetch(`${BACKEND}/api/products/${params.id}`, {
      method: 'DELETE',
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('DELETE /api/products/:id error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
