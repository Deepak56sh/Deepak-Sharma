'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Edit2, ChevronDown, ChevronUp, 
  Loader2, Image as ImageIcon, Eye, EyeOff, Save, X
} from 'lucide-react';

const ICONS = ['Code', 'Smartphone', 'Palette', 'Cloud', 'Brain', 'TrendingUp', 'Database', 'Lock', 'Globe', 'Zap'];
const CATEGORIES = ['Development', 'Design', 'Marketing', 'Cloud', 'AI', 'Other'];

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openId, setOpenId] = useState(null);          // accordion open
  const [editMode, setEditMode] = useState(null);      // which service is editing
  const [showCreate, setShowCreate] = useState(false);

  // Form state
  const [form, setForm] = useState({
    title: '',
    description: '',
    icon: 'Code',
    color: 'from-green-600 to-emerald-500',
    category: 'Development',
    price: '',
    duration: '',
    features: '',
    tags: '',
    isActive: true,
    order: 0
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/services?limit=100&active=`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setServices(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: '', description: '', icon: 'Code',
      color: 'from-green-600 to-emerald-500', category: 'Development',
      price: '', duration: '', features: '', tags: '',
      isActive: true, order: 0
    });
    setImageFile(null);
    setPreview('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!imageFile && !preview) {
      alert('Image is required');
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key === 'features' || key === 'tags') {
          formData.append(key, form[key]); // string, backend will parse
        } else {
          formData.append(key, form[key]);
        }
      });
      if (imageFile) formData.append('image', imageFile);

      const res = await fetch(`${baseUrl}/services`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        setShowCreate(false);
        resetForm();
        fetchServices();
      } else {
        alert(data.message || 'Failed to create');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id) => {
    setSaving(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        formData.append(key, form[key]);
      });
      if (imageFile) formData.append('image', imageFile);

      const res = await fetch(`${baseUrl}/services/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        setEditMode(null);
        setOpenId(null);
        resetForm();
        fetchServices();
      } else {
        alert(data.message || 'Failed to update');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const res = await fetch(`${baseUrl}/services/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await fetch(`${baseUrl}/services/${id}/toggle`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (service) => {
    setEditMode(service._id);
    setOpenId(service._id);
    setForm({
      title: service.title,
      description: service.description,
      icon: service.icon || 'Code',
      color: service.color || 'from-green-600 to-emerald-500',
      category: service.category,
      price: service.price || '',
      duration: service.duration || '',
      features: (service.features || []).join(', '),
      tags: (service.tags || []).join(', '),
      isActive: service.isActive,
      order: service.order || 0
    });
    setPreview(service.image);
    setImageFile(null);
  };

  return (
    <div className="min-h-screen bg-[#f8faf8] p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Services</h1>
            <p className="text-gray-500 text-sm mt-1">Manage all services from here</p>
          </div>
          <button
            onClick={() => {
              setShowCreate(!showCreate);
              setEditMode(null);
              resetForm();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0f5132] hover:bg-[#0d4529] text-white rounded-xl font-medium transition"
          >
            <Plus className="w-5 h-5" />
            {showCreate ? 'Cancel' : 'Add Service'}
          </button>
        </div>

        {/* Create Form (Accordion style) */}
        {showCreate && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
            <div className="bg-[#0f5132] text-white px-6 py-4 font-semibold">
              Create New Service
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
                  <input
                    required
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0f5132]/30 focus:border-[#0f5132] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0f5132]/30 outline-none"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0f5132]/30 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Price</label>
                  <input
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    placeholder="$500 - $5000"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0f5132]/30 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration</label>
                  <input
                    value={form.duration}
                    onChange={e => setForm({ ...form, duration: e.target.value })}
                    placeholder="2-4 weeks"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0f5132]/30 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Icon</label>
                  <select
                    value={form.icon}
                    onChange={e => setForm({ ...form, icon: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0f5132]/30 outline-none"
                  >
                    {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Features (comma separated)</label>
                <input
                  value={form.features}
                  onChange={e => setForm({ ...form, features: e.target.value })}
                  placeholder="React, Next.js, Responsive"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0f5132]/30 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags (comma separated)</label>
                <input
                  value={form.tags}
                  onChange={e => setForm({ ...form, tags: e.target.value })}
                  placeholder="web, development, react"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0f5132]/30 outline-none"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Image *</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 transition">
                    <ImageIcon className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-600">Choose Image</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  {preview && (
                    <img src={preview} alt="Preview" className="w-16 h-16 object-cover rounded-lg border" />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0f5132] hover:bg-[#0d4529] text-white rounded-xl font-medium transition disabled:opacity-60"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Create Service
                </button>
                <button
                  type="button"
                  onClick={() => { setShowCreate(false); resetForm(); }}
                  className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Services List - Accordion */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#0f5132] animate-spin" />
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500">No services yet. Create your first one!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {services.map((service) => {
              const isOpen = openId === service._id;
              const isEditing = editMode === service._id;

              return (
                <div
                  key={service._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  {/* Accordion Header */}
                  <div
                    onClick={() => setOpenId(isOpen ? null : service._id)}
                    className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{service.title}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs px-2 py-0.5 bg-green-50 text-[#0f5132] rounded-full">
                            {service.category}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            service.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                          }`}>
                            {service.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleToggle(service._id); }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        title="Toggle status"
                      >
                        {service.isActive ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); startEdit(service); }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(service._id); }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                      {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </div>
                  </div>

                  {/* Accordion Body */}
                  {isOpen && (
                    <div className="border-t border-gray-100 px-5 py-5 bg-gray-50/50">
                      {isEditing ? (
                        /* Edit Form */
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Title</label>
                              <input
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#0f5132]/30"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Category</label>
                              <select
                                value={form.category}
                                onChange={e => setForm({ ...form, category: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg outline-none"
                              >
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                              rows={3}
                              value={form.description}
                              onChange={e => setForm({ ...form, description: e.target.value })}
                              className="w-full px-3 py-2 border rounded-lg outline-none resize-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div>
                              <label className="block text-sm font-medium mb-1">Price</label>
                              <input
                                value={form.price}
                                onChange={e => setForm({ ...form, price: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Duration</label>
                              <input
                                value={form.duration}
                                onChange={e => setForm({ ...form, duration: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Icon</label>
                              <select
                                value={form.icon}
                                onChange={e => setForm({ ...form, icon: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg outline-none"
                              >
                                {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Order</label>
                              <input
                                type="number"
                                value={form.order}
                                onChange={e => setForm({ ...form, order: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">Features (comma separated)</label>
                            <input
                              value={form.features}
                              onChange={e => setForm({ ...form, features: e.target.value })}
                              className="w-full px-3 py-2 border rounded-lg outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">Change Image</label>
                            <div className="flex items-center gap-3">
                              <label className="px-3 py-2 bg-white border border-dashed rounded-lg cursor-pointer text-sm">
                                Choose new image
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                              </label>
                              {preview && <img src={preview} className="w-12 h-12 object-cover rounded" />}
                            </div>
                          </div>

                          <div className="flex gap-3 pt-2">
                            <button
                              onClick={() => handleUpdate(service._id)}
                              disabled={saving}
                              className="inline-flex items-center gap-2 px-5 py-2 bg-[#0f5132] text-white rounded-lg text-sm font-medium disabled:opacity-60"
                            >
                              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                              Save Changes
                            </button>
                            <button
                              onClick={() => { setEditMode(null); resetForm(); }}
                              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* View Mode */
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:col-span-1">
                            <img
                              src={service.image}
                              alt={service.title}
                              className="w-full h-40 object-cover rounded-xl"
                            />
                          </div>
                          <div className="md:col-span-2 space-y-3">
                            <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                            
                            {service.features?.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-gray-500 mb-1">FEATURES</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {service.features.map((f, i) => (
                                    <span key={i} className="text-xs px-2.5 py-1 bg-green-50 text-[#0f5132] rounded-full">
                                      {f}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="flex flex-wrap gap-4 text-sm">
                              {service.price && (
                                <div>
                                  <span className="text-gray-400">Price:</span>{' '}
                                  <span className="font-semibold text-[#0f5132]">{service.price}</span>
                                </div>
                              )}
                              {service.duration && (
                                <div>
                                  <span className="text-gray-400">Duration:</span>{' '}
                                  <span className="font-medium">{service.duration}</span>
                                </div>
                              )}
                              <div>
                                <span className="text-gray-400">Order:</span>{' '}
                                <span className="font-medium">{service.order}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}