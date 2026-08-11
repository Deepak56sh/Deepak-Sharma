'use client';
import { useState, useEffect } from 'react';
import { Ticket, Plus, X, Pencil, Trash2, Power } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

const emptyForm = {
  code: '',
  discountType: 'percentage',
  discountValue: '',
  maxDiscount: '',
  minOrderValue: '',
  usageLimit: '',
  expiresAt: '',
  isActive: true,
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/coupons`, { headers: authHeaders() });
      const data = await res.json();
      setCoupons(data.success ? data.data : []);
    } catch (err) {
      console.error('Fetch coupons error:', err);
    } finally {
      setLoading(false);
    }
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setShowForm(true);
  };

  const openEditForm = (c) => {
    setEditingId(c._id);
    setForm({
      code: c.code,
      discountType: c.discountType,
      discountValue: c.discountValue,
      maxDiscount: c.maxDiscount || '',
      minOrderValue: c.minOrderValue || '',
      usageLimit: c.usageLimit || '',
      expiresAt: c.expiresAt ? c.expiresAt.slice(0, 10) : '',
      isActive: c.isActive,
    });
    setError('');
    setShowForm(true);
  };

  const saveCoupon = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        code: form.code,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
        minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : 0,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
        expiresAt: form.expiresAt || null,
        isActive: form.isActive,
      };
      const url = editingId ? `${API_URL}/admin/coupons/${editingId}` : `${API_URL}/admin/coupons`;
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) {
        setShowForm(false);
        fetchCoupons();
      } else {
        setError(data.message || 'Failed to save coupon');
      }
    } catch (err) {
      console.error('Save coupon error:', err);
      setError('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id) => {
    try {
      const res = await fetch(`${API_URL}/admin/coupons/${id}/toggle`, { method: 'PATCH', headers: authHeaders() });
      const data = await res.json();
      if (data.success) fetchCoupons();
    } catch (err) {
      console.error('Toggle coupon error:', err);
    }
  };

  const deleteCoupon = async (id) => {
    if (!confirm('Delete this coupon? This cannot be undone.')) return;
    try {
      const res = await fetch(`${API_URL}/admin/coupons/${id}`, { method: 'DELETE', headers: authHeaders() });
      const data = await res.json();
      if (data.success) setCoupons((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error('Delete coupon error:', err);
    }
  };

  const formatDiscount = (c) =>
    c.discountType === 'percentage'
      ? `${c.discountValue}%${c.maxDiscount ? ` (max ₹${c.maxDiscount})` : ''}`
      : `₹${c.discountValue}`;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#eaf7ee] text-[#2f9e44] flex items-center justify-center">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#14261d]">Coupons</h1>
            <p className="text-sm text-[#6b7280]">Create and manage discount coupons.</p>
          </div>
        </div>
        {!showForm && (
          <button
            onClick={openAddForm}
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg bg-[#2f9e44] text-white hover:bg-[#1f7a34] transition-colors"
          >
            <Plus className="w-4 h-4" /> Add New
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={saveCoupon} className="bg-white rounded-2xl border border-[#e8ece9] p-5 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[#14261d]">{editingId ? 'Edit Coupon' : 'New Coupon'}</h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-slate-300 hover:text-slate-500">
              <X className="w-4 h-4" />
            </button>
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</div>}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[#6b7280] mb-1.5 block">Coupon Code</label>
              <input required placeholder="e.g. PLANT10" value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 bg-[#f6f8f7] border border-[#e8ece9] rounded-lg text-sm font-mono uppercase focus:outline-none focus:border-[#2f9e44]" />
            </div>

            <div>
              <label className="text-sm text-[#6b7280] mb-1.5 block">Discount Type</label>
              <select value={form.discountType}
                onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                className="w-full px-3 py-2 bg-[#f6f8f7] border border-[#e8ece9] rounded-lg text-sm focus:outline-none focus:border-[#2f9e44]">
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount (₹)</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-[#6b7280] mb-1.5 block">
                {form.discountType === 'percentage' ? 'Discount %' : 'Discount Amount (₹)'}
              </label>
              <input required type="number" min="0" placeholder={form.discountType === 'percentage' ? '10' : '300'}
                value={form.discountValue}
                onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                className="w-full px-3 py-2 bg-[#f6f8f7] border border-[#e8ece9] rounded-lg text-sm focus:outline-none focus:border-[#2f9e44]" />
            </div>

            {form.discountType === 'percentage' && (
              <div>
                <label className="text-sm text-[#6b7280] mb-1.5 block">Max Discount (₹, optional)</label>
                <input type="number" min="0" placeholder="No cap" value={form.maxDiscount}
                  onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f6f8f7] border border-[#e8ece9] rounded-lg text-sm focus:outline-none focus:border-[#2f9e44]" />
              </div>
            )}

            <div>
              <label className="text-sm text-[#6b7280] mb-1.5 block">Minimum Order Value (₹)</label>
              <input type="number" min="0" placeholder="0" value={form.minOrderValue}
                onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })}
                className="w-full px-3 py-2 bg-[#f6f8f7] border border-[#e8ece9] rounded-lg text-sm focus:outline-none focus:border-[#2f9e44]" />
            </div>

            <div>
              <label className="text-sm text-[#6b7280] mb-1.5 block">Usage Limit (optional)</label>
              <input type="number" min="0" placeholder="Unlimited" value={form.usageLimit}
                onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                className="w-full px-3 py-2 bg-[#f6f8f7] border border-[#e8ece9] rounded-lg text-sm focus:outline-none focus:border-[#2f9e44]" />
            </div>

            <div>
              <label className="text-sm text-[#6b7280] mb-1.5 block">Expiry Date (optional)</label>
              <input type="date" value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                className="w-full px-3 py-2 bg-[#f6f8f7] border border-[#e8ece9] rounded-lg text-sm focus:outline-none focus:border-[#2f9e44]" />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input type="checkbox" id="isActive" checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-4 h-4 accent-[#2f9e44]" />
              <label htmlFor="isActive" className="text-sm text-[#4b5563]">Active immediately</label>
            </div>
          </div>

          <button type="submit" disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-[#2f9e44] text-white text-sm font-medium hover:bg-[#1f7a34] transition-colors disabled:opacity-50">
            {saving ? 'Saving...' : editingId ? 'Update Coupon' : 'Create Coupon'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2f9e44]"></div>
        </div>
      ) : coupons.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e8ece9] p-16 text-center">
          <Ticket className="w-14 h-14 text-slate-200 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-[#14261d] mb-1">No coupons yet</h2>
          <p className="text-[#6b7280] text-sm">Create your first coupon to offer discounts.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#e8ece9] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f6f8f7] text-[#6b7280]">
                <th className="text-left px-6 py-3 font-medium">Code</th>
                <th className="text-left px-6 py-3 font-medium">Discount</th>
                <th className="text-left px-6 py-3 font-medium">Min. Order</th>
                <th className="text-left px-6 py-3 font-medium">Used</th>
                <th className="text-left px-6 py-3 font-medium">Expires</th>
                <th className="text-left px-6 py-3 font-medium">Status</th>
                <th className="text-right px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id} className="border-t border-[#e8ece9] hover:bg-[#f6f8f7]/50">
                  <td className="px-6 py-4 font-mono font-semibold text-[#14261d]">{c.code}</td>
                  <td className="px-6 py-4 text-[#4b5563]">{formatDiscount(c)}</td>
                  <td className="px-6 py-4 text-[#4b5563]">{c.minOrderValue ? `₹${c.minOrderValue}` : '—'}</td>
                  <td className="px-6 py-4 text-[#4b5563]">{c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ''}</td>
                  <td className="px-6 py-4 text-[#4b5563]">
                    {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Never'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => toggleActive(c._id)} title="Toggle active"
                        className="text-slate-400 hover:text-[#2f9e44]">
                        <Power className="w-4 h-4" />
                      </button>
                      <button onClick={() => openEditForm(c)} title="Edit"
                        className="text-slate-400 hover:text-[#14261d]">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteCoupon(c._id)} title="Delete"
                        className="text-slate-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}