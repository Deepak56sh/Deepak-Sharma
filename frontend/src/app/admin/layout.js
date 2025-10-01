'use client';
import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Hide navbar and footer using CSS classes
    const nav = document.querySelector('nav');
    const footer = document.querySelector('footer');
    if (nav) nav.classList.add('hidden');
    if (footer) footer.classList.add('hidden');
    
    // Cleanup on unmount
    return () => {
      if (nav) nav.classList.remove('hidden');
      if (footer) footer.classList.remove('hidden');
    };
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading Admin...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <AdminHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}