'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Search, Menu, LogOut, User, Settings } from 'lucide-react';
import ProfilePopup from './ProfilePopup';
import SettingsPopup from './SettingsPopup';

export default function AdminHeader({ toggleSidebar }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  
  // NEW STATES FOR POPUPS
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);

  // ... (previous code remains same)

  const handleProfileUpdate = (updatedUser) => {
    setAdminUser(updatedUser);
  };

  return (
    <>
      <header className="h-16 bg-slate-900/50 border-b border-purple-500/20 flex items-center justify-between px-6">
        {/* ... (previous header code remains same) ... */}

        {/* User Menu & Logout */}
        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 rounded-lg px-3 py-2 transition-colors"
          >
            {/* Profile Picture - NOW DYNAMIC */}
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

          {/* User Dropdown Menu - UPDATED */}
          {showUserMenu && (
            <div className="absolute right-0 top-12 w-48 bg-slate-800 border border-purple-500/20 rounded-lg shadow-2xl z-50">
              <div className="p-2">
                {/* Profile Button - OPENS POPUP */}
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
                
                {/* Settings Button - OPENS POPUP */}
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
      </header>

      {/* POPUP COMPONENTS */}
      <ProfilePopup
        isOpen={showProfilePopup}
        onClose={() => setShowProfilePopup(false)}
        adminUser={adminUser}
        onUpdate={handleProfileUpdate}
      />

      <SettingsPopup
        isOpen={showSettingsPopup}
        onClose={() => setShowSettingsPopup(false)}
        adminUser={adminUser}
      />
    </>
  );
}