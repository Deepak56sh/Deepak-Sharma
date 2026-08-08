'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Plus, Trash2, Edit2, ChevronDown, ChevronUp,
  Loader2, Image as ImageIcon, Eye, EyeOff, Save
} from 'lucide-react';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const CATEGORIES = ['Crop Farming', 'Organic Farming', 'Equipment', 'Consulting', 'Irrigation', 'Other'];

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
  }
};

const quillFormats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'color', 'background', 'list', 'bullet', 'align',
  'indent', 'link', 'image'
];

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openId, setOpenId] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Crop Farming',
    price: '',
    duration: '',
    isActive: true
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
    setForm({
      title: '', description: '', category: 'Crop Farming',
      price: '', duration: '', isActive: true
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
    if (isDescriptionEmpty()) {
      alert('Description is required');
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));
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
      await fetch(`${baseUrl}/services/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
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

  const startEdit = (service) => {
    setEditMode(service._id);
    setOpenId(service._id);
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
  };

  return (
    <div className="min-h-screen bg-[#F7F4EC] p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#23281D]">Services</h1>
            <p className="text-[#5B6152] text-sm mt-1">Manage all farming services</p>
          </div>
          <button
            onClick={() => {
              setShowCreate(!showCreate);
              setEditMode(null);
              resetForm();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3F6B44] hover:bg-[#2C4E30] text-white rounded-xl font-medium transition"
          >
            <Plus className="w-5 h-5" />
            {showCreate ? 'Cancel' : 'Add Service'}
          </button>
        </div>

        {/* ==================== CREATE FORM ==================== */}
        {showCreate && (
          <div className="bg-white rounded-2xl border border-[#E4DFC9] shadow-sm mb-6 overflow-hidden">
            <div className="bg-[#3F6B44] text-white px-6 py-4 font-semibold">
              Create New Service
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-[#3E4436] mb-1.5">Title *</label>
                  <input
                    required
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-2.5 border border-[#E4DFC9] rounded-xl focus:ring-2 focus:ring-[#3F6B44]/30 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3E4436] mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-[#E4DFC9] rounded-xl outline-none"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Rich Text Editor */}
              <div>
                <label className="block text-sm font-medium text-[#3E4436] mb-1.5">
                  Description * (WordPress style editor)
                </label>
                <div className="bg-white rounded-xl border border-[#E4DFC9] overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={form.description}
                    onChange={(value) => setForm({ ...form, description: value })}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Write detailed content about this service..."
                    className="min-h-[220px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-[#3E4436] mb-1.5">Price</label>
                  <input
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    placeholder="₹500 - ₹5000"
                    className="w-full px-4 py-2.5 border border-[#E4DFC9] rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3E4436] mb-1.5">Duration</label>
                  <input
                    value={form.duration}
                    onChange={e => setForm({ ...form, duration: e.target.value })}
                    placeholder="2-4 weeks"
                    className="w-full px-4 py-2.5 border border-[#E4DFC9] rounded-xl outline-none"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-[#3E4436] mb-1.5">Cover Image *</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2.5 bg-[#F7F4EC] border border-dashed border-[#D8D2B8] rounded-xl cursor-pointer hover:bg-[#F0EBD8] transition">
                    <ImageIcon className="w-5 h-5 text-[#5B6152]" />
                    <span className="text-sm text-[#3E4436]">
                      {imageFile ? imageFile.name : 'Choose Image'}
                    </span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  {preview && (
                    <img src={preview} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-[#E4DFC9]" />
                  )}
                </div>
                <p className="text-xs text-[#8A8F7C] mt-1">Image Cloudinary pe upload hogi</p>
              </div>

              {/* Active toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={e => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 accent-[#3F6B44]"
                />
                <label htmlFor="isActive" className="text-sm text-[#3E4436]">
                  Active (visible on website)
                </label>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#3F6B44] hover:bg-[#2C4E30] text-white rounded-xl font-medium transition disabled:opacity-60"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Create Service
                </button>
                <button
                  type="button"
                  onClick={() => { setShowCreate(false); resetForm(); }}
                  className="px-5 py-2.5 text-[#5B6152] hover:bg-[#F0EBD8] rounded-xl transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==================== SERVICES LIST ==================== */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#3F6B44] animate-spin" />
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#E4DFC9]">
            <p className="text-[#5B6152]">No services yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {services.map((service) => {
              const isOpen = openId === service._id;
              const isEditing = editMode === service._id;

              return (
                <div key={service._id} className="bg-white rounded-2xl border border-[#E4DFC9] shadow-sm overflow-hidden">
                  {/* Header */}
                  <div
                    onClick={() => setOpenId(isOpen ? null : service._id)}
                    className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#F7F4EC] transition"
                  >
                    <div className="flex items-center gap-4">
                      <img src={service.image} alt={service.title} className="w-12 h-12 object-cover rounded-lg" />
                      <div>
                        <h3 className="font-semibold text-[#23281D]">{service.title}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs px-2 py-0.5 bg-[#3F6B44]/10 text-[#2C4E30] rounded-full">{service.category}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${service.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                            {service.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={(e) => { e.stopPropagation(); handleToggle(service._id); }} className="p-2 hover:bg-[#F0EBD8] rounded-lg">
                        {service.isActive ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); startEdit(service); }} className="p-2 hover:bg-[#F0EBD8] rounded-lg">
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(service._id); }} className="p-2 hover:bg-[#F0EBD8] rounded-lg">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                      {isOpen ? <ChevronUp className="w-5 h-5 text-[#8A8F7C]" /> : <ChevronDown className="w-5 h-5 text-[#8A8F7C]" />}
                    </div>
                  </div>

                  {/* Body */}
                  {isOpen && (
                    <div className="border-t border-[#E4DFC9] px-5 py-5 bg-[#FCFAF3]">
                      {isEditing ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-[#3E4436] mb-1">Title</label>
                              <input
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                className="w-full px-3 py-2 border border-[#E4DFC9] rounded-lg outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#3E4436] mb-1">Category</label>
                              <select
                                value={form.category}
                                onChange={e => setForm({ ...form, category: e.target.value })}
                                className="w-full px-3 py-2 border border-[#E4DFC9] rounded-lg outline-none"
                              >
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#3E4436] mb-1">Description</label>
                            <div className="bg-white rounded-lg border border-[#E4DFC9] overflow-hidden">
                              <ReactQuill
                                theme="snow"
                                value={form.description}
                                onChange={(value) => setForm({ ...form, description: value })}
                                modules={quillModules}
                                formats={quillFormats}
                                className="min-h-[180px]"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-[#3E4436] mb-1">Price</label>
                              <input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2 border border-[#E4DFC9] rounded-lg outline-none" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#3E4436] mb-1">Duration</label>
                              <input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} className="w-full px-3 py-2 border border-[#E4DFC9] rounded-lg outline-none" />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#3E4436] mb-1">Change Image</label>
                            <div className="flex items-center gap-3">
                              <label className="px-3 py-2 bg-white border border-dashed border-[#D8D2B8] rounded-lg cursor-pointer text-sm">
                                Choose new image
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                              </label>
                              {preview && <img src={preview} className="w-12 h-12 object-cover rounded" />}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`isActive-${service._id}`}
                              checked={form.isActive}
                              onChange={e => setForm({ ...form, isActive: e.target.checked })}
                              className="w-4 h-4 accent-[#3F6B44]"
                            />
                            <label htmlFor={`isActive-${service._id}`} className="text-sm text-[#3E4436]">
                              Active (visible on website)
                            </label>
                          </div>

                          <div className="flex gap-3 pt-2">
                            <button
                              onClick={() => handleUpdate(service._id)}
                              disabled={saving}
                              className="inline-flex items-center gap-2 px-5 py-2 bg-[#3F6B44] text-white rounded-lg text-sm font-medium disabled:opacity-60"
                            >
                              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                              Save Changes
                            </button>
                            <button onClick={() => { setEditMode(null); resetForm(); }} className="px-4 py-2 text-[#5B6152] hover:bg-[#F0EBD8] rounded-lg text-sm">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* View Mode */
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <img src={service.image} alt={service.title} className="w-full h-40 object-cover rounded-xl" />
                          </div>
                          <div className="md:col-span-2">
                            <div
                              className="prose prose-sm max-w-none text-[#3E4436]"
                              dangerouslySetInnerHTML={{ __html: service.description }}
                            />
                            <div className="mt-4 flex gap-4 text-sm">
                              {service.price && <span><span className="text-[#8A8F7C]">Price:</span> <strong className="text-[#3F6B44]">{service.price}</strong></span>}
                              {service.duration && <span><span className="text-[#8A8F7C]">Duration:</span> {service.duration}</span>}
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