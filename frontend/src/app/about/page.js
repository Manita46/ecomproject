'use client';

import Image from 'next/image';

export default function About() {
  return (
    <div className="container mx-auto py-12 px-6">
      <h1 className="text-center text-4xl font-bold text-[#5C4033] mb-8">
        About Us
      </h1>

      <div className="flex flex-col md:flex-row items-center mb-16 bg-[#FFF8F0] p-8 rounded-xl shadow-lg md:gap-16 gap-8">
        <div className=" ">
          <Image
            src="/images/cafe.png"
            alt="Cafe"
            width={450}
            height={280}
            className="rounded-xl shadow-2xl transition-transform transform hover:scale-105"
          />
        </div>

        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-4xl font-bold text-[#8B5A2B] mb-4 flex items-center gap-2">
            <span>☕</span> Our Story
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            Our café began as a small passion project, driven by a love for coffee and community. 
            We carefully source the finest coffee beans and craft each cup with dedication. 
            Our cozy space is designed to bring warmth, happiness, and the perfect brew to your day. 
            Come and be part of our story.
          </p>
          {/* <button className="mt-4 px-6 py-2 bg-[#D4A373] text-white font-medium rounded-lg shadow-md hover:bg-[#B08968] transition">
            Discover More
          </button> */}
        </div>
      </div>


      {/* 👨‍🍳 ทีมงานของเรา */}
      <div className="text-center">
        <h2 className="text-3xl font-semibold text-[#8B5A2B] mb-6">
          Meet Our Team
        </h2>

        <div className="flex justify-center gap-20">
          {/* 🌟 สมาชิกทีม 1 */}
          <div className="text-center">
            <Image
              src="/images/fern.jpg"
              alt="Barista"
              width={180}
              height={180}
              className="rounded-full mx-auto shadow-lg transition-transform transform hover:scale-110"
            />
            <p className="mt-4 font-medium text-lg text-[#5C4033]">Manita Siripuripakorn</p>
            <p className="text-gray-600">65162110083-7</p>
          </div>

          {/* 🌟 สมาชิกทีม 2 */}
          <div className="text-center">
            <Image
              src="/images/ploy.jpg"
              alt="Barista"
              width={180}
              height={180}
              className="rounded-full mx-auto shadow-lg transition-transform transform hover:scale-110"
            />
            <p className="mt-4 font-medium text-lg text-[#5C4033]">Manassawee Sangboonthai</p>
            <p className="text-gray-600">65162110387-4</p>
          </div>

        </div>
      </div>
    </div>
  );
}
