import { NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL || "http://localhost:5000";

//POST /api/checkout → ส่งข้อมูลออเดอร์ไป backend
export async function POST(req) {
  try {
    const orderData = await req.json();

    const res = await fetch(`${BACKEND}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("❌ Error in /api/checkout route:", err);
    return NextResponse.json(
      { error: "Internal Server Error123" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
