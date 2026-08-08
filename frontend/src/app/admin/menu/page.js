// app/admin/menu/page.js
'use client';
import { useState, useEffect } from 'react';
import {
  Plus, Pencil, Trash2, Save, X, GripVertical,
  ExternalLink, Link as LinkIcon, Eye, EyeOff,
  Upload, Image as ImageIcon
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://my-site-backend-0661.onrender.com';

const emptyItem = {
  name: '',
  path: '',
  type: 'internal',
  url: '',
  order: 0,
  isActive: true,
  icon: ''
};

export default function AdminMenuPage() {
  // ===== MENU STATE =====
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyItem);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // ===== HEADER STATE (Logo + Top Bar) =====
  const [header, setHeader] = useState({
    logoText: 'Plantora',
    logoImage: '',
    topBarText: 'Free Shipping on orders above ₹999'
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [headerSaving, setHeaderSaving] = useState(false);

  const getToken = () =>
    typeof window !== 'undefined' ? localStorage.getItem('adminToken') || localStorage.getItem('token') : '';

  // ===== FETCH DATA =====
  useEffect(() => {
    fetchMenu();
    fetchHeader();
  }, []);

  // Fetch Menu
  const fetchMenu = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/menu/all`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (data.success) {
        setMenuItems(data.data || []);
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to load menu' });
    } finally {
      setLoading(false);
    }
  };

  // Fetch Header
  const fetchHeader = async () => {
    try {
      const res = await fetch(`${API_URL}/header`);
      const data = await res.json();
      if (data.success && data.data) {
        setHeader(data.data);
        if (data.data.logoImage) {
          const imgUrl = data.data.logoImage.startsWith('http')
            ? data.data.logoImage
            : `${BASE_URL}${data.data.logoImage}`;
          setLogoPreview(imgUrl);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ===== MENU FUNCTIONS =====
  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const openAdd = () => {
    setForm({ ...emptyItem, order: menuItems.length });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setForm({
      name: item.name || '',
      path: item.path || '',
      type: item.type || 'internal',
      url: item.url || '',
      order: item.order || 0,
      isActive: item.isActive !== false,
      icon: item.icon || ''
    });
    setEditingId(item._id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyItem);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showMsg('error', 'Name is required');
      return;
    }
    if (form.type === 'internal' && !form.path.trim()) {
      showMsg('error', 'Path is required for internal links');
      return;
    }
    if (form.type === 'external' && !form.url.trim()) {
      showMsg('error', 'URL is required for external links');
      return;
    }

    setSaving(true);
    try {
      const url = editingId ? `${API_URL}/menu/${editingId}` : `${API_URL}/menu`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (data.success) {
        showMsg('success', data.message || 'Saved successfully');
        closeForm();
        fetchMenu();
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
    if (!confirm('Delete this menu item?')) return;
    try {
      const res = await fetch(`${API_URL}/menu/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (data.success) {
        showMsg('success', 'Deleted successfully');
        fetchMenu();
      } else {
        showMsg('error', data.message || 'Failed to delete');
      }
    } catch {
      showMsg('error', 'Server error');
    }
  };

  const toggleActive = async (item) => {
    try {
      const res = await fetch(`${API_URL}/menu/${item._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ isActive: !item.isActive })
      });
      const data = await res.json();
      if (data.success) fetchMenu();
    } catch {
      showMsg('error', 'Failed to update status');
    }
  };

  // ===== HEADER FUNCTIONS (Logo + Top Bar) =====
  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    setHeader(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = async () => {
    if (!confirm('Remove logo?')) return;

    try {
      const res = await fetch(`${API_URL}/header/logo`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` }
      });

      const data = await res.json();
      if (data.success) {
        setLogoPreview('');
        setLogoFile(null);
        setHeader(prev => ({ ...prev, logoImage: '' }));
        showMsg('success', 'Logo removed successfully');
      }
    } catch (err) {
      showMsg('error', 'Failed to remove logo');
    }
  };

  const saveHeader = async (e) => {
    e.preventDefault();
    setHeaderSaving(true);

    try {
      const formData = new FormData();
      formData.append('logoText', header.logoText);
      formData.append('topBarText', header.topBarText);

      if (logoFile) {
        formData.append('logoImage', logoFile);
      }

      const res = await fetch(`${API_URL}/header`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        showMsg('success', 'Header updated successfully!');
        setHeader(data.data);
        if (data.data.logoImage) {
          const imgUrl = data.data.logoImage.startsWith('http')
            ? data.data.logoImage
            : `${BASE_URL}${data.data.logoImage}`;
          setLogoPreview(imgUrl);
        }
        setLogoFile(null);
      } else {
        showMsg('error', data.message || 'Failed to update header');
      }
    } catch (err) {
      showMsg('error', 'Server error occurred');
    } finally {
      setHeaderSaving(false);
    }
  };

  return (
    <div className="plant-admin p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1f2937]">Menu & Header Settings</h1>
          <p className="text-sm text-[#6b7280] mt-1">Manage menu items, logo and top bar text</p>
        </div>
      </div>

      {/* ===== MESSAGES ===== */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${
          message.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* ===== SECTION 1: HEADER SETTINGS (Logo + Top Bar) ===== */}
      <div className="bg-white rounded-2xl border border-[#e8ece9] p-6 mb-8">
        <h2 className="text-lg font-semibold text-[#1f2937] mb-4">Header Settings</h2>

        <form onSubmit={saveHeader} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Logo Text */}
            <div>
              <label className="block text-sm font-medium text-[#1f2937] mb-1.5">
                Logo Text
              </label>
              <input
                name="logoText"
                value={header.logoText || ''}
                onChange={handleHeaderChange}
                placeholder="Plantora"
                className="w-full px-4 py-2.5 border border-[#e8ece9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2f9e44]/30"
              />
              <p className="text-xs text-[#6b7280] mt-1">Shown when no logo image is uploaded</p>
            </div>

            {/* Logo Image Upload */}
            <div>
              <label className="block text-sm font-medium text-[#1f2937] mb-1.5">
                Logo Image
              </label>
              <div className="flex items-center gap-3">
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-[#e8ece9] rounded-xl hover:border-[#2f9e44] transition-colors">
                    <Upload className="w-4 h-4 text-[#6b7280]" />
                    <span className="text-sm text-[#6b7280]">
                      {logoFile ? logoFile.name : 'Upload Logo'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </div>
                </label>
                {logoPreview && (
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove logo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {logoPreview && (
                <div className="mt-3 p-3 bg-[#f6f8f7] rounded-xl flex items-center gap-4">
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="h-12 w-auto object-contain"
                    onError={(e) => {
                      e.target.src = '';
                      e.target.alt = 'Invalid image';
                    }}
                  />
                  <div className="text-sm">
                    <p className="text-[#1f2937] font-medium">
                      {logoFile ? logoFile.name : 'Current Logo'}
                    </p>
                    <p className="text-[#6b7280] text-xs">
                      {logoFile ? `${(logoFile.size / 1024).toFixed(1)} KB` : 'Click upload to change'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Top Bar Text */}
          <div>
            <label className="block text-sm font-medium text-[#1f2937] mb-1.5">
              Top Bar Text
            </label>
            <input
              name="topBarText"
              value={header.topBarText || ''}
              onChange={handleHeaderChange}
              placeholder="Free Shipping on orders above ₹999"
              className="w-full px-4 py-2.5 border border-[#e8ece9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2f9e44]/30"
            />
            <p className="text-xs text-[#6b7280] mt-1">Shown at the top of the page</p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={headerSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2f9e44] hover:bg-[#237a35] text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {headerSaving ? 'Saving...' : 'Save Header Settings'}
            </button>
          </div>
        </form>
      </div>

      {/* ===== SECTION 2: MENU MANAGEMENT ===== */}
      <div className="bg-white rounded-2xl border border-[#e8ece9] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-[#e8ece9]">
          <div>
            <h2 className="text-lg font-semibold text-[#1f2937]">Menu Management</h2>
            <p className="text-sm text-[#6b7280]">Add, edit, reorder navbar links</p>
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2f9e44] hover:bg-[#237a35] text-white font-semibold rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Menu Item
          </button>
        </div>

        {/* Menu Table */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2f9e44]" />
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center py-16 text-[#6b7280]">
            <p className="mb-4">No menu items yet</p>
            <button onClick={openAdd} className="text-[#2f9e44] font-semibold hover:underline">
              Add your first menu item
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f6f8f7] text-[#6b7280]">
                  <th className="text-left px-5 py-3 font-medium w-10">#</th>
                  <th className="text-left px-5 py-3 font-medium">Name</th>
                  <th className="text-left px-5 py-3 font-medium">Path / URL</th>
                  <th className="text-left px-5 py-3 font-medium">Type</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-right px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {menuItems
                  .sort((a, b) => a.order - b.order)
                  .map((item, i) => (
                    <tr key={item._id} className="border-t border-[#e8ece9] hover:bg-[#f6f8f7]/50">
                      <td className="px-5 py-3.5 text-[#9ca3af]">
                        <div className="flex items-center gap-1">
                          <GripVertical className="w-4 h-4" />
                          {item.order}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-[#1f2937]">{item.name}</td>
                      <td className="px-5 py-3.5 text-[#6b7280] font-mono text-xs">
                        {item.type === 'external' ? item.url : item.path}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          item.type === 'external'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => toggleActive(item)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            item.isActive
                              ? 'bg-green-50 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {item.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {item.isActive ? 'Active' : 'Hidden'}
                        </button>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(item)}
                            className="p-2 rounded-lg text-[#6b7280] hover:bg-[#eaf7ee] hover:text-[#2f9e44] transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-2 rounded-lg text-[#6b7280] hover:bg-red-50 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===== MENU FORM MODAL ===== */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8ece9]">
              <h2 className="font-bold text-lg text-[#1f2937]">
                {editingId ? 'Edit Menu Item' : 'Add Menu Item'}
              </h2>
              <button onClick={closeForm} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1f2937] mb-1.5">Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Home / Shop / About Us"
                  required
                  className="w-full px-4 py-2.5 border border-[#e8ece9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2f9e44]/30 focus:border-[#2f9e44]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1f2937] mb-1.5">Type</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-[#e8ece9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2f9e44]/30"
                >
                  <option value="internal">Internal (site page)</option>
                  <option value="external">External (outside link)</option>
                </select>
              </div>

              {form.type === 'internal' ? (
                <div>
                  <label className="block text-sm font-medium text-[#1f2937] mb-1.5">Path *</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      name="path"
                      value={form.path}
                      onChange={handleChange}
                      placeholder="/shop"
                      className="w-full pl-10 pr-4 py-2.5 border border-[#e8ece9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2f9e44]/30"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-[#1f2937] mb-1.5">External URL *</label>
                  <div className="relative">
                    <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      name="url"
                      value={form.url}
                      onChange={handleChange}
                      placeholder="https://example.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-[#e8ece9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2f9e44]/30"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1f2937] mb-1.5">Order</label>
                  <input
                    type="number"
                    name="order"
                    value={form.order}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-[#e8ece9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2f9e44]/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1f2937] mb-1.5">Icon (optional)</label>
                  <input
                    name="icon"
                    value={form.icon}
                    onChange={handleChange}
                    placeholder="Leaf"
                    className="w-full px-4 py-2.5 border border-[#e8ece9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2f9e44]/30"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-[#2f9e44] focus:ring-[#2f9e44]"
                />
                <span className="text-sm text-[#1f2937]">Active (show in navbar)</span>
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