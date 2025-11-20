import { NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL 

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
    
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    const orderId = data.id;
    // console.log("orderId ที่จะส่งไป /api/job :", orderId);

    // console.log("orderData :",orderData)
    // console.log("Data :",data)
    const jobres = await fetch(`${BACKEND}/api/job`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });
    const datajob = await jobres.json().catch(() => ({}));
    console.log("datajob",datajob)


    // const asdasdasdasfksfjadf = {
    //   asd: datajob.orderId,
    //   asdddd: "adasdasd"
    // }
    // const asdasdasdasd = await fetch(`${BACKEND}/api/job/create-order-status-update`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(),
    // });



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
