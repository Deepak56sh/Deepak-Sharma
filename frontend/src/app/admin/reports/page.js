'use client';
import { useState, useEffect } from 'react';
import { Loader2, TrendingUp, ShoppingBag, IndianRupee, BarChart3, PieChart, Ticket } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

const ranges = [
  { key: '7d', label: '7 Days' },
  { key: '30d', label: '30 Days' },
  { key: '90d', label: '90 Days' },
  { key: 'all', label: 'All Time' },
];

const statusColors = {
  delivered: '#22c55e',
  shipped: '#3b82f6',
  processing: '#eab308',
  pending: '#f97316',
  cancelled: '#ef4444',
};

export default function ReportsPage() {
  const [range, setRange] = useState('30d');
  const [sales, setSales] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [statusBreakdown, setStatusBreakdown] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null);
  const authHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

  useEffect(() => {
    fetchAll();
  }, [range]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [salesRes, topRes, statusRes, couponRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/reports/sales?range=${range}`, { headers: authHeaders() }),
        fetch(`${API_BASE_URL}/admin/reports/top-products?range=${range}&limit=8`, { headers: authHeaders() }),
        fetch(`${API_BASE_URL}/admin/reports/order-status`, { headers: authHeaders() }),
        fetch(`${API_BASE_URL}/admin/reports/coupons`, { headers: authHeaders() }),
      ]);
      const [salesData, topData, statusData, couponData] = await Promise.all([
        salesRes.json(), topRes.json(), statusRes.json(), couponRes.json(),
      ]);
      if (salesData.success) setSales(salesData.data);
      if (topData.success) setTopProducts(topData.data);
      if (statusData.success) setStatusBreakdown(statusData.data);
      if (couponData.success) setCoupons(couponData.data);
    } catch (err) {
      console.error('Fetch reports error:', err);
    } finally {
      setLoading(false);
    }
  };

  const maxDailyRevenue = sales?.daily?.length ? Math.max(...sales.daily.map((d) => d.revenue)) : 0;
  const maxUnitsSold = topProducts.length ? Math.max(...topProducts.map((p) => p.unitsSold)) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Reports</h1>
          <p className="text-slate-500 text-sm">Sales and performance reports.</p>
        </div>
        <div className="flex items-center gap-1 bg-white border border-[var(--pa-border)] rounded-lg p-1">
          {ranges.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                range === r.key ? 'text-white' : 'text-slate-500 hover:bg-slate-50'
              }`}
              style={range === r.key ? { backgroundColor: 'var(--pa-primary)' } : undefined}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-[var(--pa-border)] p-5">
              <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center mb-3">
                <IndianRupee className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-slate-800">₹{(sales?.summary.totalRevenue || 0).toLocaleString()}</p>
              <p className="text-xs text-slate-500 mt-1">Total Revenue</p>
            </div>
            <div className="bg-white rounded-xl border border-[var(--pa-border)] p-5">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-slate-800">{sales?.summary.totalOrders || 0}</p>
              <p className="text-xs text-slate-500 mt-1">Total Orders</p>
            </div>
            <div className="bg-white rounded-xl border border-[var(--pa-border)] p-5">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-slate-800">₹{(sales?.summary.avgOrderValue || 0).toLocaleString()}</p>
              <p className="text-xs text-slate-500 mt-1">Avg Order Value</p>
            </div>
          </div>

          {/* Revenue trend - simple CSS bar chart, no chart library dependency */}
          <div className="bg-white rounded-xl border border-[var(--pa-border)] p-6">
            <h3 className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" style={{ color: 'var(--pa-primary)' }} /> Revenue Trend
            </h3>
            <p className="text-xs text-slate-400 mb-5">Daily revenue for selected period</p>

            {!sales?.daily?.length ? (
              <p className="text-sm text-slate-400 text-center py-10">No orders in this period yet.</p>
            ) : (
              <div className="flex items-end gap-1.5 overflow-x-auto pb-2" style={{ minHeight: '160px' }}>
                {sales.daily.map((d) => (
                  <div key={d.date} className="flex flex-col items-center gap-1.5 flex-shrink-0" style={{ width: '28px' }}>
                    <div
                      className="w-full rounded-t transition-all hover:opacity-80"
                      style={{
                        height: `${maxDailyRevenue > 0 ? Math.max((d.revenue / maxDailyRevenue) * 130, 3) : 3}px`,
                        backgroundColor: 'var(--pa-primary)',
                      }}
                      title={`${d.date}: ₹${d.revenue.toLocaleString()} (${d.orders} orders)`}
                    />
                    <span className="text-[9px] text-slate-400 rotate-0 whitespace-nowrap">
                      {new Date(d.date).getDate()}/{new Date(d.date).getMonth() + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Top products */}
            <div className="bg-white rounded-xl border border-[var(--pa-border)] p-6">
              <h3 className="font-semibold text-slate-800 mb-5 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" style={{ color: 'var(--pa-primary)' }} /> Top Selling Products
              </h3>
              {topProducts.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-10">No sales data yet.</p>
              ) : (
                <div className="space-y-4">
                  {topProducts.map((p, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-700 font-medium truncate pr-2">{p.name}</span>
                        <span className="text-slate-500 flex-shrink-0">{p.unitsSold} sold · ₹{p.revenue.toLocaleString()}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${maxUnitsSold > 0 ? (p.unitsSold / maxUnitsSold) * 100 : 0}%`,
                            backgroundColor: 'var(--pa-primary)',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order status breakdown */}
            <div className="bg-white rounded-xl border border-[var(--pa-border)] p-6">
              <h3 className="font-semibold text-slate-800 mb-5 flex items-center gap-2">
                <PieChart className="w-4 h-4" style={{ color: 'var(--pa-primary)' }} /> Order Status
              </h3>
              {statusBreakdown.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-10">No orders yet.</p>
              ) : (
                <div className="space-y-4">
                  {statusBreakdown.map((s) => (
                    <div key={s.status}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-700 font-medium capitalize">{s.status}</span>
                        <span className="text-slate-500">{s.count} orders ({s.percentage}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${s.percentage}%`, backgroundColor: statusColors[s.status] || '#94a3b8' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Coupon usage */}
          <div className="bg-white rounded-xl border border-[var(--pa-border)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--pa-border)]">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Ticket className="w-4 h-4" style={{ color: 'var(--pa-primary)' }} /> Coupon Usage
              </h3>
            </div>
            {coupons.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-10">No coupons created yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500">
                    <th className="text-left px-6 py-3 font-medium">Code</th>
                    <th className="text-left px-6 py-3 font-medium">Discount</th>
                    <th className="text-left px-6 py-3 font-medium">Used</th>
                    <th className="text-left px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => (
                    <tr key={c.code} className="border-t border-[var(--pa-border)]">
                      <td className="px-6 py-3 font-mono font-medium text-slate-800">{c.code}</td>
                      <td className="px-6 py-3 text-slate-600">
                        {c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}
                      </td>
                      <td className="px-6 py-3 text-slate-600">{c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ''}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {c.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}