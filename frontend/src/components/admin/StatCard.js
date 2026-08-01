'use client';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export default function StatCard({ icon: Icon, title, value, change, sparkline, iconColor = '#2f9e44' }) {
  const isPositive = change >= 0;
  const chartData = (sparkline || [4, 6, 5, 8, 6, 9, 7]).map((v, i) => ({ i, v }));

  return (
    <div className="p-5 bg-white rounded-xl border border-[var(--pa-border)] hover:shadow-sm transition-all">
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${iconColor}1a` }}
        >
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
        </div>
        {change !== undefined && (
          <span
            className={`flex items-center gap-1 text-xs font-semibold ${
              isPositive ? 'text-[var(--pa-primary)]' : 'text-[var(--pa-danger)]'
            }`}
          >
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {isPositive ? '+' : ''}
            {change}%
          </span>
        )}
      </div>

      <div className="text-sm text-slate-500 mb-1">{title}</div>
      <div className="text-2xl font-bold text-slate-800 mb-2">{value}</div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">vs last 7 days</span>
        <div className="w-16 h-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line type="monotone" dataKey="v" stroke={iconColor} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
