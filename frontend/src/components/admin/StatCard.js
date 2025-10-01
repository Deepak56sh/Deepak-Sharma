// ============================================
// FILE: src/components/admin/StatCard.js
// ============================================
export default function StatCard({ icon: Icon, title, value, change, color }) {
  return (
    <div className="p-6 bg-slate-800/50 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <span className={`text-sm font-semibold ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-gray-400 text-sm">{title}</div>
    </div>
  );
}