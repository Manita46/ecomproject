'use client';
import { useEffect, useState } from 'react';
import { FaBoxOpen, FaShoppingCart } from "react-icons/fa";

export default function Dashboard() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setTotalProducts(data.length));

    fetch('http://localhost:5000/api/orders?isAdmin=true')
      .then(res => res.json())
      .then(data => setTotalOrders(data.length));
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-800"> Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Products */}
        <div className="bg-white shadow-lg p-6 rounded-lg flex items-center justify-between border-l-8 border-green-400 transform hover:scale-105 transition duration-300">
          <div>
            <h2 className="text-xl font-bold text-gray-700">Total Products</h2>
            <p className="text-3xl font-semibold text-green-600 mt-2">{totalProducts}</p>
          </div>
          <FaBoxOpen className="text-green-400 text-5xl" />
        </div>

        {/* Total Orders */}
        <div className="bg-white shadow-lg p-6 rounded-lg flex items-center justify-between border-l-8 border-blue-400 transform hover:scale-105 transition duration-300">
          <div>
            <h2 className="text-xl font-bold text-gray-700">Total Orders</h2>
            <p className="text-3xl font-semibold text-blue-600 mt-2">{totalOrders}</p>
          </div>
          <FaShoppingCart className="text-blue-400 text-5xl" />
        </div>
      </div>
    </div>
  );
}
