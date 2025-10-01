// ============================================
// FILE: src/components/admin/AdminHeader.js
// ============================================
'use client';
import { Bell, Search, Menu } from 'lucide-react';

export default function AdminHeader({ toggleSidebar }) {
  return (
    <header className="h-16 bg-slate-900/50 border-b border-purple-500/20 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700"
        >
          <Menu className="w-5 h-5 text-gray-400" />
        </button>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-64 pl-10 pr-4 py-2 bg-slate-800 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700">
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            3
          </span>
        </button>
      </div>
    </header>
  );
}