'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Sprout, Search, Heart, ShoppingCart, User, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

const defaultLinks = [
  { name: 'Home', path: '/' },
  { name: 'Shop', path: '/shop' },
  { name: 'Plants', path: '/shop?type=plants' },
  { name: 'Pots & Planters', path: '/shop?type=planters' },
  { name: 'Care Guide', path: '/care-guide' },
  { name: 'About Us', path: '/about' },
];

const defaultSettings = {
  siteName: 'Plantora',
  siteTagline: '',
  siteLogo: '',
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navLinks, setNavLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(defaultSettings);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { cartCount } = useCart();
  const wishlistCount = 8;

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [pathname]);

  const handleAccountClick = () => {
    router.push(isLoggedIn ? '/account' : '/login');
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(`${API_URL}/menu`);
        const data = await res.json();
        if (data.success && data.data?.length) {
          setNavLinks(data.data);
        } else {
          setNavLinks(defaultLinks);
        }
      } catch {
        setNavLinks(defaultLinks);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_URL}/settings`, { cache: 'no-store' });
        const data = await res.json();
        if (data.success && data.data) {
          setSettings({
            siteName: data.data.siteName || defaultSettings.siteName,
            siteTagline: data.data.siteTagline || '',
            siteLogo: data.data.siteLogo || '',
          });
        }
      } catch {
        // keep defaults
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="plant-store-header">
      {/* Top Bar */}
      <div className="bg-[#14261d] text-white text-center py-2 text-xs sm:text-sm flex items-center justify-center gap-2">
        <Truck className="w-3.5 h-3.5" />
        Free Shipping on orders above ₹999
      </div>

      <nav className={`sticky top-0 z-50 bg-white border-b border-[#e8ece9] transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
              {settings.siteLogo ? (
                <img
                  src={settings.siteLogo}
                  alt={settings.siteName}
                  className="h-16 w-auto max-w-[160px] object-contain"
                />
              ) : (
                <>
                  <div className="w-9 h-9 bg-[#eaf7ee] rounded-xl flex items-center justify-center">
                    <Sprout className="w-5 h-5 text-[#2f9e44]" />
                  </div>
                  <span className="text-xl font-bold text-[#14261d]">{settings.siteName}</span>
                </>
              )}
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">
              {loading
                ? [1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-4 w-14 bg-slate-100 rounded animate-pulse" />
                  ))
                : navLinks.map((link) => (
                    <Link
                      key={link._id || link.path}
                      href={link.type === 'external' ? link.url : link.path}
                      {...(link.type === 'external' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className={`text-[15px] font-medium transition-colors ${
                        pathname === link.path
                          ? 'text-[#2f9e44]'
                          : 'text-[#4b5563] hover:text-[#2f9e44]'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              <button className="p-2.5 rounded-xl text-[#4b5563] hover:bg-[#f6f8f7] hover:text-[#2f9e44] transition-colors hidden sm:flex">
                <Search className="w-5 h-5" />
              </button>

              <Link href="/account/wishlist" className="relative p-2.5 rounded-xl text-[#4b5563] hover:bg-[#f6f8f7] hover:text-[#2f9e44] transition-colors hidden sm:flex">
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-[#2f9e44] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link href="/cart" className="relative p-2.5 rounded-xl text-[#4b5563] hover:bg-[#f6f8f7] hover:text-[#2f9e44] transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-[#2f9e44] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                onClick={handleAccountClick}
                className="p-2.5 rounded-xl text-[#4b5563] hover:bg-[#f6f8f7] hover:text-[#2f9e44] transition-colors hidden sm:flex"
              >
                <User className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl bg-[#eaf7ee] text-[#2f9e44] ml-1"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-[#e8ece9] py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link._id || link.path}
                  href={link.type === 'external' ? link.url : link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                    pathname === link.path
                      ? 'bg-[#eaf7ee] text-[#2f9e44]'
                      : 'text-[#4b5563] hover:bg-[#f6f8f7]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleAccountClick();
                }}
                className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-[#4b5563] hover:bg-[#f6f8f7]"
              >
                {isLoggedIn ? 'My Account' : 'Login / Register'}
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}