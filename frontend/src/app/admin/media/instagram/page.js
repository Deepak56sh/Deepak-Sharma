'use client';
import { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Upload, Loader2, Video, Instagram } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

const emptyReel = { video: '', poster: '', title: '', link: '', order: 0, isActive: true };

export default function InstagramAdminPage() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyReel);
  const [message, setMessage] = useState({ type: '', text: '' });
  const videoRef = useRef(null);
  const posterRef = useRef(null);

  const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null);

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const fetchReels = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/instagram/all`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (res.ok && data.success) setReels(data.data || []);
      else showMsg('error', data.message || 'Failed to load reels');
    } catch {
      showMsg('error', 'Server error while loading reels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  const openAdd = () => {
    setForm({ ...emptyReel, order: reels.length });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (reel) => {
    setForm({
      video: reel.video || '',
      poster: reel.poster || '',
      title: reel.title || '',
      link: reel.link || '',
      order: reel.order || 0,
      isActive: reel.isActive !== false,
    });
    setEditingId(reel._id);
    setShowModal(true);
  };

  const handleUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('media', file);

      const res = await fetch(`${API_URL}/instagram/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: fd,
      });
      const result = await res.json();

      if (res.ok && result.success && result.data?.url) {
        setForm((prev) => ({ ...prev, [field]: result.data.url }));
        showMsg('success', 'Uploaded to Cloudinary');
      } else {
        showMsg('error', result.message || 'Upload failed');
      }
    } catch {
      showMsg('error', 'Upload failed — check your connection');
    } finally {
      setUploading(false);
      if (videoRef.current) videoRef.current.value = '';
      if (posterRef.current) posterRef.current.value = '';
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.video) {
      showMsg('error', 'Please upload a video first');
      return;
    }

    setSaving(true);
    try {
      const url = editingId ? `${API_URL}/instagram/${editingId}` : `${API_URL}/instagram`;
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
        fetchReels();
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
    if (!confirm('Delete this reel?')) return;
    try {
      const res = await fetch(`${API_URL}/instagram/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showMsg('success', 'Deleted successfully');
        fetchReels();
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
            <Instagram className="w-6 h-6" style={{ color: 'var(--pa-primary)' }} />
            Instagram Reels
          </h1>
          <p className="text-slate-500 text-sm">Video reels shown on the homepage.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white font-medium"
          style={{ backgroundColor: 'var(--pa-primary)' }}
        >
          <Plus className="w-4 h-4" /> Add Reel
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
        ) : reels.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <p className="mb-3">No reels yet</p>
            <button onClick={openAdd} className="text-[var(--pa-primary)] font-semibold hover:underline">
              Add first reel
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-[var(--pa-border)]">
                <th className="px-4 py-3 font-medium">Preview</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reels
                .slice()
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((reel) => (
                  <tr key={reel._id} className="border-b border-[var(--pa-border)] last:border-0">
                    <td className="px-4 py-3">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-800 flex items-center justify-center">
                        {reel.poster ? (
                          <img src={reel.poster} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Video className="w-5 h-5 text-white" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">{reel.title || '—'}</td>
                    <td className="px-4 py-3 text-slate-500">{reel.order}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          reel.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {reel.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(reel)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(reel._id)}
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
              <h2 className="text-lg font-bold text-slate-800">{editingId ? 'Edit Reel' : 'Add Reel'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Video *</label>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-16 rounded-lg bg-slate-800 overflow-hidden flex items-center justify-center border border-[var(--pa-border)]">
                    {form.poster ? (
                      <img src={form.poster} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Video className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={(e) => handleUpload(e, 'video')} />
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => videoRef.current?.click()}
                      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-[var(--pa-primary-light)] text-[var(--pa-primary)] disabled:opacity-50"
                    >
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      Upload Video
                    </button>
                    {form.video && <p className="text-[10px] text-slate-400 mt-1 max-w-[220px] truncate">{form.video}</p>}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Poster / Thumbnail (optional)</label>
                <input ref={posterRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, 'poster')} />
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => posterRef.current?.click()}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-[var(--pa-border)] rounded-lg disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" /> Upload Poster
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--pa-border)] rounded-lg text-sm"
                  placeholder="Watering tips"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Instagram Link (optional)</label>
                <input
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--pa-border)] rounded-lg text-sm"
                  placeholder="https://instagram.com/p/..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                    <span className="text-sm text-slate-600">Active (show on site)</span>
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
                  {saving ? 'Saving...' : editingId ? 'Update Reel' : 'Add Reel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}