import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="relative bg-gray-800 text-white">
      <Image
        src="/images/bannerw.png"
        alt="Promotion"
        fill style={{ objectFit: 'cover' }}
        className="absolute inset-0 z-0 opacity-50"
      />
      <div className="relative z-10 container mx-auto text-center py-20 px-4">
        <h1 className="text-4xl font-bold mb-4">"Delicious meals, made fresh just for you!"</h1>
        <p className="text-lg mb-6">Order your favorite dishes and enjoy the taste of Hom Khao Hung.</p>
        <Link href="/menu">
          <button className="bg-[#d4a373] text-white py-2 px-6 rounded-lg hover:bg-[#b08968]">
            Order Now
          </button>
        </Link>
      </div>
    </header>
  );
}
