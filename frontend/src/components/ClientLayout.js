'use client'; // ✅ บอกว่าไฟล์นี้เป็น Client Component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";

export default function ClientLayout({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // ✅ ตรวจสอบ Token และโหลดข้อมูล User
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        try {
          const parsedUser = JSON.parse(storedUser); // แปลง JSON String → Object
          setUser(parsedUser);
        } catch (error) {
          console.error("❌ Error parsing user JSON:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login"); // ✅ กลับไปหน้า Login
  };

  return (
    <CartProvider>
      <Navbar user={user} onLogout={handleLogout} />
      <main className="pt-16">{children}</main>
    </CartProvider>
  );
}
