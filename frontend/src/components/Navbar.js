// // ============================================
// // FILE: src/components/Navbar.js
// // ============================================
// 'use client';
// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { Menu, X, Sparkles } from 'lucide-react';

// export default function Navbar() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const pathname = usePathname();

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 50);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const navLinks = [
//     { name: 'Home', path: '/' },
//     { name: 'About', path: '/about' },
//     { name: 'Services', path: '/services' },
//     { name: 'Contact', path: '/contact' },
//   ];

//   return (
//     <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
//       scrolled ? 'bg-slate-900/95 backdrop-blur-lg shadow-2xl shadow-purple-500/10' : 'bg-transparent'
//     }`}>
//       <div className="max-w-7xl mx-auto px-6 py-4">
//         <div className="flex items-center justify-between">
//           <Link href="/" className="flex items-center space-x-2 group">
//             <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center transform group-hover:rotate-180 transition-transform duration-700">
//               <Sparkles className="w-6 h-6 text-white" />
//             </div>
//             <span className="text-2xl font-bold text-gradient">NexGen</span>
//           </Link>

//           <div className="hidden md:flex items-center space-x-8">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.path}
//                 href={link.path}
//                 className={`text-sm font-medium uppercase tracking-wider transition-all duration-300 relative group ${
//                   pathname === link.path ? 'text-purple-400' : 'text-gray-300 hover:text-white'
//                 }`}
//               >
//                 {link.name}
//                 <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform origin-left transition-transform duration-300 ${
//                   pathname === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
//                 }`}></span>
//               </Link>
//             ))}
//           </div>

//           <button 
//             onClick={() => setIsMenuOpen(!isMenuOpen)} 
//             className="md:hidden text-white hover:text-purple-400 transition-colors"
//           >
//             {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>

//         {isMenuOpen && (
//           <div className="md:hidden mt-4 pb-4 space-y-3 animate-fadeIn">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.path}
//                 href={link.path}
//                 onClick={() => setIsMenuOpen(false)}
//                 className={`block px-4 py-2 rounded-lg uppercase tracking-wider transition-all ${
//                   pathname === link.path 
//                     ? 'bg-purple-500/20 text-purple-400' 
//                     : 'text-gray-300 hover:bg-slate-800'
//                 }`}
//               >
//                 {link.name}
//               </Link>
//             ))}
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }

'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sparkles } from 'lucide-react';

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
            className="md:hidden text-white hover:text-purple-400 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 animate-fadeIn">
            {navLinks.map((link) => (
              <div key={link._id || link.path}>
                {link.type === 'external' ? (
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 rounded-lg uppercase tracking-wider transition-all text-gray-300 hover:bg-slate-800"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    href={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-2 rounded-lg uppercase tracking-wider transition-all ${
                      pathname === link.path 
                        ? 'bg-purple-500/20 text-purple-400' 
                        : 'text-gray-300 hover:bg-slate-800'
                    }`}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}