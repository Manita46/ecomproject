'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { QRCodeCanvas } from 'qrcode.react'; // ✅ Import QR Code Generator

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('dine-in'); 
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const calculatedTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(calculatedTotal);
  }, [cartItems]);

  const handleCheckout = async () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setErrorMessage("❌ Please log in before placing an order.");
      return;
    }

    const user = JSON.parse(storedUser);
    if (!user || !user.id) {
      setErrorMessage("❌ Invalid user data. Please log in again.");
      return;
    }

    if (cartItems.length === 0) {
      setErrorMessage('❌ Your cart is empty!');
      return;
    }

    if (!customerName || (!address && deliveryMethod === 'delivery') || !phone) {
      setErrorMessage('❌ Please fill in all required fields.');
      return;
    }

    const orderData = {
      userId: user.id,
      customerName,
      phone,
      address: deliveryMethod === 'delivery' ? address : 'N/A',
      totalPrice,
      status: "PENDING",
      paymentMethod,
      deliveryMethod,
      orderItems: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      }))
    };

    console.log("🚀 Sending order data:", JSON.stringify(orderData, null, 2));

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        console.log("✅ Order placed successfully!");
        clearCart();
        localStorage.removeItem('cartItems');
        router.push('/order-success');
      } else {
        alert("❌ Failed to place order!");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Failed to place order!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-10 bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Checkout</h2>

      {errorMessage && (
        <div className="bg-red-100 text-red-700 border border-red-400 p-3 rounded-md mb-4 text-center">
          {errorMessage}
        </div>
      )}

      {/* 🔥 แสดงรายการสินค้าจากตะกร้า */}
      <div className="bg-gray-100 p-5 rounded-lg mb-6">
        <h3 className="font-semibold text-lg border-b pb-2 mb-3">🛒 Your Order</h3>
        {cartItems.map((item, index) => (
          <p key={index} className="text-gray-700 flex justify-between">
            <span>{item.name} x {item.quantity}</span> 
            <span className="font-semibold">${item.price * item.quantity}</span>
          </p>
        ))}
        <p className="font-bold text-lg mt-3 border-t pt-2 flex justify-between">
          <span>Total:</span>
          <span className="text-green-600">${totalPrice.toFixed(2)}</span>
        </p>
      </div>

       {/* ฟอร์มข้อมูลลูกค้า */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
        />

        {/* 🔹 ตัวเลือกการจัดส่ง */}
        <h3 className="font-semibold">Delivery Method</h3>
        <div className="flex gap-4">
          {["dine-in", "takeaway", "delivery"].map((method) => (
            <button
              key={method}
              className={`w-1/3 p-3 border rounded-lg ${
                deliveryMethod === method ? "bg-[#f3e8ff] border-[#9333ea]" : "bg-white border-gray-300"
              }`}
              onClick={() => setDeliveryMethod(method)}
            >
              {method === "dine-in" ? "🍽 Dine-in" : method === "takeaway" ? "🥡 Takeaway" : "🚚 Delivery"}
            </button>
          ))}
        </div>

        {deliveryMethod === "delivery" && (
          <input
            type="text"
            placeholder="Delivery Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
          />
        )}

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
        />

        {/* 🔹 ตัวเลือกการชำระเงิน */}
        <h3 className="font-semibold">Payment Method</h3>
        <div className="flex gap-4">
          {["cash", "credit", "scan"].map((method) => (
            <button
              key={method}
              className={`w-1/3 p-3 border rounded-lg ${
                paymentMethod === method ? "bg-[#dbeafe] border-[#2563eb]" : "bg-white border-gray-300"
              }`}
              onClick={() => setPaymentMethod(method)}
            >
              {method === "cash" ? "💵 Cash" : method === "credit" ? "💳 Credit Card" : "📱 Scan to Pay"}
            </button>
          ))}
        </div>

        {paymentMethod === "credit" && (
          <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
            <input
              type="text"
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Expiry Date (MM/YY)"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-1/2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-1/2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        )}
        
        {paymentMethod === "scan" && (
          <div className="flex flex-col items-center space-y-4">
            <h2 className="text-lg font-semibold">📌 Scan to Pay</h2>
            <QRCodeCanvas value="https://yourstore.com/invalid-payment" size={200} />
            <p className="text-gray-500">Scan the QR code to complete the payment.</p>
          </div>
        )}

        <button
          onClick={handleCheckout}
          className="bg-[#8B5E3C] hover:bg-[#6D4C31] text-white font-bold p-3 rounded-lg w-full transition duration-300"
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
}
