'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { FaCoffee, FaMugHot, FaGlassWhiskey, FaBirthdayCake, FaHamburger } from 'react-icons/fa';

export default function MenuPage() {
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'Appetizers'; // ค่าหมวดหมู่เริ่มต้น = 'Appetizers'

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { icon: '🥗', name: 'Appetizers', value: 'appetizers' },
    { icon: '🍛', name: 'Main Dishes', value: 'main dishes' },
    { icon: '🍰', name: 'Desserts', value: 'desserts' },
    { icon: '🥤', name: 'Drinks', value: 'drinks' },
    // { icon: '🍔', name: 'Food', value: 'food' },
  ];

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/products/${category}`);
        const data = await res.json();
        setMenuItems(data);
      } catch (error) {
        console.error("❌ Failed to fetch menu:", error);
      }
      setLoading(false);
    };

    fetchMenu();
  }, [category]);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-center space-x-8 mb-8">
        {categories.map((cat) => (
          <Link key={cat.name} href={`/menu?category=${cat.value}`} className="flex flex-col items-center">
            <span className={`text-4xl ${category === cat.value ? 'text-[#d4a373]' : 'text-gray-800'}`}>
              {cat.icon}
            </span>
            <span className={`font-semibold mt-2 ${category === cat.value ? 'text-[#d4a373]' : 'text-gray-800'}`}>
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
  
      {loading ? (
        <p className="text-center text-gray-600">Loading menu...</p>
      ) : menuItems.length === 0 ? (
        <p className="text-center text-gray-600">No items available in this category.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item) => (
            <div key={item.id} className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center w-full transition-transform transform hover:scale-105">
              {/* 🔹 เพิ่มความยาวของรูปภาพ */}
              <img 
                src={item.image || "/images/placeholder.jpg"} 
                alt={item.name} 
                className="w-full h-90 object-cover rounded-lg shadow-md"
              />
              <h3 className="font-bold text-lg mt-4 text-[#5C4033]">{item.name}</h3>
              
              <div className="mt-2 text-center">
                <p className="text-gray-700 text-sm italic">"{item.description || "No description available."}"</p>
                <p className="text-gray-600 text-xs mt-2">
                  <span className="font-semibold">Ingredients:</span> {item.Ingredients || "Not specified"}
                </p>
              </div>
  
              {/* 🔹 Price Section */}
              <p className="text-[#8B5E3C] font-bold mt-3 text-lg">Price: {item.price} ฿</p>
  
              {/* 🔹 ปุ่ม Add to Cart */}
              <button 
                onClick={() => addToCart(item)}
                className="mt-4 bg-[#d4a373] text-white py-2 px-5 rounded-lg hover:bg-[#b08968] transition-shadow shadow-md hover:shadow-lg"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
  
}
