// frontend/src/app/api/reviews/route.js
import { NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL || "http://localhost:5000";

//GET /api/reviews → backend 
export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/api/reviews`, { cache: "no-store" });
    const data = await res.json().catch(() => ([])); // ถ้า backend ยังไม่มี data
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("❌ Error in GET /api/reviews route:", err);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

//POST /api/reviews → backend
export async function POST(req) {
  try {
    const body = await req.json();

    const res = await fetch(`${BACKEND}/api/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("❌ Error in POST /api/reviews route:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
