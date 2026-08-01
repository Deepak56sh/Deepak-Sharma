'use client';
import { useState, useEffect } from 'react';
import { Sprout, Facebook, Twitter, Instagram, Youtube, Mail, Send } from 'lucide-react';

const iconComponents = { Facebook, Twitter, Instagram, Youtube, Mail };

const defaultFooter = {
  logoText: 'Plantora',
  description: 'Bringing nature closer to home. Premium, hand-picked plants and expert care tips, carefully packed and delivered to your door.',
  socialLinks: [
    { icon: 'Instagram', url: '#' },
    { icon: 'Facebook', url: '#' },
    { icon: 'Twitter', url: '#' },
    { icon: 'Youtube', url: '#' },
  ],
  quickLinks: [
    { name: 'Home', url: '/' },
    { name: 'Shop', url: '/shop' },
    { name: 'My Account', url: '/account' },
    { name: 'Track Order', url: '/account?tab=orders' },
    { name: 'Contact Us', url: '/contact' },
  ],
  serviceLinks: [
    { name: 'Indoor Plants', url: '/shop?type=indoor' },
    { name: 'Air Purifying', url: '/shop?type=air-purifying' },
    { name: 'Low Maintenance', url: '/shop?type=low-maintenance' },
    { name: 'Large Plants', url: '/shop?type=large' },
    { name: 'Accessories', url: '/shop?type=accessories' },
  ],
  copyrightText: 'All rights reserved.',
};

export default function Footer() {
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      const response = await fetch('https://my-site-backend-0661.onrender.com/api/footer');
      const data = await response.json();
      if (data.success && data.data) {
        setFooterData(data.data);
      } else {
        throw new Error('empty footer');
      }
    } catch (error) {
      setFooterData(defaultFooter);
    } finally {
      setLoading(false);
    }
  };

  const data = footerData || defaultFooter;

  if (loading) {
    return <footer className="plant-store bg-[var(--ps-dark)] h-64 animate-pulse" />;
  }

  return (
    <footer className="plant-store bg-[var(--ps-dark)] text-white">
      {/* Newsletter strip */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-lg">Join the Plant Lovers Club 🌿</h3>
            <p className="text-white/50 text-sm">Get plant care tips, offers and more.</p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full sm:w-auto max-w-sm bg-white/10 rounded-lg overflow-hidden"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-transparent px-4 py-2.5 text-sm placeholder-white/40 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 flex items-center gap-1.5 text-sm font-medium"
              style={{ backgroundColor: 'var(--ps-primary)' }}
            >
              Subscribe <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                <Sprout className="w-5 h-5" style={{ color: 'var(--ps-primary)' }} />
              </div>
              <span className="text-xl font-bold">{data.logoText}</span>
            </div>
            <p className="text-white/50 max-w-md text-sm leading-relaxed">{data.description}</p>
            <div className="flex space-x-3 mt-6">
              {data.socialLinks.map((social, i) => {
                const IconComponent = iconComponents[social.icon];
                return (
                  <a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-[var(--ps-primary)] transition-all"
                  >
                    {IconComponent && <IconComponent className="w-4 h-4" />}
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm tracking-wide">Quick Links</h3>
            <ul className="space-y-2.5">
              {data.quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.url} className="text-white/50 hover:text-[var(--ps-primary)] transition-colors text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm tracking-wide">Collections</h3>
            <ul className="space-y-2.5">
              {data.serviceLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.url} className="text-white/50 hover:text-[var(--ps-primary)] transition-colors text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/40 text-xs">
          <p>© {currentYear} {data.logoText}. {data.copyrightText}</p>
          <div className="flex items-center gap-2">
            {['VISA', 'MC', 'UPI', 'PayPal'].map((p) => (
              <span key={p} className="px-2 py-1 bg-white/10 rounded text-[10px] font-medium">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}