'use client';

import { useEffect, useState } from 'react';
import { FaTruck, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const STATUS_OPTIONS = ['PENDING', 'SHIPPED', 'COMPLETED', 'CANCELED'];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/orders?isAdmin=true', { cache: 'no-store' });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Failed to fetch orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const prev = orders;
    setOrders(prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    setSavingId(orderId);

    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        setOrders(prev); // rollback
        console.error('❌ Failed to update status');
      }
    } catch (e) {
      setOrders(prev); // rollback
      console.error('❌ Error updating status:', e);
    } finally {
      setSavingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const base = "inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold";
    switch (status) {
      case "PENDING":
        return <span className={`${base} bg-yellow-300 text-yellow-900`}><FaClock className="mr-2" />Pending</span>;
      case "SHIPPED":
        return <span className={`${base} bg-blue-300 text-blue-900`}><FaTruck className="mr-2" />Shipped</span>;
      case "COMPLETED":
        return <span className={`${base} bg-green-300 text-green-900`}><FaCheckCircle className="mr-2" />Completed</span>;
      case "CANCELED":
        return <span className={`${base} bg-red-300 text-red-900`}><FaTimesCircle className="mr-2" />Canceled</span>;
      default:
        return <span className={`${base} bg-gray-300 text-gray-900`}>Unknown</span>;
    }
  };

  const statusClass = (s) => {
    switch (s) {
      case 'PENDING': return 'bg-yellow-50 border-yellow-300';
      case 'SHIPPED': return 'bg-blue-50 border-blue-300';
      case 'COMPLETED': return 'bg-green-50 border-green-300';
      case 'CANCELED': return 'bg-red-50 border-red-300';
      default: return 'bg-white border-gray-300';
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Manage Orders</h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#d4a373] text-white text-lg">
              <th className="p-4">ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Shipping</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td className="p-6 text-center text-gray-500" colSpan={5}>Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td className="p-6 text-center text-gray-500" colSpan={5}>No orders.</td></tr>
            ) : (
              orders.map((order, index) => (
                <tr key={order.id} className={`text-center ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition`}>
                  <td className="p-4 font-semibold">{order.id}</td>
                  <td className="p-4">{order.customerName ?? '-'}</td>
                  <td className="p-4 text-green-600 font-bold">${order.totalPrice}</td>

                  <td className="p-4">
                    <div className="mb-2">{getStatusBadge(order.status)}</div>
                    <select
                      value={order.status}
                      disabled={savingId === order.id}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`w-44 border rounded px-3 py-2 text-sm ${statusClass(order.status)} disabled:opacity-60`}
                    >
                      {STATUS_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt[0] + opt.slice(1).toLowerCase()}</option>
                      ))}
                    </select>
                  </td>

                  <td className="p-4">{order.deliveryMethod ?? '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
