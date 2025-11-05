'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const role = (localStorage.getItem('role') || '').toUpperCase();

    if (role === 'ADMIN') {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/login');
    }
  }, [router]);

   return (
    <div className="flex justify-center items-center h-screen text-gray-700 text-lg">
      Loading...
    </div>
    );
}
