// ============================================
// FILE: src/components/admin/AdminSidebar.js
// ============================================
'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Leaf,
  Grid3x3,
  ShoppingBag,
  Users,
  Star,
  Ticket,
  FileText,
  Image as ImageIcon,
  Layers,
  Palette,
  Settings,
  BarChart3,
  UserCog,
  Wrench,
  ChevronLeft,
  Sprout,
  LogOut,
} from 'lucide-react';

export default function AdminSidebar({ isOpen, setIsOpen, onLogout, adminData }) {
  const pathname = usePathname();

  // ✅ Same nav items as the reference Plant Store admin panel screenshot.
  // Badge counts (like Orders: 24) come from live data later — static here for layout.
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Plants', path: '/admin/plants', icon: Leaf },
    { name: 'Categories', path: '/admin/categories', icon: Grid3x3 },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag, badge: 24 },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Reviews', path: '/admin/reviews', icon: Star },
    { name: 'Coupons', path: '/admin/coupons', icon: Ticket },
    { name: 'Blogs', path: '/admin/blogs', icon: FileText },
    { name: 'Media', path: '/admin/media', icon: ImageIcon },
    { name: 'Pages', path: '/admin/pages', icon: Layers },
    { name: 'Appearance', path: '/admin/appearance', icon: Palette },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
    { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { name: 'Users', path: '/admin/users', icon: UserCog },
    { name: 'Tools', path: '/admin/tools', icon: Wrench },
    { name: 'Menu', path: '/admin/menu', icon: List },
    { name: 'Footer', path: '/admin/footer', icon: AppWindow },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-screen text-white transition-all duration-300 z-50 flex flex-col ${
        isOpen ? 'w-64' : 'w-20'
      }`}
      style={{ backgroundColor: 'var(--pa-sidebar)' }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 shrink-0">
        {isOpen ? (
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
              <Sprout className="w-5 h-5" style={{ color: 'var(--pa-primary)' }} />
            </div>
            <div className="leading-tight">
              <div className="text-base font-bold">Plant Store</div>
              <div className="text-[10px] tracking-widest text-white/50">ADMIN PANEL</div>
            </div>
          </div>
        ) : (
          <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center mx-auto">
            <Sprout className="w-5 h-5" style={{ color: 'var(--pa-primary)' }} />
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white text-slate-700 rounded-full shadow flex items-center justify-center hover:scale-110 transition-transform"
      >
        <ChevronLeft className={`w-4 h-4 transition-transform ${!isOpen && 'rotate-180'}`} />
      </button>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all relative ${
                isActive ? 'text-white font-medium' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
              style={isActive ? { backgroundColor: 'var(--pa-primary)' } : undefined}
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" />
              {isOpen && <span className="flex-1">{item.name}</span>}
              {isOpen && item.badge ? (
                <span
                  className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70'
                  }`}
                >
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-white/10 p-3 shrink-0">
        <div className={`flex items-center gap-3 px-2 py-2 rounded-lg ${isOpen ? '' : 'justify-center'}`}>
          <div className="w-9 h-9 rounded-full overflow-hidden bg-white/10 flex items-center justify-center flex-shrink-0">
            {adminData?.profilePicture ? (
              <img src={adminData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-bold">{adminData?.name?.[0] || 'A'}</span>
            )}
          </div>
          {isOpen && (
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{adminData?.name || 'Admin'}</div>
              <div className="text-xs text-white/50 truncate">{adminData?.role || 'Administrator'}</div>
            </div>
          )}
        </div>

        <button
          onClick={onLogout}
          className={`w-full mt-2 flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors ${
            isOpen ? '' : 'justify-center'
          }`}
        >
          <LogOut className="w-[18px] h-[18px]" />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
