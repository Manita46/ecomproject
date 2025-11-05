'use client';

import Header from '@/components/Header';
import CategorySection from '@/components/CategorySection';
import CoffeeGrid from '@/components/CoffeeGrid';
import Testimonials from '@/components/Testimonials';
import BannerSlider from '../components/BannerSlider';
import { useCart } from '@/context/CartContext';
import { FaStar } from 'react-icons/fa';

export default function Home() {

  return (
    <>
      {/* Header Section */}
      <Header />

      {/* Categories Section */}
      <CategorySection className="mt-6" />

      {/* 🔥 Image Slider */}
      <div className="mt-2">
        <BannerSlider />
      </div>

      <section className="container mx-auto py-20 px-4">
        <h2 className="text-center text-2xl font-bold mb-4 flex items-center justify-center">
          Our Recommend Menu
          <FaStar className="ml-2 text-[#d4a373]" />
        </h2>
        <CoffeeGrid />
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 HomKhaowHung Restaurant. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
