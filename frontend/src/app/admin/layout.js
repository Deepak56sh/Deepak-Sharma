'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    setIsMounted(true);

    if (pathname === '/admin/login') {
      setLoading(false);
      return;
    }

    checkAuth();

    const nav = document.querySelector('nav');
    const footer = document.querySelector('footer');
    if (nav) nav.style.display = 'none';
    if (footer) footer.style.display = 'none';

    return () => {
      const nav = document.querySelector('nav');
      const footer = document.querySelector('footer');
      if (nav) nav.style.display = '';
      if (footer) footer.style.display = '';
    };
  }, [pathname]);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const storedUser = localStorage.getItem('adminUser');

      if (!token) {
        router.push('/admin/login');
        return;
      }

      if (storedUser) {
        try {
          setAdminData(JSON.parse(storedUser));
        } catch (e) {
          console.error('Error parsing stored user:', e);
        }
      }

      const response = await fetch('https://my-site-backend-0661.onrender.com/api/auth/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.admin) {
          setAdminData(data.data.admin);
          setIsAuthenticated(true);
          localStorage.setItem('adminUser', JSON.stringify(data.data.admin));
        } else {
          throw new Error('Invalid response from server');
        }
      } else {
        throw new Error('Authentication failed');
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

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  if (!isMounted) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f8f7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-[#2f9e44]/20 border-t-[#2f9e44] rounded-full animate-spin mx-auto mb-4" />
          <div className="text-slate-600 text-lg">Loading Admin Panel...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen bg-[#f6f8f7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-[#2f9e44]/20 border-t-[#2f9e44] rounded-full animate-spin mx-auto mb-4" />
          <div className="text-slate-600 text-lg">Redirecting to login...</div>
        </div>
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return (
      <div className="plant-admin">
        <style jsx global>{`
          nav, footer {
            display: none !important;
          }
        `}</style>
        {children}
      </div>
    );
  }

  return (
    <div className="plant-admin min-h-screen">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} onLogout={handleLogout} adminData={adminData} />

      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <AdminHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} adminData={adminData} onLogout={handleLogout} />

        <main className="p-6 min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  );
}
