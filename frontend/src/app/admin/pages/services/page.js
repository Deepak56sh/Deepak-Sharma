// ============================================
// FILE: src/app/admin/pages/services/page.js
// ============================================
'use client';
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Loader2, Briefcase } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

const emptyForm = { title: '', description: '', category: 'Development', price: '', duration: '', image: '', isActive: true };

export default function ServicesPageAdmin() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/services?limit=100`, { cache: 'no-cache' });
      const data = await res.json();
      if (data.success) setServices(data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({ ...emptyForm, ...s });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = getToken();
      const url = editing ? `${API_BASE_URL}/services/${editing._id}` : `${API_BASE_URL}/services`;
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (result.success) {
        await fetchServices();
        setShowModal(false);
      } else {
        alert(result.message || 'Failed to save service');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return;
    const token = getToken();
    await fetch(`${API_BASE_URL}/services/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    setServices((prev) => prev.filter((s) => s._id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Services</h1>
          <p className="text-slate-500 text-sm">Manage the services listed on your Services page.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 text-white font-medium px-4 py-2.5 rounded-lg" style={{ backgroundColor: 'var(--pa-primary)' }}>
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[var(--pa-border)] p-2">
        {loading ? (
          <div className="p-14 text-center text-slate-400 flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Loading...</div>
        ) : services.length === 0 ? (
          <div className="p-14 text-center text-slate-400">No services yet — add your first one.</div>
        ) : (
          <div className="divide-y divide-[var(--pa-border)]">
            {services.map((s) => (
              <div key={s._id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-[var(--pa-primary-light)] flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5" style={{ color: 'var(--pa-primary)' }} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-slate-800 truncate">{s.title}</div>
                    <div className="text-xs text-slate-400 truncate">{s.category} · {s.price}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(s)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(s._id)} className="p-2 hover:bg-rose-50 rounded-lg text-slate-500 hover:text-rose-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg border border-[var(--pa-border)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[var(--pa-border)]">
              <h2 className="text-xl font-bold text-slate-800">{editing ? 'Edit Service' : 'Add Service'}</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Service title"
                className="w-full p-3 bg-slate-50 border border-[var(--pa-border)] rounded-lg focus:outline-none focus:border-[var(--pa-primary)]" />
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Description"
                className="w-full p-3 bg-slate-50 border border-[var(--pa-border)] rounded-lg focus:outline-none focus:border-[var(--pa-primary)] resize-none" />
              <div className="grid grid-cols-2 gap-4">
                <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category"
                  className="p-3 bg-slate-50 border border-[var(--pa-border)] rounded-lg focus:outline-none focus:border-[var(--pa-primary)]" />
                <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="Duration (e.g. 2-4 weeks)"
                  className="p-3 bg-slate-50 border border-[var(--pa-border)] rounded-lg focus:outline-none focus:border-[var(--pa-primary)]" />
              </div>
              <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price range"
                className="w-full p-3 bg-slate-50 border border-[var(--pa-border)] rounded-lg focus:outline-none focus:border-[var(--pa-primary)]" />
              <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Image URL"
                className="w-full p-3 bg-slate-50 border border-[var(--pa-border)] rounded-lg focus:outline-none focus:border-[var(--pa-primary)]" />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 bg-[var(--pa-primary)] text-white rounded-lg font-medium hover:bg-[var(--pa-primary-dark)] disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} {editing ? 'Save Changes' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}