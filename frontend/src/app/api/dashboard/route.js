import { NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL || 'http://localhost:5000';

// GET /api/dashboard
export async function GET() {
  try {
    // get products
    const productRes = await fetch(`${BACKEND}/api/products`);
    const products = await productRes.json();

    // get orders isAdmin=true
    const orderRes = await fetch(`${BACKEND}/api/orders?isAdmin=true`);
    const orders = await orderRes.json();

    return NextResponse.json({
      totalProducts: products.length,
      totalOrders: orders.length,
    });
  } catch (err) {
    console.error('❌ Error in /api/dashboard:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
