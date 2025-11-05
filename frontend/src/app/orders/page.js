'use client';
import { useState, useEffect } from "react";
import { FaClock, FaCheckCircle, FaTimesCircle, FaBoxOpen } from "react-icons/fa";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const run = async () => {
      try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem("user") : null;
        const user = raw ? JSON.parse(raw) : null;

        if (!user?.id) {
          setOrders([]);
          return;
        }

        const res = await fetch(`http://localhost:5000/api/orders?userId=${user.id}`, {
          cache: "no-store",
        });

        let json = [];
        try { json = await res.json(); } catch { json = []; }

        const items =
          Array.isArray(json) ? json :
          Array.isArray(json.data) ? json.data :
          Array.isArray(json.orders) ? json.orders :
          [];

        setOrders(items);
      } catch (e) {
        console.error("❌ Failed to fetch orders:", e);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

    const getStatusBadge = (status) => {
        switch (status.toLowerCase()) {
            case "pending":
                return <span className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                    <FaClock className="mr-2"/> Pending
                </span>;
            case "completed":
                return <span className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    <FaCheckCircle className="mr-2"/> Completed
                </span>;
            case "cancelled":
                return <span className="flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                    <FaTimesCircle className="mr-2"/> Cancelled
                </span>;
            default:
                return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
                    <FaClock className="mr-2"/> Unknown
                </span>;
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">🛒 Your Orders</h2>

            {loading ? (
                <p className="text-gray-600 text-lg">Loading your orders...</p>
            ) : orders.length === 0 ? (
                <p className="text-gray-600 text-lg">You have no orders yet.</p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                                {getStatusBadge(order.status)}
                            </div>
                            <p className="text-gray-600">Total Price: <span className="font-semibold text-green-600">${order.totalPrice}</span></p>
                            <p className="text-gray-600">Total Items: <span className="font-semibold">{order.totalItems}</span></p>
                            <p className="text-gray-500 text-sm">📅 Ordered on: {new Date(order.createdAt).toLocaleDateString("en-US")}</p>

                            {/* แสดงรายการสินค้าในออเดอร์ */}
                            <div className="mt-4">
                                <h4 className="text-gray-700 font-semibold">Items:</h4>
                                <ul className="mt-2">
                                    {order.orderitem.map((item, index) => (
                                        <li key={index} className="flex items-center text-gray-600">
                                            <FaBoxOpen className="mr-2 text-gray-500"/>
                                            {item.product.name} × {item.quantity}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
