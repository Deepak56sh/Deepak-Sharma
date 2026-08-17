// ============================================
// FILE: src/app/layout.js
// ============================================
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Loader from '@/components/Loader';
import DynamicFavicon from '@/components/DynamicFavicon';
import DynamicMeta from '@/components/DynamicMeta';
import { CartProvider } from '../context/CartContext';

import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Shree Khodiyar Enterprise',
  description: 'Transform your vision into reality with cutting-edge technology',
  icons: {
    icon: '/faviicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DynamicMeta />
        <DynamicFavicon />
        <CartProvider>
          <Loader />  {/* ✅ Loader ANDAR */}
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}