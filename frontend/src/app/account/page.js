'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Heart,
  MapPin,
  Lock,
  Ticket,
  LogOut,
  Package,
  Star,
  ChevronRight
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

const sidebarLinks = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/account', key: 'dashboard' },
  { name: 'Wishlist', icon: Heart, href: '/account/wishlist', key: 'wishlist' },
  { name: 'Addresses', icon: MapPin, href: '/account/addresses', key: 'addresses' },
  { name: 'Change Password', icon: Lock, href: '/account/change-password', key: 'password' },
  { name: 'My Coupons', icon: Ticket, href: '/account/coupons', key: 'coupons' },
];

const defaultUser = {
  name: 'Rohan',
  email: 'rohan@example.com',
  totalOrders: 12,
  wishlistItems: 8,
  coupons: 3,
  rewardPoints: 250,
};

const defaultOrders = [
  { id: '#PLTS4872', items: 3, amount: 1796, date: '2 Jun, 2025', status: 'Delivered' },
  { id: '#PLTS4810', items: 2, amount: 899, date: '28 May, 2025', status: 'Shipped' },
  { id: '#PLTS4780', items: 4, amount: 2299, date: '20 May, 2025', status: 'Delivered' },
];

export default function AccountPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(defaultUser);
  const [orders, setOrders] = useState(defaultOrders);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Demo: page bina login ke dikhegi
    // Real auth: localStorage.getItem('token') check karke /login pe bhej do
    fetchAccountData();
  }, []);

  const fetchAccountData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/account`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: 'no-cache',
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      if (data.success && data.data) {
        setUser(data.data.user || defaultUser);
        setOrders(data.data.orders || defaultOrders);
      }
    } catch {
      setUser(defaultUser);
      setOrders(defaultOrders);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f8f7]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2f9e44]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8f7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        
        <h1 className="text-2xl sm:text-3xl font-bold text-[#14261d] mb-8">My Account</h1>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* SIDEBAR */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-[#e8ece9] overflow-hidden sticky top-24">
              <div className="p-5 border-b border-[#e8ece9] bg-[#f6f8f7]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#2f9e44] flex items-center justify-center text-white font-bold text-lg">
                    {(user?.name || 'R').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-[#14261d]">{user?.name || 'Rohan'}</p>
                    <p className="text-xs text-[#6b7280]">{user?.email || 'rohan@example.com'}</p>
                  </div>
                </div>
              </div>

              <nav className="p-3 space-y-1">
                {sidebarLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.key || pathname === item.href;
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={() => setActiveTab(item.key)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-[#eaf7ee] text-[#2f9e44]'
                          : 'text-[#4b5563] hover:bg-[#f6f8f7] hover:text-[#14261d]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  );
                })}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all mt-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* MAIN */}
          <div className="lg:col-span-9 space-y-6">
            
            <div className="bg-white rounded-2xl border border-[#e8ece9] p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-[#14261d]">
                Welcome back, {user?.name || 'Rohan'}!
              </h2>
              <p className="text-[#6b7280] text-sm mt-1">
                Here&apos;s what&apos;s happening with your account.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Orders', value: user?.totalOrders || 12, icon: Package, bg: 'bg-blue-50', text: 'text-blue-600' },
                { label: 'Wishlist Items', value: user?.wishlistItems || 8, icon: Heart, bg: 'bg-pink-50', text: 'text-pink-600' },
                { label: 'Coupons', value: user?.coupons || 3, icon: Ticket, bg: 'bg-yellow-50', text: 'text-yellow-600' },
                { label: 'Reward Points', value: user?.rewardPoints || 250, icon: Star, bg: 'bg-green-50', text: 'text-green-600' },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="bg-white rounded-2xl border border-[#e8ece9] p-5 hover:shadow-md transition-shadow">
                    <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.text} flex items-center justify-center mb-3`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-bold text-[#14261d]">{stat.value}</p>
                    <p className="text-xs text-[#6b7280] mt-1">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl border border-[#e8ece9] overflow-hidden">
              <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#e8ece9]">
                <h3 className="font-bold text-[#14261d]">Recent Orders</h3>
                <Link href="/account/orders" className="text-sm text-[#2f9e44] font-medium hover:underline flex items-center gap-1">
                  View All Orders <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#f6f8f7] text-[#6b7280]">
                      <th className="text-left px-6 py-3 font-medium">Order ID</th>
                      <th className="text-left px-6 py-3 font-medium">Items</th>
                      <th className="text-left px-6 py-3 font-medium">Amount</th>
                      <th className="text-left px-6 py-3 font-medium">Date</th>
                      <th className="text-left px-6 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, i) => (
                      <tr key={i} className="border-t border-[#e8ece9] hover:bg-[#f6f8f7]/50">
                        <td className="px-6 py-4 font-medium text-[#14261d]">{order.id}</td>
                        <td className="px-6 py-4 text-[#6b7280]">{order.items} items</td>
                        <td className="px-6 py-4 font-semibold text-[#14261d]">₹{order.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-[#6b7280]">{order.date}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="sm:hidden divide-y divide-[#e8ece9]">
                {orders.map((order, i) => (
                  <div key={i} className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#14261d]">{order.id}</span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-[#6b7280]">
                      <span>{order.items} items</span>
                      <span className="font-semibold text-[#14261d]">₹{order.amount.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-[#9ca3af]">{order.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}