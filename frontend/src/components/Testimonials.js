'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews');
        const data = await response.json();
        setTestimonials(data);
      } catch (error) {
        console.error("❌ Failed to fetch reviews:", error);
      }
    };
    fetchReviews();
  }, []);

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-6">
        <h2 className="text-center text-3xl font-bold text-[#8B5A2B] mb-8">Happy Customers</h2>

        {/* 📌 Swiper Config */}
        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView={3} 
          slidesPerGroup={3} 
          spaceBetween={30}
          navigation
          pagination={{ clickable: true }}
          loop={true}
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="p-6 bg-gray-100 rounded-lg shadow-lg border-l-4 border-[#8B5A2B]">
                <p className="text-lg italic">"{testimonial.message}"</p>
                <span className="block mt-4 font-bold text-[#5C4033]">- {testimonial.name}</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
