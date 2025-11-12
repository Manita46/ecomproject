'use client';

import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function CoffeeGrid() {

  const { addToCart } = useCart();

  const coffees = [
    {
      id: "cg-1",
      name: 'Mango Sticky Rice',
      description: 'Sweet ripe mango served with coconut milk sticky rice.',
      price: '85',
      image: '/images/stickyrice.png',
    },
    {
      id: "cg-2",
      name: 'Tom Yum Noodles',
      description: 'Spicy and sour Thai noodles in Tom Yum broth with shrimp, lime, and herbs.',
      price: '80',
      image: '/images/Tom Yum Noodles.png',
    },
    {
      id: "cg-3",
      name: 'Spring Rolls',
      description: 'Crispy golden-fried rolls filled with vegetables and served with sweet chili sauce.',
      price: '60',
      image: '/images/roll.png',
    },
  ];

  return (
  <div className="container mx-auto py-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
      {coffees.map((coffee) => (
        <div
          key={coffee.name}
          className="bg-white shadow-lg rounded-lg p-4 w-full max-w-[320px] flex flex-col"
        >
          <Image
            src={coffee.image}
            alt={coffee.name}
            width={400}
            height={300}
            className="rounded-t-lg object-cover w-full h-auto"
          />

          <h3 className="font-semibold text-lg mt-4 text-center">
            {coffee.name}
          </h3>

          <p className="text-sm text-gray-500 mt-2 text-center">
            {coffee.description}
          </p>

          <div className="mt-auto w-full">
            <div className="flex justify-between items-center">
              <span className="text-lg text-gray-600 font-bold">
                Price: {coffee.price}
              </span>
            </div>
            <button
              onClick={() =>
                addToCart({ ...coffee, price: Number(coffee.price) })
              }
              className="w-full mt-3 bg-[#d4a373] text-white py-2 px-6 rounded-lg hover:bg-[#b08968] transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);
}
