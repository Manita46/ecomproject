'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaExclamationCircle, FaSpinner } from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
        const role = (localStorage.getItem('role') || '').toUpperCase();
        if (role === 'ADMIN') router.replace('/admin/dashboard');
        else if (role === 'USER') router.replace('/orders');
      }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login Success:", data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user?.role || data.role);
        localStorage.setItem('user', JSON.stringify(data.user));

        const role = (data.user?.role || data.role || '').toUpperCase();

        if (data.role === 'ADMIN') {
          router.replace('/admin/dashboard');
        } else {
          router.replace('/orders');
        }
        // setTimeout(() => window.location.reload(), 500);
      } else {
        setError('❌ Invalid email or password');
      }
      return;
    } catch (error) {
      console.error("❌ Error logging in:", error);
      setError('❌ Server error. Please try again later.');
    }
    setLoading(false);
  };

  return (
    <div className="relative h-screen flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="absolute inset-0 bg-[url('/images/background.jpg')] bg-cover bg-center filter blur-md opacity-30"></div>

      <div className="relative z-10 bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Login</h2>

        {error && (
          <div className="flex items-center text-red-500 text-sm bg-red-100 border border-red-400 p-3 rounded-lg mb-4">
            <FaExclamationCircle className="mr-2" /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col space-y-4">

          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
            />
          </div>

          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-2 rounded-lg transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#d4a373] hover:bg-[#b08968]'}`}
          >
            {loading ? <FaSpinner className="animate-spin mx-auto" /> : "Login"}
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-sm text-gray-500">Don't have an account?</span>
          <a href="/register" className="ml-1 text-sm text-[#d4a373] font-bold hover:text-[#b08968]">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
