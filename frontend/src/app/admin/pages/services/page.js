'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  Plus, Trash2, Edit2, Loader2, Image as ImageIcon, Eye, EyeOff, Save,
  X, Sparkles, Layers, CheckCircle2, XCircle, Tag, Clock, Search
} from 'lucide-react';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const CATEGORIES = ['Crop Farming', 'Organic Farming', 'Equipment', 'Consulting', 'Irrigation', 'Other'];

// Each category gets its own accent color, used as a top border strip on
// cards and on the category chip — makes the grid scannable at a glance.
const CATEGORY_COLORS = {
  'Crop Farming':     { bar: '#3F6B44', chip: '#E7F0E6', text: '#2C4E30' },
  'Organic Farming':  { bar: '#7C9A4C', chip: '#EEF3E2', text: '#516B2E' },
  'Equipment':        { bar: '#C68B2E', chip: '#FBF0DE', text: '#8A611E' },
  'Consulting':       { bar: '#4A6FA5', chip: '#E7EDF7', text: '#33507A' },
  'Irrigation':       { bar: '#2E9CB6', chip: '#E2F4F8', text: '#1F6F80' },
  'Other':            { bar: '#8A8F7C', chip: '#EFEFE9', text: '#5B6152' },
};
const getCategoryColor = (cat) => CATEGORY_COLORS[cat] || CATEGORY_COLORS.Other;

const quillModules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      [{ indent: '-1' }, { indent: '+1' }],
      ['link', 'image'],
      ['clean']
    ]
  },
  clipboard: {
    matchVisual: false,
  }
};

const quillFormats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'color', 'background', 'list', 'bullet', 'align',
  'indent', 'link', 'image'
];

