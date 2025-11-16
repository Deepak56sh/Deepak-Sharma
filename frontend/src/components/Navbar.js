'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sparkles, Home, User, Briefcase, Phone } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navLinks, setNavLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch menu from backend
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('https://my-site-backend-0661.onrender.com/api/menu');
        const data = await response.json();
        
        if (data.success) {
          setNavLinks(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch menu:', error);
        // Fallback to default menu
        setNavLinks([
          { name: 'Home', path: '/', type: 'internal' },
          { name: 'About', path: '/about', type: 'internal' },
          { name: 'Services', path: '/services', type: 'internal' },
          { name: 'Contact', path: '/contact', type: 'internal' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // Get icon for menu item
  const getIcon = (name) => {
    switch(name.toLowerCase()) {
      case 'home': return <Home size={18} />;
      case 'about': return <User size={18} />;
      case 'services': return <Briefcase size={18} />;
      case 'contact': return <Phone size={18} />;
      default: return <Sparkles size={18} />;
    }
  };

  const renderLink = (link) => {
    if (link.type === 'external') {
      return (
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium uppercase tracking-wider transition-all duration-300 relative group text-gray-300 hover:text-white"
        >
          {link.name}
          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
        </a>
      );
    }

    return (
      <Link
        href={link.path}
        className={`text-sm font-medium uppercase tracking-wider transition-all duration-300 relative group ${
          pathname === link.path ? 'text-purple-400' : 'text-gray-300 hover:text-white'
        }`}
      >
        {link.name}
        <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform origin-left transition-transform duration-300 ${
          pathname === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        }`}></span>
      </Link>
    );
  };

  if (loading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg animate-pulse"></div>
              <div className="h-6 w-20 bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-slate-900/95 backdrop-blur-lg shadow-2xl shadow-purple-500/10' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center transform group-hover:rotate-180 transition-transform duration-700">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">NexGen</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <div key={link._id || link.path}>
                {renderLink(link)}
              </div>
            ))}
          </div>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="md:hidden p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-white hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Enhanced Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed top-20 left-4 right-4 bg-gradient-to-br from-slate-900 to-slate-800 border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-500/20 backdrop-blur-xl animate-fadeIn z-50 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 animate-pulse"></div>
            
            {/* Menu Header */}
            <div className="relative p-4 border-b border-purple-500/20">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">Navigation</span>
              </div>
            </div>

            {/* Menu Items */}
            <div className="relative p-4 space-y-3">
              {navLinks.map((link, index) => (
                <div key={link._id || link.path} className="animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                  {link.type === 'external' ? (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-slate-800/50 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 border border-transparent hover:border-purple-500/30 transition-all duration-300 group"
                    >
                      <div className="text-purple-400 group-hover:scale-110 transition-transform duration-300">
                        {getIcon(link.name)}
                      </div>
                      <span className="text-white font-medium tracking-wide">{link.name}</span>
                    </a>
                  ) : (
                    <Link
                      href={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl border transition-all duration-300 group ${
                        pathname === link.path 
                          ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-purple-500/50 shadow-lg shadow-purple-500/20' 
                          : 'bg-slate-800/50 border-transparent hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 hover:border-purple-500/30'
                      }`}
                    >
                      <div className={`group-hover:scale-110 transition-transform duration-300 ${
                        pathname === link.path ? 'text-white' : 'text-purple-400'
                      }`}>
                        {getIcon(link.name)}
                      </div>
                      <span className={`font-medium tracking-wide ${
                        pathname === link.path ? 'text-white' : 'text-gray-300 group-hover:text-white'
                      }`}>
                        {link.name}
                      </span>
                      {pathname === link.path && (
                        <div className="ml-auto w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                      )}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Menu Footer */}
            <div className="relative p-4 border-t border-purple-500/20">
              <div className="text-center">
                <p className="text-xs text-gray-400">NexGen Solutions</p>
                <p className="text-xs text-purple-400 mt-1">Innovating Tomorrow</p>
              </div>
            </div>
          </div>
        )}

        {/* Overlay */}
        {isMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </div>
    </nav>
  );
}