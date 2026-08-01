'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sprout, Instagram, Facebook, Twitter, Youtube, Send } from 'lucide-react';

const defaultFooter = {
  logoText: 'Plantora',
  description: 'Bringing nature closer to home. Premium plants carefully packed and delivered to your door.',
  socialLinks: [
    { icon: 'Instagram', url: '#' },
    { icon: 'Facebook', url: '#' },
    { icon: 'Twitter', url: '#' },
    { icon: 'Youtube', url: '#' },
  ],
  quickLinks: [
    { name: 'Home', url: '/' },
    { name: 'Shop', url: '/shop' },
    { name: 'Care Guide', url: '/care-guide' },
    { name: 'About Us', url: '/about' },
    { name: 'Contact Us', url: '/contact' },
  ],
  collections: [
    { name: 'Indoor Plants', url: '/shop?type=indoor' },
    { name: 'Air Purifying', url: '/shop?type=air-purifying' },
    { name: 'Low Maintenance', url: '/shop?type=low-maintenance' },
    { name: 'Succulents', url: '/shop?type=succulents' },
    { name: 'Large Plants', url: '/shop?type=large' },
    { name: 'Accessories', url: '/shop?type=accessories' },
  ],
  customerCare: [
    { name: 'My Account', url: '/account' },
    { name: 'Track Order', url: '/account?tab=orders' },
    { name: 'Returns & Refunds', url: '/returns' },
    { name: 'Shipping Policy', url: '/shipping' },
    { name: 'Terms & Conditions', url: '/terms' },
    { name: 'Privacy Policy', url: '/privacy' },
  ],
};

const iconMap = { Instagram, Facebook, Twitter, Youtube };

export default function Footer() {
  const [footerData, setFooterData] = useState(null);
  const [email, setEmail] = useState('');
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const res = await fetch('https://my-site-backend-0661.onrender.com/api/footer');
        const data = await res.json();
        if (data.success && data.data) {
          setFooterData(data.data);
        } else {
          setFooterData(defaultFooter);
        }
      } catch {
        setFooterData(defaultFooter);
      }
    };
    fetchFooter();
  }, []);

  const data = footerData || defaultFooter;

  return (
    <footer style={{ backgroundColor: '#14261d' }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
       {/* Brand */}
<div className="lg:col-span-4">
  <Link href="/" className="flex items-center gap-2.5 mb-5">
    {(() => {
      const img = data.logoImage;
      if (img) {
        const src = img.startsWith('http') ? img : `https://my-site-backend-0661.onrender.com${img}`;
        return (
          <img
            src={src}
            alt={data.logoText || 'Plantora'}
            className="h-10 w-auto object-contain"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        );
      }
      return (
        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
          <Sprout className="w-5 h-5 text-[#2f9e44]" />
        </div>
      );
    })()}
    <span className="text-2xl font-bold">{data.logoText || 'Plantora'}</span>
  </Link>
  <p className="text-white/60 text-sm leading-relaxed max-w-sm mb-6">
    {data.description}
  </p>
  {/* social links same... */}
</div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {(data.quickLinks || defaultFooter.quickLinks).map((link, i) => (
                <li key={i}>
                  <Link href={link.url} className="text-sm text-white/60 hover:text-[#2f9e44] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-5">Collections</h4>
            <ul className="space-y-3">
              {(data.collections || defaultFooter.collections).map((link, i) => (
                <li key={i}>
                  <Link href={link.url} className="text-sm text-white/60 hover:text-[#2f9e44] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-5">Customer Care</h4>
            <ul className="space-y-3">
              {(data.customerCare || defaultFooter.customerCare).map((link, i) => (
                <li key={i}>
                  <Link href={link.url} className="text-sm text-white/60 hover:text-[#2f9e44] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-5">Join the Plant Lovers Club</h4>
            <p className="text-sm text-white/60 mb-4">Get plant care tips, offers and more.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 bg-white/10 border border-white/10 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#2f9e44]"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-[#2f9e44] hover:bg-[#1f7a34] text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Subscribe
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/50">
            © {currentYear} {data.logoText}. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {['VISA', 'Mastercard', 'UPI', 'RuPay'].map((method) => (
              <span key={method} className="px-3 py-1.5 bg-white/10 rounded-lg text-[11px] font-medium text-white/70">
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}