'use client';

import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import { useState } from 'react';

export default function CartPage() {
  const router = useRouter();
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();
  const [errorMessage, setErrorMessage] = useState("");

  if (!cartItems || !Array.isArray(cartItems)) {
    return <p className="text-center text-gray-600">Your cart is empty.</p>;
  }

  const handleCheckout = () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setErrorMessage("❌ Please Login before checkout!");
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      if (user) {

        if (cartItems.length === 0) {
          alert("Your cart is empty!");
          return;
        }
        router.push("/checkout");
      } else {
        throw new Error("Invalid user data");
      }
    } catch (error) {

      console.error("❌ Error parsing user JSON:", error);
      localStorage.removeItem("user");
      setErrorMessage("❌ Your session has expired. Please log in again.");
      console.error("Error parsing user JSON:", error);
      localStorage.removeItem("user");
      router.push("/login");
    }
  };

  return (
    <div className="container mx-auto py-10 px-6">
      {errorMessage && (
        <div className="bg-red-100 text-red-700 border border-red-400 p-3 rounded-md mb-4 text-center">
          {errorMessage}
        </div>
      )}

      <h1 className="text-center text-3xl font-bold mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-600">
          <FaShoppingCart size={70} className="mx-auto text-gray-400 mb-4" />
          <p>Your cart is empty.</p>
          <Link href="/menu" className="text-[#d4a373] hover:underline">
            Go shopping
          </Link>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          {cartItems.map((item, index) => (
            <div
              key={item.id || index}
              className="flex items-center justify-between border-b pb-4 mb-4"
            >
              <div className="w-1/3">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-gray-600">
                  ${typeof item.price === 'number' ? item.price.toFixed(2) : Number(item.price).toFixed(2)}
                </p>
              </div>

              <div className="flex items-center gap-2 w-1/3 justify-center">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="bg-gray-300 px-3 py-1 rounded w-8 h-8 flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-lg font-bold text-center w-6">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="bg-gray-300 px-3 py-1 rounded w-8 h-8 flex items-center justify-center"
                >
                  +
                </button>
              </div>

              <div className="w-1/3 flex justify-end">
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                  <FaTrash size={20} />
                </button>
              </div>
            </div>
          ))}

          {/* สรุปราคา */}
          <div className="text-right mt-6">
            <h2 className="text-xl font-semibold">Total: ${totalPrice.toFixed(2)}</h2>
            <button
              className="mt-4 bg-[#d4a373] text-white py-2 px-6 rounded-lg hover:bg-[#b08968]"
              onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
