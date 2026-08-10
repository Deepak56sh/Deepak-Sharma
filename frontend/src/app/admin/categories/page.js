'use client';
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Save, X, Eye, EyeOff, Upload, Image } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

const emptyForm = {
  name: '',
  description: '',
  order: 0,
  isActive: true,
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const getToken = () =>
    typeof window !== 'undefined'
      ? localStorage.getItem('adminToken') || localStorage.getItem('token') || ''
      : '';

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/categories/all`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (data.success) setCategories(data.data || []);
      else showMsg('error', data.message || 'Failed to load');
    } catch {
      showMsg('error', 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const openAdd = () => {
    setForm({ ...emptyForm, order: categories.length });
    setEditingId(null);
    setImageFile(null);
    setImagePreview('');
    setShowForm(true);
  };

  const openEdit = (item) => {
    setForm({
      name: item.name || '',
      description: item.description || '',
      order: item.order || 0,
      isActive: item.isActive !== false,
    });
    setEditingId(item._id);
    setImageFile(null);
    setImagePreview(item.image || '');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview('');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { showMsg('error', 'Name is required'); return; }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('order', form.order);
      formData.append('isActive', form.isActive);
      if (imageFile) formData.append('image', imageFile);

      const url = editingId ? `${API_URL}/categories/${editingId}` : `${API_URL}/categories`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        showMsg('success', data.message || 'Saved successfully');
        closeForm();
        fetchCategories();
      } else {
        showMsg('error', data.message || 'Failed to save');
      }
    } catch {
      showMsg('error', 'Server error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (data.success) { showMsg('success', 'Deleted successfully'); fetchCategories(); }
      else showMsg('error', data.message || 'Failed to delete');
    } catch {
      showMsg('error', 'Server error');
    }
  };

  const toggleActive = async (item) => {
    try {
      const formData = new FormData();
      formData.append('isActive', !item.isActive);
      const res = await fetch(`${API_URL}/categories/${item._id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData
      });
      const data = await res.json();
      if (data.success) fetchCategories();
      else showMsg('error', 'Failed to update');
    } catch {
      showMsg('error', 'Server error');
    }
  };

  return (
    <div className="plant-admin p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1f2937]">Categories</h1>
          <p className="text-sm text-[#6b7280] mt-1">Manage plant categories shown on homepage</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2f9e44] hover:bg-[#237a35] text-white font-semibold rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${
          message.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Grid */}
      <div className="bg-white rounded-2xl border border-[#e8ece9] overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2f9e44]" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 text-[#6b7280]">
            <p className="mb-4">No categories yet</p>
            <button onClick={openAdd} className="text-[#2f9e44] font-semibold hover:underline">
              Add your first category
            </button>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...categories].sort((a, b) => a.order - b.order).map((item) => (
              <div
                key={item._id}
                className={`relative rounded-2xl border overflow-hidden group transition-all ${
                  item.isActive ? 'border-[#e8ece9]' : 'border-dashed border-[#d1d5db] opacity-60'
                }`}
              >
                {/* Image */}
                <div className="aspect-square bg-[#f6f8f7] overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="w-8 h-8 text-[#d1d5db]" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="font-semibold text-[#1f2937] text-sm truncate">{item.name}</p>
                  {item.description && (
                    <p className="text-xs text-[#6b7280] mt-0.5 line-clamp-1">{item.description}</p>
                  )}
                  <p className="text-xs text-[#9ca3af] mt-1">Order: {item.order}</p>
                </div>

                {/* Actions */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => toggleActive(item)}
                    className={`p-1.5 rounded-lg text-xs font-medium ${
                      item.isActive
                        ? 'bg-green-50 text-green-600'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {item.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => openEdit(item)}
                    className="p-1.5 rounded-lg bg-white text-[#6b7280] hover:text-[#2f9e44] shadow-sm"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-1.5 rounded-lg bg-white text-[#6b7280] hover:text-red-500 shadow-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8ece9]">
              <h2 className="font-bold text-lg text-[#1f2937]">
                {editingId ? 'Edit Category' : 'Add Category'}
              </h2>
              <button onClick={closeForm} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-[#1f2937] mb-1.5">Category Image</label>
                <label className="cursor-pointer block">
                  <div className={`border-2 border-dashed rounded-xl overflow-hidden transition-colors ${
                    imagePreview ? 'border-[#2f9e44]' : 'border-[#e8ece9] hover:border-[#2f9e44]'
                  }`}>
                    {imagePreview ? (
                      <div className="relative">
                        <img src={imagePreview} alt="Preview" className="w-full h-36 object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <p className="text-white text-sm font-medium">Click to change</p>
                        </div>
                      </div>
                    ) : (
                      <div className="h-36 flex flex-col items-center justify-center gap-2 text-[#6b7280]">
                        <Upload className="w-6 h-6" />
                        <p className="text-sm">Upload image</p>
                      </div>
                    )}
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-[#1f2937] mb-1.5">Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Indoor Plants"
                  required
                  className="w-full px-4 py-2.5 border border-[#e8ece9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2f9e44]/30"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-[#1f2937] mb-1.5">Description (optional)</label>
                <input
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Beautiful indoor plants..."
                  className="w-full px-4 py-2.5 border border-[#e8ece9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2f9e44]/30"
                />
              </div>

              {/* Order */}
              <div>
                <label className="block text-sm font-medium text-[#1f2937] mb-1.5">Display Order</label>
                <input
                  type="number"
                  name="order"
                  value={form.order}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-[#e8ece9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2f9e44]/30"
                />
              </div>

              {/* Active */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-[#2f9e44]"
                />
                <span className="text-sm text-[#1f2937]">Active (show on homepage)</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 py-2.5 border border-[#e8ece9] rounded-xl text-sm font-medium text-[#6b7280] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-[#2f9e44] hover:bg-[#237a35] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}