// ============================================
// FILE: src/components/admin/AdminHeader.js
// ============================================
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Search, Menu, LogOut, User, Settings } from 'lucide-react';

export default function AdminHeader({ toggleSidebar }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  // Mock notifications data
  const [notifications] = useState([
    { id: 1, title: 'New Message', message: 'You have a new contact form submission', time: '5 min ago', read: false },
    { id: 2, title: 'System Update', message: 'Backup completed successfully', time: '1 hour ago', read: false },
    { id: 3, title: 'Welcome', message: 'Welcome to NexGen Admin Panel', time: '2 days ago', read: true }
  ]);

  useEffect(() => {
    // Get admin user data from localStorage
    const userData = localStorage.getItem('adminUser');
    if (userData) {
      setAdminUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.trim()) {
      // Search functionality - redirect to appropriate pages
      const searchRoutes = {
        'dashboard': '/admin',
        'hero': '/admin/hero',
        'services': '/admin/services',
        'about': '/admin/about',
        'messages': '/admin/contact-messages',
        'footer': '/admin/footer',
        'menu': '/admin/menu',
        'settings': '/admin/settings',
        'header': '/admin/menu',
        'nav': '/admin/menu',
        'navigation': '/admin/menu'
      };

      for (const [key, route] of Object.entries(searchRoutes)) {
        if (query.includes(key)) {
          router.push(route);
          setSearchQuery('');
          return;
        }
      }
    }
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // If no specific route found, show alert with available options
      const availableOptions = [
        'dashboard', 'hero', 'services', 'about', 'messages', 
        'footer', 'menu', 'settings', 'header', 'nav'
      ].filter(option => option.includes(searchQuery.toLowerCase()));
      
      if (availableOptions.length > 0) {
        alert(`Try: ${availableOptions.join(', ')}`);
      } else {
        alert('Available search terms: dashboard, hero, services, about, messages, footer, menu, settings, header, nav');
      }
      setSearchQuery('');
    }
  };

  const markAsRead = (id) => {
    // In real app, you would update this in backend
    console.log('Mark as read:', id);
    setShowNotifications(false);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 bg-slate-900/50 border-b border-purple-500/20 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-400" />
        </button>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            onKeyPress={handleSearchSubmit}
            placeholder="Search (dashboard, hero, services, footer...)"
            className="w-80 pl-10 pr-4 py-2 bg-slate-800 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-slate-800 border border-purple-500/20 rounded-lg shadow-2xl z-50">
              <div className="p-4 border-b border-slate-700">
                <h3 className="text-white font-semibold">Notifications</h3>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-slate-700 hover:bg-slate-750 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-slate-750' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-white font-medium text-sm">{notification.title}</h4>
                      <span className="text-xs text-gray-400">{notification.time}</span>
                    </div>
                    <p className="text-gray-400 text-sm">{notification.message}</p>
                    {!notification.read && (
                      <div className="flex justify-end mt-2">
                        <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded">New</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-3 text-center border-t border-slate-700">
                <button className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu & Logout */}
        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 rounded-lg px-3 py-2 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-white text-sm font-medium">
                {adminUser?.name || 'Admin'}
              </div>
              <div className="text-gray-400 text-xs">
                {adminUser?.role || 'Administrator'}
              </div>
            </div>
          </button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 top-12 w-48 bg-slate-800 border border-purple-500/20 rounded-lg shadow-2xl z-50">
              <div className="p-2">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                  <User className="w-4 h-4" />
                  <span className="text-sm">Profile</span>
                </button>
                
                <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Settings</span>
                </button>
                
                <hr className="my-2 border-slate-700" />
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Close dropdowns when clicking outside */}
      {(showNotifications || showUserMenu) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </header>
  );
}