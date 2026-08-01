'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sprout, Search, Heart, ShoppingCart, User, Truck } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navLinks, setNavLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // Placeholder counts — swap for real cart/wishlist state once backend cart API is wired.
  const cartCount = 3;
  const wishlistCount = 8;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('https://my-site-backend-0661.onrender.com/api/menu');
        const data = await response.json();
        if (data.success && data.data?.length) {
          setNavLinks(data.data);
        } else {
          throw new Error('empty menu');
        }
      } catch (error) {
        // Fallback to the Plant Store default menu
        setNavLinks([
          { name: 'Home', path: '/', type: 'internal' },
          { name: 'Shop', path: '/shop', type: 'internal' },
          { name: 'Plants', path: '/shop?type=plants', type: 'internal' },
          { name: 'Pots & Planters', path: '/shop?type=planters', type: 'internal' },
          { name: 'Care Guide', path: '/care-guide', type: 'internal' },
          { name: 'About Us', path: '/about', type: 'internal' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const renderLink = (link) => {
    const isActive = pathname === link.path;
    return (
      <Link
        href={link.path}
        className={`text-sm font-medium transition-colors relative ${
          isActive ? 'text-[var(--ps-primary)]' : 'text-slate-600 hover:text-[var(--ps-primary)]'
        }`}
      >
        {link.name}
      </Link>
    );
  };

  return (
    <div className="plant-store">
      {/* Top announcement bar */}
      <div className="bg-[var(--ps-dark)] text-white text-center py-2 text-xs sm:text-sm flex items-center justify-center gap-2">
        <Truck className="w-3.5 h-3.5" />
        Free Shipping on orders above ₹999
      </div>

      <nav
        className={`sticky top-0 z-50 bg-white transition-shadow ${
          scrolled ? 'shadow-sm border-b border-[var(--ps-border)]' : 'border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-9 h-9 bg-[var(--ps-primary-light)] rounded-lg flex items-center justify-center">
                <Sprout className="w-5 h-5" style={{ color: 'var(--ps-primary)' }} />
              </div>
              <span className="text-xl font-bold text-slate-800">Plantora</span>
            </Link>

            {/* Center links */}
            <div className="hidden md:flex items-center gap-7">
              {loading
                ? [1, 2, 3, 4].map((i) => <div key={i} className="h-4 w-16 bg-slate-100 rounded animate-pulse" />)
                : navLinks.map((link) => <div key={link._id || link.path}>{renderLink(link)}</div>)}
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-600 hover:text-[var(--ps-primary)] transition-colors hidden sm:flex">
                <Search className="w-5 h-5" />
              </button>
              <Link href="/account/wishlist" className="p-2 hover:bg-slate-50 rounded-lg text-slate-600 hover:text-[var(--ps-primary)] transition-colors relative hidden sm:flex">
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-[var(--ps-primary)] text-white text-[10px] rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link href="/cart" className="p-2 hover:bg-slate-50 rounded-lg text-slate-600 hover:text-[var(--ps-primary)] transition-colors relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-[var(--ps-primary)] text-white text-[10px] rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link href="/account" className="p-2 hover:bg-slate-50 rounded-lg text-slate-600 hover:text-[var(--ps-primary)] transition-colors hidden sm:flex">
                <User className="w-5 h-5" />
              </Link>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-[var(--ps-primary-light)] text-[var(--ps-primary)]"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-[var(--ps-border)] space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link._id || link.path}
                  href={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                    pathname === link.path
                      ? 'bg-[var(--ps-primary-light)] text-[var(--ps-primary)]'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/account"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                My Account
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}