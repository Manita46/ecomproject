'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';

const banners = [
  "/images/pro1.png",
  "/images/banner2.png",
  "/images/banner3.jpg",
];

export default function BannerSlider() {
    return (
        <div className="max-w-[1600px] w-screen mx-auto mt-10">
          <Swiper
            slidesPerView={1}
            loop={true}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            modules={[Pagination, Autoplay]}
            className="w-full"
          >
            {banners.map((src, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full max-w-[1400px] mx-auto h-[550px]">
                  <Image
                    src={src}
                    alt={`Banner ${index + 1}`}
                    width={1400} 
                    height={550} 
                    style={{ objectFit: 'contain' }}
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      );
}