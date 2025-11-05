'use client';

import Link from 'next/link';

export default function CategorySection() {
    const categories = [
      { icon: '🥗', name: 'Appetizers', link: '/menu?category=appetizers' },
      { icon: '🍛', name: 'Main Dishes', link: '/menu?category=main dishes' },
      { icon: '🍰', name: 'Desserts', link: '/menu?category=desserts' },
      { icon: '🥤', name: 'Drinks', link: '/menu?category=drinks' },
      // { icon: '🍔', name: 'Food', link: '/menu?category=food' },
    ];
  
    return (
      <section className="container mx-auto py-10">
        <div className="flex justify-center space-x-16">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.link}
              className="flex flex-col items-center text-gray-800 hover:text-[#d4a373] transition duration-300"
            >
              <span className="text-4xl">{category.icon}</span>
              <p className="mt-2 font-medium">{category.name}</p>
            </Link>
          ))}
        </div>
      </section>
    );
  }
  