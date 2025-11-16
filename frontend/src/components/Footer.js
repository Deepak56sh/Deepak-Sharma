// // ============================================
// // FILE: src/components/Footer.js
// // ============================================
// import { Sparkles, Github, Twitter, Linkedin, Mail } from 'lucide-react';

// export default function Footer() {
//   const currentYear = new Date().getFullYear();

//   return (
//     <footer className="bg-slate-900/50 border-t border-purple-500/10">
//       <div className="max-w-7xl mx-auto px-6 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
//           <div className="col-span-1 md:col-span-2">
//             <div className="flex items-center space-x-2 mb-4">
//               <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
//                 <Sparkles className="w-6 h-6 text-white" />
//               </div>
//               <span className="text-2xl font-bold text-gradient">NexGen</span>
//             </div>
//             <p className="text-gray-400 max-w-md">
//               Transforming visions into digital reality with cutting-edge technology and stunning design.
//             </p>
//             <div className="flex space-x-4 mt-6">
//               {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
//                 <a
//                   key={i}
//                   href="#"
//                   className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-500 transition-all duration-300 transform hover:scale-110"
//                 >
//                   <Icon className="w-5 h-5" />
//                 </a>
//               ))}
//             </div>
//           </div>

//           <div>
//             <h3 className="text-white font-bold mb-4">Quick Links</h3>
//             <ul className="space-y-2">
//               {['Home', 'About', 'Services', 'Contact'].map((item) => (
//                 <li key={item}>
//                   <a href={`/${item.toLowerCase()}`} className="text-gray-400 hover:text-purple-400 transition-colors">
//                     {item}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div>
//             <h3 className="text-white font-bold mb-4">Services</h3>
//             <ul className="space-y-2">
//               {['Web Development', 'Mobile Apps', 'UI/UX Design', 'Cloud Solutions'].map((item) => (
//                 <li key={item}>
//                   <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
//                     {item}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         <div className="border-t border-purple-500/10 pt-8 text-center text-gray-400">
//           <p>© {currentYear} NexGen. All rights reserved. Made with ❤️</p>
//         </div>
//       </div>
//     </footer>
//   );
// }

// FILE: src/components/Footer.js
'use client';
import { useState, useEffect } from 'react';
import { Sparkles, Github, Twitter, Linkedin, Mail, Facebook, Instagram, Youtube } from 'lucide-react';

const iconComponents = {
  Github, Twitter, Linkedin, Mail, Facebook, Instagram, Youtube
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
      
      if (data.success) {
        setFooterData(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch footer:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !footerData) {
    return (
      <footer className="bg-slate-900/50 border-t border-purple-500/10">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-slate-900/50 border-t border-purple-500/10">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gradient">
                {footerData.logoText}
              </span>
            </div>
            <p className="text-gray-400 max-w-md">
              {footerData.description}
            </p>
            <div className="flex space-x-4 mt-6">
              {footerData.socialLinks.map((social, i) => {
                const IconComponent = iconComponents[social.icon];
                return (
                  <a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-500 transition-all duration-300 transform hover:scale-110"
                  >
                    {IconComponent && <IconComponent className="w-5 h-5" />}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerData.quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.url} 
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Services</h3>
            <ul className="space-y-2">
              {footerData.serviceLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.url} 
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-purple-500/10 pt-8 text-center text-gray-400">
          <p>© {currentYear} {footerData.logoText}. All rights reserved. {footerData.copyrightText}</p>
        </div>
      </div>
    </footer>
  );
}
