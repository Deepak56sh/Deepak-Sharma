// ============================================
// FILE: src/app/admin/pages/about/page.js
// ============================================
'use client';
import { useState, useEffect } from 'react';
import { Loader2, Save, Upload, Plus, Trash2 } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

export default function AboutPageAdmin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/about`, { cache: 'no-cache' })
      .then((r) => r.json())
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const token = getToken();
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch(`${API_BASE_URL}/about/upload-image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const result = await res.json();
      if (result.success && result.data?.imageUrl) {
        setData((prev) => ({ ...prev, teamImage: result.data.imageUrl }));
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/about`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!result.success) alert(result.message || 'Failed to save');
    } catch (err) {
      alert('Failed to save — check API connection.');
    } finally {
      setSaving(false);
    }
  };

  const updateStat = (i, field, value) => {
    const stats = [...(data.stats || [])];
    stats[i] = { ...stats[i], [field]: value };
    setData({ ...data, stats });
  };

  const updateValue = (i, field, value) => {
    const values = [...(data.values || [])];
    values[i] = { ...values[i], [field]: value };
    setData({ ...data, values });
  };

  if (loading) {
    return <div className="p-16 text-center text-slate-400 flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Loading...</div>;
  }

  if (!data) {
    return <div className="p-16 text-center text-slate-400">Could not load About page data — check your /api/about endpoint.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">About Page</h1>
          <p className="text-slate-500 text-sm">Edit the content shown on your public /about page.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 text-white font-medium px-4 py-2.5 rounded-lg disabled:opacity-50"
          style={{ backgroundColor: 'var(--pa-primary)' }}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[var(--pa-border)] p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-600 text-sm mb-2">Title</label>
            <input value={data.title || ''} onChange={(e) => setData({ ...data, title: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-[var(--pa-border)] rounded-lg focus:outline-none focus:border-[var(--pa-primary)]" />
          </div>
          <div>
            <label className="block text-slate-600 text-sm mb-2">Subtitle</label>
            <input value={data.subtitle || ''} onChange={(e) => setData({ ...data, subtitle: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-[var(--pa-border)] rounded-lg focus:outline-none focus:border-[var(--pa-primary)]" />
          </div>
        </div>

        <div>
          <label className="block text-slate-600 text-sm mb-2">Main Heading</label>
          <input value={data.mainHeading || ''} onChange={(e) => setData({ ...data, mainHeading: e.target.value })}
            className="w-full p-3 bg-slate-50 border border-[var(--pa-border)] rounded-lg focus:outline-none focus:border-[var(--pa-primary)]" />
        </div>

        <div>
          <label className="block text-slate-600 text-sm mb-2">Description 1</label>
          <textarea rows={3} value={data.description1 || ''} onChange={(e) => setData({ ...data, description1: e.target.value })}
            className="w-full p-3 bg-slate-50 border border-[var(--pa-border)] rounded-lg focus:outline-none focus:border-[var(--pa-primary)] resize-none" />
        </div>
        <div>
          <label className="block text-slate-600 text-sm mb-2">Description 2</label>
          <textarea rows={3} value={data.description2 || ''} onChange={(e) => setData({ ...data, description2: e.target.value })}
            className="w-full p-3 bg-slate-50 border border-[var(--pa-border)] rounded-lg focus:outline-none focus:border-[var(--pa-primary)] resize-none" />
        </div>

        <div>
          <label className="block text-slate-600 text-sm mb-2">Team Image</label>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
              {data.teamImage && <img src={data.teamImage} alt="" className="w-full h-full object-cover" />}
            </div>
            <label className="px-4 py-2 rounded-lg border border-[var(--pa-border)] text-sm text-slate-600 cursor-pointer hover:border-[var(--pa-primary)] flex items-center gap-2">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Upload Image
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
            </label>
          </div>
        </div>

        {/* Stats */}
        <div>
          <label className="block text-slate-600 text-sm mb-2">Stats</label>
          <div className="grid sm:grid-cols-2 gap-3">
            {(data.stats || []).map((stat, i) => (
              <div key={i} className="flex gap-2">
                <input value={stat.number} onChange={(e) => updateStat(i, 'number', e.target.value)} placeholder="500+"
                  className="w-24 p-2.5 bg-slate-50 border border-[var(--pa-border)] rounded-lg text-sm" />
                <input value={stat.label} onChange={(e) => updateStat(i, 'label', e.target.value)} placeholder="Label"
                  className="flex-1 p-2.5 bg-slate-50 border border-[var(--pa-border)] rounded-lg text-sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div>
          <label className="block text-slate-600 text-sm mb-2">Core Values</label>
          <div className="space-y-3">
            {(data.values || []).map((v, i) => (
              <div key={i} className="grid sm:grid-cols-[60px_1fr_2fr] gap-2 p-3 bg-slate-50 rounded-lg">
                <input value={v.emoji} onChange={(e) => updateValue(i, 'emoji', e.target.value)} placeholder="🚀"
                  className="p-2 bg-white border border-[var(--pa-border)] rounded-lg text-center" />
                <input value={v.title} onChange={(e) => updateValue(i, 'title', e.target.value)} placeholder="Title"
                  className="p-2 bg-white border border-[var(--pa-border)] rounded-lg text-sm" />
                <input value={v.description} onChange={(e) => updateValue(i, 'description', e.target.value)} placeholder="Description"
                  className="p-2 bg-white border border-[var(--pa-border)] rounded-lg text-sm" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}