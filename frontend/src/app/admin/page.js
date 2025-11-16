// ============================================
// FILE: src/app/admin/page.js (Dashboard)
// ============================================
'use client';
import { useState } from 'react';
import { Briefcase, MessageSquare, Users, TrendingUp, Eye } from 'lucide-react';
import StatCard from '@/components/admin/StatCard';

export default function AdminDashboard() {
  const [stats] = useState({
    totalServices: 6,
    totalMessages: 24,
    totalViews: '12.5K',
    conversionRate: '3.2%'
  });

  const [recentMessages] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', subject: 'Web Development', date: '2 hours ago' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', subject: 'Mobile App', date: '5 hours ago' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', subject: 'UI/UX Design', date: '1 day ago' },
  ]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here&apos;s what&apos;s happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Briefcase}
          title="Total Services"
          value={stats.totalServices}
          change={12}
          color="from-blue-500 to-cyan-500"
        />
        <StatCard
          icon={MessageSquare}
          title="New Messages"
          value={stats.totalMessages}
          change={8}
          color="from-purple-500 to-pink-500"
        />
        <StatCard
          icon={Eye}
          title="Total Views"
          value={stats.totalViews}
          change={15}
          color="from-emerald-500 to-teal-500"
        />
        <StatCard
          icon={TrendingUp}
          title="Conversion Rate"
          value={stats.conversionRate}
          change={-2}
          color="from-orange-500 to-red-500"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Messages</h2>
            <button className="text-purple-400 hover:text-purple-300 text-sm font-semibold">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {recentMessages.map((msg) => (
              <div
                key={msg.id}
                className="p-4 bg-slate-900/50 rounded-lg border border-purple-500/10 hover:border-purple-500/30 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-white font-semibold">{msg.name}</div>
                    <div className="text-gray-400 text-sm">{msg.email}</div>
                  </div>
                  <span className="text-xs text-gray-500">{msg.date}</span>
                </div>
                <div className="text-gray-300 text-sm">{msg.subject}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-6">
          <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
          
          <div className="space-y-3">
            {[
              { label: 'Add New Service', href: '/admin/services', color: 'from-blue-500 to-cyan-500' },
              { label: 'Update Hero Section', href: '/admin/hero', color: 'from-purple-500 to-pink-500' },
              { label: 'Edit About Page', href: '/admin/about', color: 'from-emerald-500 to-teal-500' },
              { label: 'View Messages', href: '/admin/contact-messages', color: 'from-orange-500 to-red-500' },
            ].map((action, i) => (
              <a
                key={i}
                href={action.href}
                className={`block p-4 bg-gradient-to-r ${action.color} rounded-lg text-white font-semibold hover:shadow-lg transition-all transform hover:scale-105`}
              >
                {action.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
