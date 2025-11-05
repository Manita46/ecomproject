"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderSuccessPage() {
  const router = useRouter();
  const [orderStatus, setOrderStatus] = useState("Processing..."); // สถานะเริ่มต้น

  useEffect(() => {
    // จำลองการเปลี่ยนสถานะเป็น "กำลังจัดส่ง" หลังจาก 3 วินาที
    const timer = setTimeout(() => {
      setOrderStatus("🚚 กำลังจัดส่ง");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-10 text-center bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-green-600">🎉 Order Confirmed!</h1>
      <p className="text-gray-700 mt-2">
        Thank you for your purchase. Your order has been placed successfully.
      </p>

      {/* 🔥 สถานะออเดอร์ */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md text-lg">
        <span className="font-semibold text-gray-800">สถานะคำสั่งซื้อ:</span>{" "}
        <span className="text-blue-500 font-bold">{orderStatus}</span>
      </div>

      {/* ปุ่มไปหน้า My Orders */}
      <button
        onClick={() => router.push("/orders")}
        className="mt-6 bg-[#d4a373] hover:bg-[#b08968] text-white py-2 px-6 rounded-lg transition-all duration-300"
      >
        📦 My Orders
      </button>
    </div>
  );
}
