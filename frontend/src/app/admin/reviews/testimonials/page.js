'use client';
import { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Upload, Loader2, MessageSquareQuote, Star, User } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

const emptyTestimonial = { name: '', role: '', avatar: '', rating: 5, text: '', order: 0, isActive: true };

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyTestimonial);
  const [message, setMessage] = useState({ type: '', text: '' });
  const avatarRef = useRef(null);

  const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null);

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/testimonials/all`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (res.ok && data.success) setTestimonials(data.data || []);
      else showMsg('error', data.message || 'Failed to load testimonials');
    } catch {
      showMsg('error', 'Server error while loading testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openAdd = () => {
    setForm({ ...emptyTestimonial, order: testimonials.length });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (t) => {
    setForm({
      name: t.name || '',
      role: t.role || '',
      avatar: t.avatar || '',
      rating: t.rating || 5,
      text: t.text || '',
      order: t.order || 0,
      isActive: t.isActive !== false,
    });
    setEditingId(t._id);
    setShowModal(true);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('avatar', file);

      const res = await fetch(`${API_URL}/testimonials/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: fd,
      });
      const result = await res.json();

      if (res.ok && result.success && result.data?.url) {
        setForm((prev) => ({ ...prev, avatar: result.data.url }));
        showMsg('success', 'Avatar uploaded');
      } else {
        showMsg('error', result.message || 'Upload failed');
      }
    } catch {
      showMsg('error', 'Upload failed — check your connection');
    } finally {
      setUploading(false);
      if (avatarRef.current) avatarRef.current.value = '';
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) {
      showMsg('error', 'Name and testimonial text are required');
      return;
    }

    setSaving(true);
    try {
      const url = editingId ? `${API_URL}/testimonials/${editingId}` : `${API_URL}/testimonials`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showMsg('success', data.message || 'Saved successfully');
        setShowModal(false);
        fetchTestimonials();
      } else {
        showMsg('error', data.message || 'Save failed');
      }
    } catch {
      showMsg('error', 'Server error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this testimonial?')) return;
    try {
      const res = await fetch(`${API_URL}/testimonials/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showMsg('success', 'Deleted successfully');
        fetchTestimonials();
      } else {
        showMsg('error', data.message || 'Delete failed');
      }
    } catch {
      showMsg('error', 'Server error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1 flex items-center gap-2">
            <MessageSquareQuote className="w-6 h-6" style={{ color: 'var(--pa-primary)' }} />
            Testimonials
          </h1>
          <p className="text-slate-500 text-sm">Customer reviews shown on the homepage.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white font-medium"
          style={{ backgroundColor: 'var(--pa-primary)' }}
        >
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      {message.text && (
        <div
          className={`p-3 rounded-xl text-sm font-medium ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl border border-[var(--pa-border)] overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
          </div>
        ) : testimonials.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <p className="mb-3">No testimonials yet</p>
            <button onClick={openAdd} className="text-[var(--pa-primary)] font-semibold hover:underline">
              Add first testimonial
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-[var(--pa-border)]">
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Review</th>
                <th className="px-4 py-3 font-medium">Rating</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials
                .slice()
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((t) => (
                  <tr key={t._id} className="border-b border-[var(--pa-border)] last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                          {t.avatar ? (
                            <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{t.name}</p>
                          <p className="text-xs text-slate-400">{t.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 max-w-xs">
                      <p className="line-clamp-2">{t.text}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < t.rating ? 'fill-[#f5a623] text-[#f5a623]' : 'text-slate-200'}`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          t.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {t.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(t)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(t._id)}
                          className="p-2 hover:bg-rose-50 rounded-lg text-slate-500 hover:text-rose-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-[var(--pa-border)]">
            <div className="flex items-center justify-between p-5 border-b border-[var(--pa-border)]">
              <h2 className="text-lg font-bold text-slate-800">{editingId ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center flex-shrink-0 border border-[var(--pa-border)]">
                  {form.avatar ? (
                    <img src={form.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-slate-300" />
                  )}
                </div>
                <div>
                  <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => avatarRef.current?.click()}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-[var(--pa-primary-light)] text-[var(--pa-primary)] disabled:opacity-50"
                  >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    Upload Avatar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-[var(--pa-border)] rounded-lg text-sm"
                    placeholder="Priya Sharma"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Role / City</label>
                  <input
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--pa-border)] rounded-lg text-sm"
                    placeholder="Mumbai"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Testimonial Text *</label>
                <textarea
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-[var(--pa-border)] rounded-lg text-sm resize-none"
                  placeholder="My Monstera arrived healthy and beautifully packed..."
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Rating</label>
                  <select
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[var(--pa-border)] rounded-lg text-sm"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[var(--pa-border)] rounded-lg text-sm"
                  />
                </div>
                <div className="flex items-end pb-2.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="w-4 h-4 rounded text-[var(--pa-primary)]"
                    />
                    <span className="text-sm text-slate-600">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 bg-slate-100 rounded-lg text-sm font-medium">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="flex-1 py-2.5 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                  style={{ backgroundColor: 'var(--pa-primary)' }}
                >
                  {saving ? 'Saving...' : editingId ? 'Update' : 'Add Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}