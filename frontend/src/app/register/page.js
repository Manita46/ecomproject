'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/login'); // ✅ สมัครเสร็จแล้วให้ไปหน้า Login
      } else {
        setError(data.error || '❌ Registration failed.');
      }
    } catch (error) {
      setError('❌ Something went wrong, please try again later.');
    }
  };

  return (
    <div className="relative h-screen flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="absolute inset-0 bg-[url('/images/background.jpg')] bg-cover bg-center filter blur-md opacity-30"></div>

      <div className="relative z-10 bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Register</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleRegister} className="flex flex-col space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
            />
          </div>

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
            className="w-full bg-[#d4a373] text-white py-2 rounded-lg hover:bg-[#b08968] transition"
          >
            Register
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-sm text-gray-500">Already have an account?</span>
          <a href="/login" className="ml-1 text-sm text-[#d4a373] font-bold hover:text-[#b08968]">
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
