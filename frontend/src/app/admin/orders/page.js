'use client';
import { useState, useEffect } from 'react';
import { ShoppingBag, ChevronDown, ChevronUp, Loader2, Search } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

const STATUS_OPTIONS = ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

const statusColor = (status) => {
  switch (status) {
    case 'Delivered': return 'bg-green-100 text-green-700';
    case 'Shipped': return 'bg-blue-100 text-blue-700';
    case 'Confirmed': return 'bg-yellow-100 text-yellow-700';
    case 'Cancelled': return 'bg-red-100 text-red-700';
    default: return 'bg-slate-100 text-slate-600';
  }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (search) params.append('search', search);

      const res = await fetch(`${API_URL}/orders?${params.toString()}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setOrders(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchOrders, 300); // simple debounce for search
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`${API_URL}/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6" style={{ color: 'var(--pa-primary)' }} />
            Orders
          </h1>
          <p className="text-slate-500 text-sm mt-1">Track and manage customer orders.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, name or phone..."
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-[var(--pa-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--pa-primary)]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-[var(--pa-border)] rounded-lg text-sm"
        >
          <option value="all">All Status</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--pa-primary)' }} />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-[var(--pa-border)]">
          <ShoppingBag className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-500">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const isOpen = openId === order._id;
            return (
              <div key={order._id} className="bg-white rounded-xl border border-[var(--pa-border)] overflow-hidden">
                <div
                  onClick={() => setOpenId(isOpen ? null : order._id)}
                  className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-50"
                >
                  <div>
                    <p className="font-semibold text-slate-800">#{order.orderId}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {order.shippingAddress?.fullName} • {order.items?.length} items • ₹{order.total?.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <span className="text-xs text-slate-400 hidden sm:block">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-[var(--pa-border)] px-5 py-5 bg-slate-50 grid sm:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 mb-2">Items</h4>
                      <div className="space-y-2">
                        {order.items?.map((it, i) => (
                          <div key={i} className="flex items-center gap-3 text-sm">
                            {it.image && <img src={it.image} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                            <span className="flex-1 text-slate-700">{it.name} × {it.quantity}</span>
                            <span className="font-medium text-slate-800">₹{it.price * it.quantity}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-[var(--pa-border)] text-sm space-y-1">
                        <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
                        <div className="flex justify-between text-slate-500"><span>Shipping</span><span>{order.shipping ? `₹${order.shipping}` : 'Free'}</span></div>
                        <div className="flex justify-between font-semibold text-slate-800"><span>Total</span><span>₹{order.total}</span></div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 mb-2">Shipping Details</h4>
                      <div className="text-sm text-slate-600 space-y-1">
                        <p>{order.shippingAddress?.fullName}</p>
                        <p>{order.shippingAddress?.phone} · {order.shippingAddress?.email}</p>
                        <p>{order.shippingAddress?.address}, {order.shippingAddress?.landmark}</p>
                        <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                        <p className="text-slate-500">Payment: <span className="uppercase">{order.paymentMethod}</span></p>
                      </div>

                      <div className="mt-4">
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">Update Status</label>
                        <select
                          value={order.status}
                          disabled={updatingId === order._id}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[var(--pa-border)] rounded-lg text-sm"
                        >
                          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}