const emptyForm = {
  title: '',
  description: '',
  category: 'Crop Farming',
  price: '',
  duration: '',
  isActive: true
};

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  // Modal state: 'create' | 'edit' | null
  const [modalMode, setModalMode] = useState(null);
  const [activeId, setActiveId] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [token, setToken] = useState(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

  // Read localStorage only on the client, after mount, to avoid
  // "localStorage is not defined" during server-side build/render.
  useEffect(() => {
    setToken(localStorage.getItem('adminToken'));
  }, []);

  useEffect(() => {
    if (token !== null) {
      fetchServices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/services?limit=100&active=all`, {
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
    setForm(emptyForm);
    setImageFile(null);
    setPreview('');
  };

  const openCreate = () => {
    resetForm();
    setActiveId(null);
    setModalMode('create');
  };

  const openEdit = (service) => {
    setForm({
      title: service.title,
      description: service.description || '',
      category: service.category,
      price: service.price || '',
      duration: service.duration || '',
      isActive: service.isActive
    });
    setPreview(service.image);
    setImageFile(null);
    setActiveId(service._id);
    setModalMode('edit');
  };

  const closeModal = () => {
    setModalMode(null);
    setActiveId(null);
    resetForm();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const isDescriptionEmpty = () =>
    !form.description || form.description === '<p><br></p>';

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert('Image is required');
      return;
    }
    if (isDescriptionEmpty()) {
      alert('Description is required');
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));
      formData.append('image', imageFile);

      const res = await fetch(`${baseUrl}/services`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        closeModal();
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (isDescriptionEmpty()) {
      alert('Description is required');
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));
      if (imageFile) formData.append('image', imageFile);

      const res = await fetch(`${baseUrl}/services/${activeId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        closeModal();
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
      await fetch(`${baseUrl}/services/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (activeId === id) closeModal();
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (id) => {
    try {
      await fetch(`${baseUrl}/services/${id}/toggle`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  const stats = useMemo(() => ({
    total: services.length,
    active: services.filter(s => s.isActive).length,
    inactive: services.filter(s => !s.isActive).length,
    categories: new Set(services.map(s => s.category)).size,
  }), [services]);

  const filteredServices = useMemo(() => {
    if (!search.trim()) return services;
    const q = search.toLowerCase();
    return services.filter(s =>
      s.title.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
    );
  }, [services, search]);

  const isModalOpen = modalMode !== null;

  return (
    <div className="min-h-screen bg-[#F7F4EC]">
      {/*
        Quill dropdown fix: color/background/align popups must never
        be clipped by an overflow-hidden ancestor.
      */}
      <style jsx global>{`
        /* Fix for Quill dropdowns in modal */
        .ql-snow .ql-picker-options {
          z-index: 99999 !important;
          position: fixed !important;
          max-height: 200px !important;
          overflow-y: auto !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
          border-radius: 8px !important;
          border: 1px solid #E4DFC9 !important;
          background: white !important;
        }
        
        .ql-snow .ql-tooltip {
          z-index: 99999 !important;
        }
        
        .ql-color-picker .ql-picker-options,
        .ql-background-picker .ql-picker-options {
          width: 200px !important;
          padding: 8px !important;
        }
        
        .ql-color-picker .ql-picker-options .ql-picker-item,
        .ql-background-picker .ql-picker-options .ql-picker-item {
          width: 24px !important;
          height: 24px !important;
          margin: 2px !important;
          border-radius: 4px !important;
          float: left !important;
          border: 1px solid #E4DFC9 !important;
        }
        
        .ql-color-picker .ql-picker-options .ql-picker-item:hover,
        .ql-background-picker .ql-picker-options .ql-picker-item:hover {
          transform: scale(1.15);
          transition: transform 0.15s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        
        .ql-color-picker .ql-picker-label,
        .ql-background-picker .ql-picker-label {
          display: flex !important;
          align-items: center !important;
          padding: 0 4px !important;
        }
        
        .ql-color-picker .ql-picker-label svg,
        .ql-background-picker .ql-picker-label svg {
          width: 18px !important;
          height: 18px !important;
        }
        
        .ql-toolbar.ql-snow {
          border-top-left-radius: 0.75rem;
          border-top-right-radius: 0.75rem;
          border-color: #E4DFC9 !important;
          background: #FCFAF3;
          position: relative;
          z-index: 10;
        }
        
        .ql-container.ql-snow {
          border-bottom-left-radius: 0.75rem;
          border-bottom-right-radius: 0.75rem;
          border-color: #E4DFC9 !important;
          font-family: inherit;
          font-size: 0.95rem;
          min-height: 220px;
        }
        
        .ql-editor { 
          min-height: 220px;
          font-size: 0.95rem;
        }
        
        .ql-editor p {
          margin-bottom: 0.5rem;
        }
        
        .ql-editor strong {
          font-weight: 700;
        }
        
        .ql-editor em {
          font-style: italic;
        }
        
        .ql-editor ul, .ql-editor ol {
          padding-left: 1.5rem;
          margin-bottom: 0.5rem;
        }
        
        .ql-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 8px 0;
        }
        
        .ql-editor blockquote {
          border-left: 4px solid #3F6B44;
          padding-left: 16px;
          margin: 8px 0;
          color: #5B6152;
        }
        
        .ql-editor a {
          color: #3F6B44;
          text-decoration: underline;
        }
        
        .ql-editor h1, .ql-editor h2, .ql-editor h3 {
          font-weight: 700;
          margin: 12px 0 8px 0;
        }
        
        .ql-editor h1 { font-size: 2rem; }
        .ql-editor h2 { font-size: 1.5rem; }
        .ql-editor h3 { font-size: 1.25rem; }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        /* Scrollbar styling */
        .modal-scroll::-webkit-scrollbar {
          width: 6px;
        }
        
        .modal-scroll::-webkit-scrollbar-track {
          background: #F7F4EC;
          border-radius: 10px;
        }
        
        .modal-scroll::-webkit-scrollbar-thumb {
          background: #D8D2B8;
          border-radius: 10px;
        }
        
        .modal-scroll::-webkit-scrollbar-thumb:hover {
          background: #B8B29A;
        }
      `}</style>

      <div className="max-w-6xl mx-auto p-4 md:p-8">

        {/* ===================== HEADER ===================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#3F6B44] flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#23281D] leading-tight">Services</h1>
              <p className="text-[#5B6152] text-sm">Manage all farming services</p>
            </div>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#23281D] hover:bg-[#161911] text-white rounded-xl font-medium shadow-sm hover:shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            New Service
          </button>
        </div>

        {/* ===================== STATS STRIP ===================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <StatCard label="Total Services" value={stats.total} icon={Layers} color="#3F6B44" />
          <StatCard label="Active" value={stats.active} icon={CheckCircle2} color="#2C4E30" />
          <StatCard label="Inactive" value={stats.inactive} icon={XCircle} color="#B4552F" />
          <StatCard label="Categories" value={stats.categories} icon={Tag} color="#C68B2E" />
        </div>

        {/* ===================== SEARCH ===================== */}
        <div className="relative mb-6 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8F7C]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E4DFC9] rounded-xl text-sm text-[#23281D] placeholder-[#8A8F7C] focus:outline-none focus:ring-2 focus:ring-[#3F6B44]/25 focus:border-[#3F6B44] transition"
          />
        </div>

        {/* ===================== GRID LIST ===================== */}
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 text-[#3F6B44] animate-spin" />
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-[#D8D2B8]">
            <Layers className="w-10 h-10 text-[#D8D2B8] mx-auto mb-3" />
            <p className="text-[#5B6152] font-medium">
              {search ? 'No services match your search' : 'No services yet'}
            </p>
            {!search && (
              <button
                onClick={openCreate}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#3F6B44] hover:underline"
              >
                <Plus className="w-4 h-4" /> Create your first service
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredServices.map((service) => {
              const c = getCategoryColor(service.category);
              return (
                <div
                  key={service._id}
                  className="group relative bg-white rounded-2xl border border-[#E4DFC9] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
                  style={{ borderTop: `3px solid ${c.bar}` }}
                >
                  {/* Image */}
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent" />

                    {/* Status pill */}
                    <span
                      className={`absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-sm ${
                        service.isActive ? 'bg-white/90 text-green-700' : 'bg-black/50 text-white/80'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${service.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                      {service.isActive ? 'Active' : 'Hidden'}
                    </span>

                    {/* Floating quick actions — appear on hover */}
                    <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all">
                      <IconBtn onClick={() => handleToggle(service._id)} title={service.isActive ? 'Hide' : 'Show'}>
                        {service.isActive ? <Eye className="w-3.5 h-3.5 text-green-600" /> : <EyeOff className="w-3.5 h-3.5 text-[#5B6152]" />}
                      </IconBtn>
                      <IconBtn onClick={() => openEdit(service)} title="Edit">
                        <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                      </IconBtn>
                      <IconBtn onClick={() => handleDelete(service._id)} title="Delete">
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </IconBtn>
                    </div>

                    <span
                      className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                      style={{ background: c.chip, color: c.text }}
                    >
                      {service.category}
                    </span>
                  </div>

                  {/* Content */}
                  <button
                    onClick={() => openEdit(service)}
                    className="p-4 text-left flex-1 flex flex-col"
                  >
                    <h3 className="font-semibold text-[#23281D] line-clamp-1 mb-1.5">{service.title}</h3>
                    <div
                      className="text-xs text-[#8A8F7C] line-clamp-2 mb-3 flex-1"
                      dangerouslySetInnerHTML={{ __html: service.description }}
                    />
                    <div className="flex items-center gap-3 text-xs text-[#5B6152] pt-2 border-t border-[#F0EBD8]">
                      {service.price && (
                        <span className="inline-flex items-center gap-1 font-semibold text-[#3F6B44]">
                          <Tag className="w-3 h-3" /> {service.price}
                        </span>
                      )}
                      {service.duration && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {service.duration}
                        </span>
                      )}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ===================== MODAL (Create / Edit) ===================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#23281D]/60 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal */}
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#FCFAF3] rounded-2xl shadow-2xl flex flex-col animate-[fadeIn_0.2s_ease-out] overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E4DFC9] bg-white flex-shrink-0">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#3F6B44]">
                  {modalMode === 'create' ? 'New Service' : 'Edit Service'}
                </p>
                <h2 className="text-lg font-bold text-[#23281D]">
                  {modalMode === 'create' ? 'Create a Service' : form.title || 'Service Details'}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F0EBD8] transition"
              >
                <X className="w-5 h-5 text-[#5B6152]" />
              </button>
            </div>

            {/* Modal body (scrollable) */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 modal-scroll">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#3E4436] mb-1.5">Title *</label>
                  <input
                    required
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-2.5 border border-[#E4DFC9] rounded-xl outline-none focus:ring-2 focus:ring-[#3F6B44]/25 focus:border-[#3F6B44] transition bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3E4436] mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-[#E4DFC9] rounded-xl outline-none focus:ring-2 focus:ring-[#3F6B44]/25 focus:border-[#3F6B44] transition bg-white"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Rich Text Editor - with z-index fix */}
              <div className="relative" style={{ zIndex: 50 }}>
                <label className="block text-sm font-medium text-[#3E4436] mb-1.5">
                  Description *
                </label>
                <div className="relative" style={{ zIndex: 50 }}>
                  <ReactQuill
                    theme="snow"
                    value={form.description}
                    onChange={(value) => setForm({ ...form, description: value })}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Write detailed content about this service..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#3E4436] mb-1.5">Price</label>
                  <input
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    placeholder="₹500 - ₹5000"
                    className="w-full px-4 py-2.5 border border-[#E4DFC9] rounded-xl outline-none focus:ring-2 focus:ring-[#3F6B44]/25 focus:border-[#3F6B44] transition bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3E4436] mb-1.5">Duration</label>
                  <input
                    value={form.duration}
                    onChange={e => setForm({ ...form, duration: e.target.value })}
                    placeholder="2-4 weeks"
                    className="w-full px-4 py-2.5 border border-[#E4DFC9] rounded-xl outline-none focus:ring-2 focus:ring-[#3F6B44]/25 focus:border-[#3F6B44] transition bg-white"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-[#3E4436] mb-1.5">
                  Cover Image {modalMode === 'create' && '*'}
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-xl border-2 border-dashed border-[#D8D2B8] bg-white flex items-center justify-center overflow-hidden">
                    {preview ? (
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-[#D8D2B8]" />
                    )}
                  </div>
                  <label className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-white border border-dashed border-[#D8D2B8] rounded-xl cursor-pointer hover:bg-[#F7F4EC] transition text-sm text-[#3E4436]">
                    <ImageIcon className="w-4 h-4 text-[#5B6152]" />
                    {imageFile ? imageFile.name : modalMode === 'edit' ? 'Change image' : 'Choose image'}
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
                <p className="text-xs text-[#8A8F7C] mt-1.5">Image Cloudinary pe upload hogi</p>
              </div>

              {/* Active toggle */}
              <label className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-[#E4DFC9] cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={e => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 accent-[#3F6B44]"
                />
                <span className="text-sm text-[#3E4436]">
                  Active — visible on the public website
                </span>
              </label>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-[#E4DFC9] bg-white flex items-center gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={modalMode === 'create' ? handleCreate : handleUpdate}
                disabled={saving}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#3F6B44] hover:bg-[#2C4E30] text-white rounded-xl font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {modalMode === 'create' ? 'Create Service' : 'Save Changes'}
              </button>
              {modalMode === 'edit' && (
                <button
                  type="button"
                  onClick={() => handleDelete(activeId)}
                  className="px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition"
                  title="Delete service"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-3 text-[#5B6152] hover:bg-[#F0EBD8] rounded-xl transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================= */
/* SMALL PRESENTATIONAL COMPONENTS   */
/* ================================= */

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E4DFC9] p-4 flex items-center gap-3 shadow-sm">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}1A` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-xl font-bold text-[#23281D] leading-none">{value}</p>
        <p className="text-xs text-[#8A8F7C] mt-1 truncate">{label}</p>
      </div>
    </div>
  );
}

function IconBtn({ children, onClick, title }) {
  return (
    <button
      type="button"
      title={title}
      onClick={(e) => { e.stopPropagation(); e.preventDefault(); onClick(); }}
      className="w-8 h-8 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform"
    >
      {children}
    </button>
  );
}