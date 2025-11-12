'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !message) {
      alert("Please enter your name and message.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message }),
      });

      if (response.ok) {
        alert('✅ Message sent successfully!');
        setName('');
        setEmail('');
        setMessage('');
        
        // ✅ Redirect to update testimonials
        router.refresh();
      } else {
        alert('❌ Failed to send message.');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Error sending message.');
    }

    setLoading(false);
  };
  
  return (
    <div className="container mx-auto py-10 px-6">
      <h1 className="text-center text-3xl font-bold mb-6">Contact Us</h1>

      {/* 📍 แผนที่ */}
      <div className="text-center mb-12">
        <h2 className="text-2xl font-semibold">Visit Our Café</h2>
        <p className="mt-2 text-gray-600">123 Coffee Street, Downtown, City</p>
        <iframe
          className="w-full md:w-3/4 h-60 mx-auto mt-4 rounded-lg shadow-lg"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1145.8434165688932!2d102.12070354947025!3d14.984793659194134!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31194c7f1c4f1ce1%3A0x4469e73e68885998!2z4LiE4LiT4Liw4Lin4Li04LiX4Lii4Liy4Lio4Liy4Liq4LiV4Lij4LmM4LmB4Lil4Liw4Lio4Li04Lil4Lib4Lio4Liy4Liq4LiV4Lij4LmM!5e0!3m2!1sth!2sth!4v1738162285092!5m2!1sth!2sth"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>

      {/* 📞 ข้อมูลติดต่อ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div>
          <h3 className="text-lg font-semibold">Phone</h3>
          <p className="text-gray-600">+1 234 567 890</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Email</h3>
          <p className="text-gray-600">hello@birthbutwiiddmii.com</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Follow Us</h3>
          <p className="text-gray-600">
            <a href="https://www.instagram.com/" className="text-[#d4a373] hover:underline">Instagram</a> | 
            <a href="https://www.facebook.com/" className="text-[#d4a373] hover:underline">Facebook</a>
          </p>
        </div>
      </div>

      {/* ✉️ ฟอร์มส่งข้อความ */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold">Send us a message</h2>
        <form className="mt-4 max-w-lg mx-auto" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Your Name" 
            className="w-full p-3 border rounded-lg mb-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input 
            type="email" 
            placeholder="Your Email" 
            className="w-full p-3 border rounded-lg mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <textarea 
            placeholder="Your Message" 
            className="w-full p-3 border rounded-lg mb-4 h-32"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <button 
            type="submit" 
            className="bg-[#d4a373] text-white py-2 px-6 rounded-lg hover:bg-[#b08968]"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}
