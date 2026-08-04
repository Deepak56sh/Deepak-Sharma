'use client';
import { useState, useEffect, useRef } from 'react';
import {
  Plus, Pencil, Trash2, Save, X, Upload, Loader2,
  Image as ImageIcon, Video, GripVertical
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

const emptySlide = {
  mediaType: 'image',
  media: '',
  poster: '',
  title: '',
  subtitle: '',
  description: '',
  primaryBtn: 'Shop Plants',
  primaryBtnLink: '/shop',
  secondaryBtn: 'Explore Collections',
  secondaryBtnLink: '/shop',
  order: 0,
  isActive: true,
};

export default function HeroBannerAdminPage() {
  const [badge, setBadge] = useState('');
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState(emptySlide);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileRef = useRef(null);
  const posterRef = useRef(null);

  const getToken = () =>
    typeof window !== 'undefined'
      ? localStorage.getItem('adminToken') || localStorage.getItem('token')
      : '';

  useEffect(() => {
    fetchHero();
  }, []);

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const fetchHero = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/hero`);
      const data = await res.json();
      if (data.success && data.data) {
        setBadge(data.data.badge || '');
        setSlides(data.data.slides || []);
      }
    } catch {
      showMsg('error', 'Failed to load hero data');
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setForm({ ...emptySlide, order: slides.length });
    setEditIndex(null);
    setShowModal(true);
  };

  const openEdit = (slide, index) => {
    setForm({ ...emptySlide, ...slide });
    setEditIndex(index);
    setShowModal(true);
  };

  const handleUpload = async (e, field = 'media') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (field === 'media' && !isVideo && !isImage) {
      showMsg('error', 'Only image or video allowed');
      return;
    }
    if (field === 'poster' && !isImage) {
      showMsg('error', 'Poster must be an image');
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('media', file);

      const res = await fetch(`${API_URL}/hero/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: fd,
      });

      const result = await res.json();
      if (result.success && result.data?.url) {
        if (field === 'media') {
          setForm((prev) => ({
            ...prev,
            media: result.data.url,
            mediaType: result.data.mediaType || (isVideo ? 'video' : 'image'),
          }));
        } else {
          setForm((prev) => ({ ...prev, poster: result.data.url }));
        }
        showMsg('success', 'Uploaded to Cloudinary');
      } else {
        showMsg('error', result.message || 'Upload failed');
      }
    } catch {
      showMsg('error', 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
      if (posterRef.current) posterRef.current.value = '';
    }
  };

  const saveSlideToList = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showMsg('error', 'Title required');
      return;
    }
    if (!form.media) {
      showMsg('error', 'Please upload media (image or video)');
      return;
    }

    const next = [...slides];
    if (editIndex !== null) {
      next[editIndex] = { ...form };
    } else {
      next.push({ ...form });
    }
    setSlides(next);
    setShowModal(false);
    setForm(emptySlide);
    setEditIndex(null);
  };

  const removeSlide = (index) => {
    if (!confirm('Remove this slide?')) return;
    setSlides((prev) => prev.filter((_, i) => i !== index));
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/hero`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ badge, slides }),
      });
      const data = await res.json();
      if (data.success) {
        showMsg('success', 'Hero banner saved');
        fetchHero();
      } else {
        showMsg('error', data.message || 'Save failed');
      }
    } catch {
      showMsg('error', 'Server error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--pa-primary)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Hero Banner</h1>
          <p className="text-slate-500 text-sm">Manage home page slider — image or video slides</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white font-medium"
            style={{ backgroundColor: 'var(--pa-primary)' }}
          >
            <Plus className="w-4 h-4" /> Add Slide
          </button>
          <button
            onClick={saveAll}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 text-white font-medium disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save All
          </button>
        </div>
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

      {/* Badge */}
      <div className="bg-white rounded-xl border border-[var(--pa-border)] p-5">
        <label className="block text-sm font-medium text-slate-700 mb-2">Badge text (top of hero)</label>
        <input
          value={badge}
          onChange={(e) => setBadge(e.target.value)}
          className="w-full max-w-lg px-4 py-2.5 border border-[var(--pa-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--pa-primary)]"
          placeholder="Free Shipping on orders above ₹999"
        />
      </div>

      {/* Slides list */}
      <div className="bg-white rounded-xl border border-[var(--pa-border)] overflow-hidden">
        {slides.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <p className="mb-3">No slides yet</p>
            <button onClick={openAdd} className="text-[var(--pa-primary)] font-semibold hover:underline">
              Add first slide
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-[var(--pa-border)]">
                <th className="px-4 py-3 font-medium w-10">#</th>
                <th className="px-4 py-3 font-medium">Media</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {slides
                .slice()
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((slide, i) => (
                  <tr key={i} className="border-b border-[var(--pa-border)] last:border-0">
                    <td className="px-4 py-3 text-slate-400">
                      <div className="flex items-center gap-1">
                        <GripVertical className="w-4 h-4" />
                        {slide.order ?? i}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-16 h-10 rounded-lg overflow-hidden bg-slate-100">
                        {slide.mediaType === 'video' ? (
                          <div className="w-full h-full flex items-center justify-center bg-slate-800">
                            <Video className="w-5 h-5 text-white" />
                          </div>
                        ) : slide.media ? (
                          <img src={slide.media} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 text-slate-400" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {slide.title}
                      <span className="block text-xs text-slate-400 font-normal">{slide.subtitle}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          slide.mediaType === 'video'
                            ? 'bg-purple-50 text-purple-700'
                            : 'bg-green-50 text-green-700'
                        }`}
                      >
                        {slide.mediaType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(slide, i)}
                          className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeSlide(i)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-[var(--pa-border)]">
            <div className="flex items-center justify-between p-5 border-b border-[var(--pa-border)]">
              <h2 className="text-lg font-bold text-slate-800">
                {editIndex !== null ? 'Edit Slide' : 'Add Slide'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={saveSlideToList} className="p-5 space-y-4">
              {/* Media type */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Media Type</label>
                <select
                  value={form.mediaType}
                  onChange={(e) => setForm({ ...form, mediaType: e.target.value })}
                  className="w-full px-3 py-2.5 border border-[var(--pa-border)] rounded-lg text-sm"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>

              {/* Upload media */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">
                  {form.mediaType === 'video' ? 'Video' : 'Image'} *
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-16 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center border border-[var(--pa-border)]">
                    {form.media ? (
                      form.mediaType === 'video' ? (
                        <Video className="w-6 h-6 text-slate-500" />
                      ) : (
                        <img src={form.media} alt="" className="w-full h-full object-cover" />
                      )
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-300" />
                    )}
                  </div>
                  <div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept={form.mediaType === 'video' ? 'video/*' : 'image/*'}
                      className="hidden"
                      onChange={(e) => handleUpload(e, 'media')}
                    />
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => fileRef.current?.click()}
                      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-[var(--pa-primary-light)] text-[var(--pa-primary)]"
                    >
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      Upload
                    </button>
                    {form.media && (
                      <p className="text-[10px] text-slate-400 mt-1 max-w-[200px] truncate">{form.media}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Poster (video only) */}
              {form.mediaType === 'video' && (
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">Poster Image</label>
                  <input
                    ref={posterRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleUpload(e, 'poster')}
                  />
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => posterRef.current?.click()}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-[var(--pa-border)] rounded-lg"
                  >
                    <Upload className="w-4 h-4" /> Upload Poster
                  </button>
                  {form.poster && (
                    <img src={form.poster} alt="" className="mt-2 h-12 rounded object-cover" />
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Title</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-[var(--pa-border)] rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Subtitle</label>
                  <input
                    value={form.subtitle}
                    onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--pa-border)] rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-[var(--pa-border)] rounded-lg text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Primary Btn</label>
                  <input
                    value={form.primaryBtn}
                    onChange={(e) => setForm({ ...form, primaryBtn: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--pa-border)] rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Primary Link</label>
                  <input
                    value={form.primaryBtnLink}
                    onChange={(e) => setForm({ ...form, primaryBtnLink: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--pa-border)] rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Secondary Btn</label>
                  <input
                    value={form.secondaryBtn}
                    onChange={(e) => setForm({ ...form, secondaryBtn: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--pa-border)] rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Secondary Link</label>
                  <input
                    value={form.secondaryBtnLink}
                    onChange={(e) => setForm({ ...form, secondaryBtnLink: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--pa-border)] rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Order</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                  className="w-24 px-3 py-2 border border-[var(--pa-border)] rounded-lg text-sm"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-white rounded-lg text-sm font-medium"
                  style={{ backgroundColor: 'var(--pa-primary)' }}
                >
                  {editIndex !== null ? 'Update Slide' : 'Add to List'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}