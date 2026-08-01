'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Search, Menu, LogOut, User, Settings, Mail, CheckCircle, Clock, Sun } from 'lucide-react';
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

  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminToken');
    }
    return null;
  };

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
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAdminUser(data.data.admin);
      } else {
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

  const fetchNotifications = async () => {
    try {
      const token = getToken();
      if (!token) return;

      setNotificationsLoading(true);

      const response = await fetch(`${API_BASE_URL}/contact/messages?limit=5&status=unread`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      if (data.success) {
        setNotifications(data.data || []);
        setUnreadCount(data.data?.length || 0);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/contact/unread-count`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setUnreadCount(data.success ? data.data?.unreadCount || 0 : 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
      setUnreadCount(0);
    }
  };

  const markMessageAsRead = async (messageId) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/contact/messages/${messageId}/read`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setNotifications((prev) => prev.filter((msg) => msg._id !== messageId));
        setUnreadCount((prev) => Math.max(0, prev - 1));
        fetchUnreadCount();
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  useEffect(() => {
    fetchAdminData();
    const timer = setTimeout(() => {
      fetchUnreadCount();
      fetchNotifications();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      const token = getToken();
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      router.push('/admin/login');
    }
  };

  const handleProfileUpdate = async (updatedData) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const result = await response.json();
        setAdminUser(result.data);
        const currentUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
        localStorage.setItem('adminUser', JSON.stringify({ ...currentUser, ...result.data }));
        return { success: true, message: result.message };
      } else {
        const errorData = await response.json();
        return { success: false, message: errorData.message };
      }
    } catch (error) {
      return { success: false, message: 'Failed to update profile' };
    }
  };

  const handlePasswordChange = async (passwordData) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      });

      if (response.ok) {
        const result = await response.json();
        return { success: true, message: result.message };
      } else {
        const errorData = await response.json();
        return { success: false, message: errorData.message };
      }
    } catch (error) {
      return { success: false, message: 'Failed to change password' };
    }
  };

  const handleNotificationClick = (message) => {
    markMessageAsRead(message._id);
    setShowNotifications(false);
    router.push('/admin/contact-messages');
  };

  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = (now - date) / (1000 * 60);
      const diffInHours = diffInMinutes / 60;
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)}m ago`;
      if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
      return `${Math.floor(diffInHours / 24)}d ago`;
    } catch {
      return 'Recently';
    }
  };

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
      <header className="h-16 bg-white border-b border-[var(--pa-border)] flex items-center justify-between px-6">
        <div className="animate-pulse flex items-center space-x-4">
          <div className="w-8 h-8 bg-slate-200 rounded-full" />
          <div className="w-32 h-4 bg-slate-200 rounded" />
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="h-16 bg-white border-b border-[var(--pa-border)] flex items-center justify-between px-6 sticky top-0 z-40">
        {/* Left: sidebar toggle + search */}
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-800"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-50 border border-[var(--pa-border)] rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--pa-primary)]/30 focus:border-[var(--pa-primary)] w-full"
            />
          </div>
        </div>

        {/* Right: theme, notifications, user */}
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-800">
            <Sun className="w-5 h-5" />
          </button>

          <div className="relative">
            <button
              onClick={handleNotificationsToggle}
              disabled={notificationsLoading}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-800 relative disabled:opacity-50"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--pa-danger)] text-white text-[10px] rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-96 bg-white border border-[var(--pa-border)] rounded-xl shadow-xl z-50 max-h-96 overflow-hidden">
                <div className="p-4 border-b border-[var(--pa-border)] flex items-center justify-between">
                  <div className="font-semibold text-slate-800">Notifications</div>
                  <div className="text-slate-400 text-sm">
                    {unreadCount} unread {unreadCount === 1 ? 'message' : 'messages'}
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notificationsLoading ? (
                    <div className="p-8 text-center text-slate-400 text-sm">Loading messages...</div>
                  ) : notifications.length > 0 ? (
                    notifications.map((message) => (
                      <div
                        key={message._id}
                        onClick={() => handleNotificationClick(message)}
                        className="p-4 border-b border-[var(--pa-border)] hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-8 h-8 bg-[var(--pa-primary-light)] rounded-full flex items-center justify-center">
                              <Mail className="w-4 h-4" style={{ color: 'var(--pa-primary)' }} />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="text-slate-800 font-medium text-sm truncate">{message.name}</div>
                              <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--pa-primary)' }} />
                            </div>
                            <div className="text-slate-600 text-sm font-medium mb-1 line-clamp-1">{message.subject}</div>
                            <div className="text-slate-400 text-xs line-clamp-2">{message.message}</div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="text-slate-400 text-xs flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTime(message.createdAt)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <Mail className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                      <div className="text-slate-400 text-sm">No new messages</div>
                    </div>
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="p-3 border-t border-[var(--pa-border)]">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        router.push('/admin/contact-messages');
                      }}
                      className="w-full py-2 text-center text-sm font-medium transition-colors"
                      style={{ color: 'var(--pa-primary)' }}
                    >
                      View All Messages
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 rounded-lg pl-2 pr-3 py-1.5 hover:bg-slate-100 transition-colors"
            >
              <div className="w-9 h-9 rounded-full overflow-hidden bg-[var(--pa-primary-light)] flex items-center justify-center">
                {adminUser?.profilePicture ? (
                  <img src={adminUser.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4" style={{ color: 'var(--pa-primary)' }} />
                )}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-slate-800 text-sm font-medium">{adminUser?.name || 'Admin'}</div>
                <div className="text-slate-400 text-xs">{adminUser?.role || 'Administrator'}</div>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-12 w-48 bg-white border border-[var(--pa-border)] rounded-lg shadow-xl z-50">
                <div className="p-2">
                  <button
                    onClick={() => {
                      setShowProfilePopup(true);
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowSettingsPopup(true);
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Settings</span>
                  </button>
                  <hr className="my-2 border-[var(--pa-border)]" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-[var(--pa-danger)] hover:bg-red-50 rounded-lg transition-colors"
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
