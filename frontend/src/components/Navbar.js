'use client';

import Link from 'next/link';
import { FaShoppingCart } from 'react-icons/fa';
import { MdRamenDining } from "react-icons/md";
import { useCart } from '@/context/CartContext';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';


export default function Navbar() {
  const { cartCount } = useCart();
  const router = useRouter();
  const pathname = usePathname(); 

  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  const syncUser = () => {
    try {
      const rawUser = localStorage.getItem('user');
      const rawRole = localStorage.getItem('role');
      const parsed = rawUser && rawUser !== 'undefined' ? JSON.parse(rawUser) : null;
      if (parsed && rawRole) parsed.role = rawRole.toUpperCase(); // ADMIN/USER
      setUser(parsed);
    } catch (e) {
      console.error('❌ Error parsing user JSON:', e);
      setUser(null);
    }
  };

    useEffect(() => {
      if (typeof window === 'undefined') return;
      syncUser();
      setReady(true);
    }, []);

    useEffect(() => {
      if (!ready) return;
      syncUser();
    }, [pathname, ready]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setUser(null);
    router.replace('/');
  };

  if (!ready) return null;

  const displayName = user?.name;

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/70 backdrop-blur-md shadow-md z-50">
      <div className="w-full flex justify-between items-center py-4 px-16">

        {/* Logo */}
        <div className="flex items-center space-x-2">
          <MdRamenDining size={28} className="text-gray-800" />
          <Link href="/" className="text-2xl font-bold text-gray-800">
            HomKhaowHung Restaurant
          </Link>
        </div>

        {/* Menu Links */}
        <div className="hidden md:flex space-x-6 text-gray-600">
          <Link href="/" className="hover:text-gray-800">Home</Link>
          <Link href="/menu" className="hover:text-gray-800">Menu</Link>
          <Link href="/about" className="hover:text-gray-800">About</Link>
          <Link href="/contact" className="hover:text-gray-800">Contact</Link>

          {/* แสดง "My Orders" เฉพาะลูกค้า */}
          {user && user?.role !== 'ADMIN' && (
            <Link href="/orders" className="hover:text-gray-800">My Orders</Link>
          )}

          {/* แสดง "Dashboard" แอดมิน */}
          {user && user?.role === 'ADMIN' && (
            <Link href="/admin/dashboard" className="hover:text-gray-800">Dashboard</Link>
          )}
        </div>

        {/* Right Section: User & Cart */}
        <div className="flex items-center space-x-6">
          {user?.role === 'ADMIN' ? (
            <div className="flex items-center space-x-4">
              <span className="font-semibold text-yellow-600">Admin</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          ) : user ? (
            <div className="flex items-center space-x-4">
              <span className="font-semibold text-gray-700">{displayName}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-[#d4a373] text-white px-4 py-2 rounded-lg hover:bg-[#b08968] transition"
            >
              Login
            </Link>
          )}

          {/* Cart (ไม่แสดงให้แอดมิน) */}
          {(!user || user?.role !== 'ADMIN') && (
            <Link href="/cart" className="relative text-gray-800 hover:text-gray-600">
              <FaShoppingCart size={24} aria-label="Shopping Cart" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-sm rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}