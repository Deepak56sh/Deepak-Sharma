// ============================================
// FILE: src/components/admin/AdminSidebar.js
// ============================================
'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Rocket, 
  MessageSquare, 
  Settings,
  ChevronLeft,
  Sparkles
} from 'lucide-react';

export default function AdminSidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Hero Section', path: '/admin/hero', icon: Rocket },
    { name: 'Services', path: '/admin/services', icon: Briefcase },
    { name: 'About', path: '/admin/about', icon: Users },
    { name: 'Messages', path: '/admin/contact-messages', icon: MessageSquare },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-slate-900 border-r border-purple-500/20 transition-all duration-300 z-50 ${
      isOpen ? 'w-64' : 'w-20'
    }`}>
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-purple-500/20">
        {isOpen && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">Admin</span>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors"
        >
          <ChevronLeft className={`w-5 h-5 text-gray-400 transition-transform ${!isOpen && 'rotate-180'}`} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                isActive 
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30' 
                  : 'text-gray-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span className="font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Info (Optional) */}
      {isOpen && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <div>
              <div className="text-white font-medium text-sm">Admin User</div>
              <div className="text-gray-400 text-xs">admin@nexgen.com</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
