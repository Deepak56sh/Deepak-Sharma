'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    setIsMounted(true);
    
    // ✅ ONLY HIDE MAIN WEBSITE NAVBAR & FOOTER
    const hideElements = () => {
      // Main website navbar (not admin navbar)
      const mainNav = document.querySelector('nav:not(.admin-nav)');
      const footer = document.querySelector('footer');
      
      if (mainNav) {
        console.log('Hiding main nav');
        mainNav.style.display = 'none';
      }
      if (footer) {
        console.log('Hiding footer');
        footer.style.display = 'none';
      }
    };
    
    hideElements();
    
    // Cleanup on unmount
    return () => {
      const mainNav = document.querySelector('nav:not(.admin-nav)');
      const footer = document.querySelector('footer');
      
      if (mainNav) mainNav.style.display = '';
      if (footer) footer.style.display = '';
    };
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted || loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading Admin...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* ✅ SPECIFIC GLOBAL STYLE - Only hide main website nav */}
      <style jsx global>{`
        /* Only hide nav that is NOT inside admin layout */
        body:has(.min-h-screen.bg-slate-950) > nav,
        body:has(.min-h-screen.bg-slate-950) > footer {
          display: none !important;
        }
      `}</style>
      
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