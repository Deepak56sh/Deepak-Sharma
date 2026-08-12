'use client';
import { useState, useEffect } from 'react';
import { ShoppingBag, IndianRupee, Users, Sprout, ChevronDown, ArrowRight, Loader2 } from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

const statusStyles = {
  delivered: 'bg-[var(--pa-primary-light)] text-[var(--pa-primary)]',
  completed: 'bg-[var(--pa-primary-light)] text-[var(--pa-primary)]',
  shipped: 'bg-blue-50 text-blue-500',
  processing: 'bg-blue-50 text-blue-500',
  pending: 'bg-amber-50 text-amber-500',
  cancelled: 'bg-rose-50 text-rose-500',
};

const timeAgo = (dateStr) => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

export default function AdminDashboard() {
  const [adminName, setAdminName] = useState('Admin');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const admin = JSON.parse(localStorage.getItem('admin') || '{}');
      if (admin.name) setAdminName(admin.name);
    } catch {}
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message || 'Failed to load dashboard');
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Network error — could not reach the API.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400 gap-2">
        <Loader2 className="w-6 h-6 animate-spin" /> Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-[var(--pa-border)] p-10 text-center">
        <p className="text-slate-500 text-sm mb-4">{error}</p>
        <button
          onClick={fetchDashboard}
          className="px-4 py-2 rounded-lg text-white text-sm font-medium"
          style={{ backgroundColor: 'var(--pa-primary)' }}
        >
          Retry
        </button>
      </div>
    );
  }

  const { stats, weeklySales, orderStatus, topPlants, recentOrders, recentCustomers } = data;
  const orderStatusTotal = orderStatus.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl p-6 flex items-center justify-between bg-gradient-to-r from-[var(--pa-primary-light)] to-white border border-[var(--pa-border)]">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Welcome back, {adminName}! 🌱</h1>
          <p className="text-slate-500 text-sm">Here&apos;s what&apos;s happening with your store today.</p>
        </div>
        <button className="hidden sm:flex items-center gap-2 bg-white border border-[var(--pa-border)] rounded-lg px-4 py-2 text-sm text-slate-600">
          Today <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={ShoppingBag} title="Total Orders" value={stats.totalOrders.toLocaleString()} change={stats.ordersChange} iconColor="#2f9e44" />
        <StatCard icon={IndianRupee} title="Total Sales" value={`₹${stats.totalSales.toLocaleString()}`} change={stats.salesChange} iconColor="#2f9e44" />
        <StatCard icon={Users} title="Total Customers" value={stats.totalCustomers.toLocaleString()} change={stats.customersChange} iconColor="#2f9e44" />
        <StatCard icon={Sprout} title="Total Plants" value={stats.totalPlants.toLocaleString()} change={stats.plantsChange} iconColor="#2f9e44" />
      </div>

      {/* Sales chart + Orders donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-xl border border-[var(--pa-border)] p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-semibold text-slate-800">Sales Overview</h2>
            <span className="flex items-center gap-1 text-sm text-slate-500 border border-[var(--pa-border)] rounded-lg px-3 py-1.5">
              Last 7 Days
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-800">
            ₹{weeklySales.reduce((sum, d) => sum + d.sales, 0).toLocaleString()}
          </div>
          <div className="text-sm text-slate-400 mb-4">Total Sales (7 days)</div>
          <div className="h-64">
            {weeklySales.every((d) => d.sales === 0) ? (
              <div className="h-full flex items-center justify-center text-sm text-slate-400">
                No sales in the last 7 days yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklySales}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1ef" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis
                    tickFormatter={(v) => `₹${v / 1000}k`}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                  />
                  <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, 'Sales']} />
                  <Line type="monotone" dataKey="sales" stroke="#2f9e44" strokeWidth={3} dot={{ r: 4, fill: '#2f9e44' }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[var(--pa-border)] p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Orders Status</h2>
          {orderStatus.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-12">No orders yet.</p>
          ) : (
            <>
              <div className="relative h-44 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={orderStatus} dataKey="value" innerRadius={55} outerRadius={80} paddingAngle={2}>
                      {orderStatus.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center">
                  <div className="text-2xl font-bold text-slate-800">{orderStatusTotal}</div>
                  <div className="text-xs text-slate-400">Total</div>
                </div>
              </div>
              <div className="space-y-2 mt-2">
                {orderStatus.map((s) => (
                  <div key={s.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-slate-600">{s.name}</span>
                    </div>
                    <span className="text-slate-800 font-medium">
                      {s.value} ({orderStatusTotal > 0 ? ((s.value / orderStatusTotal) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Top plants + Recent customers + Recent orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl border border-[var(--pa-border)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Top Selling Plants</h2>
            <a href="/admin/reports" className="text-sm font-medium" style={{ color: 'var(--pa-primary)' }}>
              View All
            </a>
          </div>
          {topPlants.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No sales in the last 30 days.</p>
          ) : (
            <div className="space-y-4">
              {topPlants.map((p) => (
                <div key={p.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--pa-primary-light)] flex items-center justify-center">
                      <Sprout className="w-5 h-5" style={{ color: 'var(--pa-primary)' }} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-800">{p.name}</div>
                      <div className="text-xs text-slate-400">{p.sales}</div>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${p.change >= 0 ? 'text-[var(--pa-primary)]' : 'text-[var(--pa-danger)]'}`}>
                    {p.change >= 0 ? '↑' : '↓'} {Math.abs(p.change)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-[var(--pa-border)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Recent Customers</h2>
            <a href="/admin/customers" className="text-sm font-medium" style={{ color: 'var(--pa-primary)' }}>
              View All
            </a>
          </div>
          {recentCustomers.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No customers yet.</p>
          ) : (
            <div className="space-y-4">
              {recentCustomers.map((c) => (
                <div key={c.email} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-500 flex-shrink-0">
                      {c.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-800 truncate">{c.name}</div>
                      <div className="text-xs text-slate-400 truncate">{c.email}</div>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0">{timeAgo(c.createdAt)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-[var(--pa-border)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Recent Orders</h2>
            <a href="/admin/orders" className="text-sm font-medium" style={{ color: 'var(--pa-primary)' }}>
              View All
            </a>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[var(--pa-primary-light)] flex items-center justify-center flex-shrink-0">
                      <Sprout className="w-4 h-4" style={{ color: 'var(--pa-primary)' }} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-slate-400">{o.id}</div>
                      <div className="text-sm font-medium text-slate-800 truncate">{o.plant}</div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-semibold text-slate-800">{o.amount}</div>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${statusStyles[o.status] || 'bg-slate-100 text-slate-500'}`}>
                      {o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grow your business banner */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-[var(--pa-primary-light)] to-white border border-[var(--pa-border)] flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-1">Grow Your Business 🌿</h3>
          <p className="text-slate-500 text-sm">Add new plants, run offers and increase your store sales today.</p>
        </div>
        <a
          href="/admin/plants"
          className="flex items-center gap-2 text-white font-medium px-5 py-2.5 rounded-lg flex-shrink-0"
          style={{ backgroundColor: 'var(--pa-primary)' }}
        >
          Add New Plant <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}