// ============================================
// FILE: src/app/admin/page.js (Dashboard)
// ============================================
'use client';
import { useState } from 'react';
import { ShoppingBag, IndianRupee, Users, Sprout, ChevronDown, ArrowRight } from 'lucide-react';
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

// NOTE: all values below are placeholder/dummy data for layout purposes.
// Wire these up to real admin APIs in the next phase (Plants, Orders, Customers endpoints).

const salesData = [
  { day: 'Mon', sales: 32000 },
  { day: 'Tue', sales: 38000 },
  { day: 'Wed', sales: 22000 },
  { day: 'Thu', sales: 64540 },
  { day: 'Fri', sales: 58000 },
  { day: 'Sat', sales: 61000 },
  { day: 'Sun', sales: 46000 },
];

const orderStatus = [
  { name: 'Pending', value: 320, color: '#f5a623' },
  { name: 'Processing', value: 450, color: '#3b82f6' },
  { name: 'Completed', value: 378, color: '#2f9e44' },
  { name: 'Cancelled', value: 100, color: '#f43f5e' },
];

const recentOrders = [
  { id: '#ORD-1001', plant: 'Areca Palm', amount: '₹2,450', status: 'Completed', time: '2 mins ago' },
  { id: '#ORD-1002', plant: 'Monstera Plant', amount: '₹1,125', status: 'Processing', time: '15 mins ago' },
  { id: '#ORD-1003', plant: 'Snake Plant', amount: '₹3,560', status: 'Pending', time: '1 hour ago' },
  { id: '#ORD-1004', plant: 'Peace Lily', amount: '₹1,890', status: 'Completed', time: '2 hours ago' },
  { id: '#ORD-1005', plant: 'Fiddle Leaf Fig', amount: '₹980', status: 'Cancelled', time: '3 hours ago' },
];

const topPlants = [
  { name: 'Areca Palm', sales: '523 Sales', change: 18.5 },
  { name: 'Snake Plant', sales: '412 Sales', change: 12.9 },
  { name: 'Peace Lily', sales: '310 Sales', change: 8.7 },
  { name: 'Fiddle Leaf Fig', sales: '289 Sales', change: -2.4 },
];

const recentCustomers = [
  { name: 'Rohan Mehta', email: 'rohan.mehta@example.com', time: '2 mins ago' },
  { name: 'Priya Sharma', email: 'priya.sharma@example.com', time: '15 mins ago' },
  { name: 'Amit Verma', email: 'amit.verma@example.com', time: '1 hour ago' },
  { name: 'Neha Singh', email: 'neha.singh@example.com', time: '2 hours ago' },
];

const statusStyles = {
  Completed: 'bg-[var(--pa-primary-light)] text-[var(--pa-primary)]',
  Processing: 'bg-blue-50 text-blue-500',
  Pending: 'bg-amber-50 text-amber-500',
  Cancelled: 'bg-rose-50 text-rose-500',
};

export default function AdminDashboard() {
  const [adminName] = useState('Admin');

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
        <StatCard icon={ShoppingBag} title="Total Orders" value="1,248" change={12.4} iconColor="#2f9e44" />
        <StatCard icon={IndianRupee} title="Total Sales" value="₹3,45,678" change={15.8} iconColor="#2f9e44" />
        <StatCard icon={Users} title="Total Customers" value="856" change={8.3} iconColor="#2f9e44" />
        <StatCard icon={Sprout} title="Total Plants" value="542" change={6.7} iconColor="#2f9e44" />
      </div>

      {/* Sales chart + Orders donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-xl border border-[var(--pa-border)] p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-semibold text-slate-800">Sales Overview</h2>
            <button className="flex items-center gap-1 text-sm text-slate-500 border border-[var(--pa-border)] rounded-lg px-3 py-1.5">
              This Week <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <div className="text-2xl font-bold text-slate-800">₹3,45,678</div>
          <div className="text-sm text-slate-400 mb-4">Total Sales</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
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
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[var(--pa-border)] p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Orders Status</h2>
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
              <div className="text-2xl font-bold text-slate-800">1,248</div>
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
                  {s.value} ({((s.value / 1248) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top plants + Recent customers + Recent orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl border border-[var(--pa-border)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Top Selling Plants</h2>
            <button className="text-sm font-medium" style={{ color: 'var(--pa-primary)' }}>
              View All
            </button>
          </div>
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
        </div>

        <div className="bg-white rounded-xl border border-[var(--pa-border)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Recent Customers</h2>
            <button className="text-sm font-medium" style={{ color: 'var(--pa-primary)' }}>
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentCustomers.map((c) => (
              <div key={c.email} className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-500 flex-shrink-0">
                    {c.name[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-800 truncate">{c.name}</div>
                    <div className="text-xs text-slate-400 truncate">{c.email}</div>
                  </div>
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0">{c.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[var(--pa-border)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Recent Orders</h2>
            <button className="text-sm font-medium" style={{ color: 'var(--pa-primary)' }}>
              View All
            </button>
          </div>
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
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusStyles[o.status]}`}>
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
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
