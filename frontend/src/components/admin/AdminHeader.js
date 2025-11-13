'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Search, Menu, LogOut, User, Settings } from 'lucide-react';
import ProfilePopup from './ProfilePopup';
import SettingsPopup from './SettingsPopup';

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminHeader({ toggleSidebar }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // NEW STATES FOR POPUPS
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);

  // ✅ Get token from localStorage
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminToken');
    }
    return null;
  };

  // ✅ Fetch current admin data
  const fetchAdminData = async () => {
    try {
      const token = getToken();
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAdminUser(data.data.admin);
      } else {
        // Token invalid or expired
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load admin data on component mount
  useEffect(() => {
    fetchAdminData();
  }, []);

  // ✅ LOGOUT FUNCTION
  const handleLogout = async () => {
    try {
      const token = getToken();
      
      // Call logout API
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Clear local storage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      
      // Redirect to login
      router.push('/admin/login');
      router.refresh();
      
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear storage and redirect even if API call fails
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      router.push('/admin/login');
    }
  };

  // ✅ UPDATE PROFILE FUNCTION
  const handleProfileUpdate = async (updatedData) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        const result = await response.json();
        setAdminUser(result.data);
        
        // Update localStorage if needed
        const currentUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
        localStorage.setItem('adminUser', JSON.stringify({
          ...currentUser,
          ...result.data
        }));
        
        return { success: true, message: result.message };
      } else {
        const errorData = await response.json();
        return { success: false, message: errorData.message };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, message: 'Failed to update profile' };
    }
  };

  // ✅ CHANGE PASSWORD FUNCTION
  const handlePasswordChange = async (passwordData) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(passwordData)
      });

      if (response.ok) {
        const result = await response.json();
        return { success: true, message: result.message };
      } else {
        const errorData = await response.json();
        return { success: false, message: errorData.message };
      }
    } catch (error) {
      console.error('Password change error:', error);
      return { success: false, message: 'Failed to change password' };
    }
  };

  if (loading) {
    return (
      <header className="h-16 bg-slate-900/50 border-b border-purple-500/20 flex items-center justify-between px-6">
        <div className="animate-pulse flex items-center space-x-4">
          <div className="w-8 h-8 bg-slate-700 rounded-full"></div>
          <div className="w-32 h-4 bg-slate-700 rounded"></div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="h-16 bg-slate-900/50 border-b border-purple-500/20 flex items-center justify-between px-6">
        {/* Left Section - Sidebar Toggle & Search */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
            />
          </div>
        </div>

        {/* Right Section - Notifications & User Menu */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-gray-400 hover:text-white relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-slate-800 border border-purple-500/20 rounded-lg shadow-2xl z-50">
                <div className="p-4">
                  <div className="text-white font-medium mb-2">Notifications</div>
                  <div className="text-gray-400 text-sm">No new notifications</div>
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
              {/* Profile Picture - NOW DYNAMIC FROM API */}
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center overflow-hidden">
                {adminUser?.profilePicture ? (
                  <img 
                    src={adminUser.profilePicture} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
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
                  {/* Profile Button */}
                  <button 
                    onClick={() => {
                      setShowProfilePopup(true);
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">Profile</span>
                  </button>
                  
                  {/* Settings Button */}
                  <button 
                    onClick={() => {
                      setShowSettingsPopup(true);
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Settings</span>
                  </button>
                  
                  <hr className="my-2 border-slate-700" />
                  
                  {/* Logout Button */}
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
      </header>

      {/* POPUP COMPONENTS */}
      <ProfilePopup
        isOpen={showProfilePopup}
        onClose={() => setShowProfilePopup(false)}
        adminUser={adminUser}
        onUpdate={handleProfileUpdate}
        onFetchAdmin={fetchAdminData}
      />

      <SettingsPopup
        isOpen={showSettingsPopup}
        onClose={() => setShowSettingsPopup(false)}
        adminUser={adminUser}
        onChangePassword={handlePasswordChange}
      />
    </>
  );
}