'use client';
import { useState, useEffect } from 'react';
import { MapPin, Plus, Pencil, Trash2, X, Check } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

// ⚠️ ASSUMED ROUTES — badal do agar aapke backend me alag hain:
//   GET    /api/addresses            -> { success, data: [ {_id, name, phone, line1, line2, city, state, pincode, isDefault} ] }
//   POST   /api/addresses            -> body: address fields (bina _id)
//   PUT    /api/addresses/:id        -> body: address fields
//   DELETE /api/addresses/:id
//   PATCH  /api/addresses/:id/default

const emptyForm = { name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' };

export default function AddressesTab() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  });

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/addresses`, { headers: authHeaders() });
      const data = await res.json();
      setAddresses(data.success ? data.data : []);
    } catch (err) {
      console.error('Fetch addresses error:', err);
    } finally {
      setLoading(false);
    }
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (addr) => {
    setEditingId(addr._id);
    setForm({
      name: addr.name || '',
      phone: addr.phone || '',
      line1: addr.line1 || '',
      line2: addr.line2 || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || '',
    });
    setShowForm(true);
  };

  const saveAddress = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId ? `${API_URL}/addresses/${editingId}` : `${API_URL}/addresses`;
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) {
        setShowForm(false);
        fetchAddresses();
      }
    } catch (err) {
      console.error('Save address error:', err);
    } finally {
      setSaving(false);
    }
  };

  const deleteAddress = async (id) => {
    try {
      const res = await fetch(`${API_URL}/addresses/${id}`, { method: 'DELETE', headers: authHeaders() });
      const data = await res.json();
      if (data.success) setAddresses((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error('Delete address error:', err);
    }
  };

  const setDefault = async (id) => {
    try {
      const res = await fetch(`${API_URL}/addresses/${id}/default`, { method: 'PATCH', headers: authHeaders() });
      const data = await res.json();
      if (data.success) fetchAddresses();
    } catch (err) {
      console.error('Set default address error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2f9e44]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-[#14261d]">Saved Addresses</h3>
        {!showForm && (
          <button
            onClick={openAddForm}
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-[#2f9e44] text-white hover:bg-[#1f7a34] transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Address
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={saveAddress} className="bg-white rounded-2xl border border-[#e8ece9] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-[#14261d]">{editingId ? 'Edit Address' : 'New Address'}</h4>
            <button type="button" onClick={() => setShowForm(false)} className="text-slate-300 hover:text-slate-500">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <input required placeholder="Full Name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="px-3 py-2 bg-[#f6f8f7] border border-[#e8ece9] rounded-lg text-sm focus:outline-none focus:border-[#2f9e44]" />
            <input required placeholder="Phone Number" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="px-3 py-2 bg-[#f6f8f7] border border-[#e8ece9] rounded-lg text-sm focus:outline-none focus:border-[#2f9e44]" />
            <input required placeholder="Address Line 1" value={form.line1}
              onChange={(e) => setForm({ ...form, line1: e.target.value })}
              className="px-3 py-2 bg-[#f6f8f7] border border-[#e8ece9] rounded-lg text-sm focus:outline-none focus:border-[#2f9e44] sm:col-span-2" />
            <input placeholder="Address Line 2 (optional)" value={form.line2}
              onChange={(e) => setForm({ ...form, line2: e.target.value })}
              className="px-3 py-2 bg-[#f6f8f7] border border-[#e8ece9] rounded-lg text-sm focus:outline-none focus:border-[#2f9e44] sm:col-span-2" />
            <input required placeholder="City" value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="px-3 py-2 bg-[#f6f8f7] border border-[#e8ece9] rounded-lg text-sm focus:outline-none focus:border-[#2f9e44]" />
            <input required placeholder="State" value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="px-3 py-2 bg-[#f6f8f7] border border-[#e8ece9] rounded-lg text-sm focus:outline-none focus:border-[#2f9e44]" />
            <input required placeholder="Pincode" value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              className="px-3 py-2 bg-[#f6f8f7] border border-[#e8ece9] rounded-lg text-sm focus:outline-none focus:border-[#2f9e44]" />
          </div>

          <button type="submit" disabled={saving}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#2f9e44] text-white text-sm font-medium hover:bg-[#1f7a34] transition-colors disabled:opacity-50">
            {saving ? 'Saving...' : editingId ? 'Update Address' : 'Save Address'}
          </button>
        </form>
      )}

      {addresses.length === 0 && !showForm ? (
        <div className="bg-white rounded-2xl border border-[#e8ece9] p-16 text-center">
          <MapPin className="w-14 h-14 text-slate-200 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-[#14261d] mb-1">No addresses saved yet</h2>
          <p className="text-[#6b7280] text-sm">Add an address to speed up checkout.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr._id} className="bg-white rounded-2xl border border-[#e8ece9] p-5 relative">
              {addr.isDefault && (
                <span className="absolute top-4 right-4 text-xs font-semibold px-2 py-1 rounded-full bg-[#eaf7ee] text-[#2f9e44]">
                  Default
                </span>
              )}
              <p className="font-semibold text-[#14261d]">{addr.name}</p>
              <p className="text-sm text-[#6b7280] mt-1">{addr.phone}</p>
              <p className="text-sm text-[#6b7280] mt-2 leading-relaxed">
                {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
                {addr.city}, {addr.state} - {addr.pincode}
              </p>

              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#e8ece9]">
                {!addr.isDefault && (
                  <button onClick={() => setDefault(addr._id)}
                    className="text-xs font-medium text-[#2f9e44] hover:underline flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Set as Default
                  </button>
                )}
                <button onClick={() => openEditForm(addr)}
                  className="text-xs font-medium text-[#4b5563] hover:text-[#14261d] flex items-center gap-1 ml-auto">
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => deleteAddress(addr._id)}
                  className="text-xs font-medium text-red-500 hover:text-red-600 flex items-center gap-1">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}