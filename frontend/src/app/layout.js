
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from '@/components/Navbar';
import { CartProvider } from '@/context/CartContext';
import ClientLayout from '@/components/ClientLayout';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'HomKhaowHung',
  description: 'Experience the best coffee in the city',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="relative bg-[#f5f3ed]">
        <CartProvider>
          <ClientLayout>
            <Navbar /> 
            <main className="">{children}</main>
          </ClientLayout>
        </CartProvider>
      </body>
    </html>
  );
}
