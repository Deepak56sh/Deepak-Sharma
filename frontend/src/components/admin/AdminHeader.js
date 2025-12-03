'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Search, Menu, LogOut, User, Settings, Mail, CheckCircle, Clock } from 'lucide-react';
import ProfilePopup from './ProfilePopup';
import SettingsPopup from './SettingsPopup';

// API Base URL
const API_BASE_URL = process.env.API_BASE_URL || 'https://my-site-backend-0661.onrender.com/api';

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

  // NEW STATES FOR NOTIFICATIONS
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

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

  // ✅ Fetch contact messages for notifications - WITH ERROR HANDLING
  const fetchNotifications = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.log('No token found');
        return;
      }

      setNotificationsLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/contact/messages?limit=5&status=unread`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setNotifications(data.data || []);
        // Unread count set karo based on actual data
        setUnreadCount(data.data?.length || 0);
      } else {
        console.error('API returned error:', data.message);
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Error case mein empty set karo
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setNotificationsLoading(false);
    }
  };

  // ✅ Fetch unread messages count - WITH ERROR HANDLING
  const fetchUnreadCount = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/contact/unread-count`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setUnreadCount(data.data?.unreadCount || 0);
      } else {
        console.error('API returned error for unread count:', data.message);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
      setUnreadCount(0);
    }
  };

  // ✅ Mark message as read - WITH ERROR HANDLING
  const markMessageAsRead = async (messageId) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/contact/messages/${messageId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Update local state
        setNotifications(prev => prev.filter(msg => msg._id !== messageId));
        setUnreadCount(prev => Math.max(0, prev - 1));
        
        // Refresh unread count
        fetchUnreadCount();
      } else {
        console.error('Failed to mark message as read');
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  // ✅ Load admin data and notifications on component mount
  useEffect(() => {
    fetchAdminData();
    
    // Small delay ke baad notifications fetch karo
    const timer = setTimeout(() => {
      fetchUnreadCount();
      fetchNotifications();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // ✅ Set up interval to refresh notifications every 60 seconds (reduced frequency)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
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

  // ✅ Handle notification click
  const handleNotificationClick = (message) => {
    markMessageAsRead(message._id);
    setShowNotifications(false);
    // Redirect to contact messages page
    router.push('/admin/contact-messages');
  };

  // ✅ Format time for display
  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = (now - date) / (1000 * 60);
      const diffInHours = diffInMinutes / 60;
      
      if (diffInMinutes < 1) {
        return 'Just now';
      } else if (diffInMinutes < 60) {
        return `${Math.floor(diffInMinutes)}m ago`;
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)}h ago`;
      } else {
        return `${Math.floor(diffInHours / 24)}d ago`;
      }
    } catch (error) {
      return 'Recently';
    }
  };

  // ✅ Refresh notifications when dropdown opens
  const handleNotificationsToggle = () => {
    const newState = !showNotifications;
    setShowNotifications(newState);
    
    if (newState) {
      fetchNotifications();
      fetchUnreadCount();
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
              onClick={handleNotificationsToggle}
              disabled={notificationsLoading}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-gray-400 hover:text-white relative disabled:opacity-50"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-96 bg-slate-800 border border-purple-500/20 rounded-lg shadow-2xl z-50 max-h-96 overflow-hidden">
                <div className="p-4 border-b border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="text-white font-medium">Notifications</div>
                    <div className="text-gray-400 text-sm">
                      {unreadCount} unread {unreadCount === 1 ? 'message' : 'messages'}
                    </div>
                  </div>
                </div>
                
                <div className="max-h-80 overflow-y-auto">
                  {notificationsLoading ? (
                    <div className="p-8 text-center">
                      <div className="text-gray-400 text-sm">Loading messages...</div>
                    </div>
                  ) : notifications.length > 0 ? (
                    notifications.map((message) => (
                      <div
                        key={message._id}
                        onClick={() => handleNotificationClick(message)}
                        className="p-4 border-b border-slate-700 hover:bg-slate-700/50 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-start gap-3">
                          {/* Green tick for unread messages */}
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                              <Mail className="w-4 h-4 text-green-400" />
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="text-white font-medium text-sm truncate">
                                {message.name}
                              </div>
                              <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                            </div>
                            
                            <div className="text-gray-300 text-sm font-medium mb-1 line-clamp-1">
                              {message.subject}
                            </div>
                            
                            <div className="text-gray-400 text-xs line-clamp-2">
                              {message.message}
                            </div>
                            
                            <div className="flex items-center justify-between mt-2">
                              <div className="text-gray-500 text-xs flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTime(message.createdAt)}
                              </div>
                              <div className="text-green-400 text-xs font-medium">
                                New Message
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <Mail className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <div className="text-gray-400 text-sm">No new messages</div>
                      <div className="text-gray-500 text-xs mt-1">All messages are read</div>
                    </div>
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="p-3 border-t border-slate-700">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        router.push('/admin/contact-messages');
                      }}
                      className="w-full py-2 text-center text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                    >
                      View All Messages
                    </button>
                  </div>
                )}
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