// ============================================
// FILE: src/app/admin/pages/contact/page.js
// ============================================
'use client';
import { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

export default function ContactPageAdmin() {
  const [data, setData] = useState({
    contactEmail: '', contactPhone: '', contactAddress: '',
    businessHours: { weekdays: '', saturday: '', sunday: '' },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/settings`, { cache: 'no-cache' })
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) setData((prev) => ({ ...prev, ...res.data, businessHours: { ...prev.businessHours, ...(res.data.businessHours || {}) } }));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!result.success) alert(result.message || 'Failed to save');
    } catch {
      alert('Failed to save — check API connection.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-16 text-center text-slate-400 flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Contact Info</h1>
          <p className="text-slate-500 text-sm">Shown on your public /contact page.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 text-white font-medium px-4 py-2.5 rounded-lg disabled:opacity-50" style={{ backgroundColor: 'var(--pa-primary)' }}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[var(--pa-border)] p-6 space-y-5 max-w-2xl">
        <div>
          <label className="block text-slate-600 text-sm mb-2">Contact Email</label>
          <input value={data.contactEmail} onChange={(e) => setData({ ...data, contactEmail: e.target.value })}
            className="w-full p-3 bg-slate-50 border border-[var(--pa-border)] rounded-lg focus:outline-none focus:border-[var(--pa-primary)]" />
        </div>
        <div>
          <label className="block text-slate-600 text-sm mb-2">Contact Phone</label>
          <input value={data.contactPhone} onChange={(e) => setData({ ...data, contactPhone: e.target.value })}
            className="w-full p-3 bg-slate-50 border border-[var(--pa-border)] rounded-lg focus:outline-none focus:border-[var(--pa-primary)]" />
        </div>
        <div>
          <label className="block text-slate-600 text-sm mb-2">Address</label>
          <input value={data.contactAddress} onChange={(e) => setData({ ...data, contactAddress: e.target.value })}
            className="w-full p-3 bg-slate-50 border border-[var(--pa-border)] rounded-lg focus:outline-none focus:border-[var(--pa-primary)]" />
        </div>

        <div>
          <label className="block text-slate-600 text-sm mb-3">Business Hours</label>
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Mon - Fri</label>
              <input value={data.businessHours.weekdays} onChange={(e) => setData({ ...data, businessHours: { ...data.businessHours, weekdays: e.target.value } })}
                className="w-full p-2.5 bg-slate-50 border border-[var(--pa-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--pa-primary)]" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Saturday</label>
              <input value={data.businessHours.saturday} onChange={(e) => setData({ ...data, businessHours: { ...data.businessHours, saturday: e.target.value } })}
                className="w-full p-2.5 bg-slate-50 border border-[var(--pa-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--pa-primary)]" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Sunday</label>
              <input value={data.businessHours.sunday} onChange={(e) => setData({ ...data, businessHours: { ...data.businessHours, sunday: e.target.value } })}
                className="w-full p-2.5 bg-slate-50 border border-[var(--pa-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--pa-primary)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}