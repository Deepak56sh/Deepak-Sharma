'use client';
import { useState, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2, X, Upload, Loader2, Sprout } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

const dummyPlants = [
  { _id: '1', name: 'Areca Palm', category: 'Indoor Plants', price: 899, stock: 42, image: '' },
  { _id: '2', name: 'Snake Plant', category: 'Air Purifying', price: 499, stock: 65, image: '' },
  { _id: '3', name: 'Peace Lily', category: 'Low Maintenance', price: 599, stock: 30, image: '' },
];

const emptyForm = {
  name: '',
  category: '',
  price: '',
  originalPrice: '',
  stock: '',
  description: '',
  image: '',        // primary image -> shown in shop listing / admin table
  images: [],        // gallery images -> shown in the product page slider
  light: 'Bright Indirect',
  careLevel: 'Easy',
  petFriendly: false,
  potIncluded: true,
  isBestSeller: false,
  isLowMaintenance: false,
  isAirPurifying: false,
  badges: '', // comma separated in the UI, split into array on save
};

export default function PlantsPage() {
  const [plants, setPlants] = useState(dummyPlants);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPlant, setEditingPlant] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null);

  const fetchPlants = async () => {
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/plants`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) setPlants(data.data || []);
      }
    } catch (err) {
      console.log('Plants endpoint not connected yet, showing placeholder data.');
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  const openAddModal = () => {
    setEditingPlant(null);
    setForm(emptyForm);
    setErrorMsg('');
    setShowModal(true);
  };

  const openEditModal = (plant) => {
    setEditingPlant(plant);
    setForm({
      name: plant.name || '',
      category: plant.category || '',
      price: plant.price || '',
      originalPrice: plant.originalPrice || '',
      stock: plant.stock || '',
      description: plant.description || '',
      image: plant.image || '',
      images: plant.images || [],
      light: plant.light || 'Bright Indirect',
      careLevel: plant.careLevel || 'Easy',
      petFriendly: !!plant.petFriendly,
      potIncluded: plant.potIncluded !== false,
      isBestSeller: !!plant.isBestSeller,
      isLowMaintenance: !!plant.isLowMaintenance,
      isAirPurifying: !!plant.isAirPurifying,
      badges: (plant.badges || []).join(', '),
    });
    setErrorMsg('');
    setShowModal(true);
  };

  // Primary image = the one shown in shop listing/cards
  const handleMainImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file.');
      return;
    }
    const token = getToken();
    if (!token) {
      setErrorMsg('You are not logged in (no admin token found). Please log in again.');
      return;
    }

    setUploadingMain(true);
    setErrorMsg('');
    try {
      const fd = new FormData();
      fd.append('image', file);

      const res = await fetch(`${API_BASE_URL}/plants/upload-image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      let result = null;
      try { result = await res.json(); } catch (_) {}

      if (res.ok && result?.success && result?.data?.imageUrl) {
        setForm((prev) => ({ ...prev, image: result.data.imageUrl }));
      } else {
        setErrorMsg(result?.message || `Image upload failed (status ${res.status}). Please try again.`);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setErrorMsg('Could not reach the server to upload the image. Check your connection and try again.');
    } finally {
      setUploadingMain(false);
    }
  };

  // Gallery images = the slider on the product detail (shop/[slug]) page
  const handleGalleryImagesChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (files.some((f) => !f.type.startsWith('image/'))) {
      setErrorMsg('Please select valid image files only.');
      return;
    }
    const token = getToken();
    if (!token) {
      setErrorMsg('You are not logged in (no admin token found). Please log in again.');
      return;
    }

    setUploadingGallery(true);
    setErrorMsg('');
    try {
      const fd = new FormData();
      files.forEach((file) => fd.append('images', file));

      const res = await fetch(`${API_BASE_URL}/plants/upload-gallery-images`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      let result = null;
      try { result = await res.json(); } catch (_) {}

      if (res.ok && result?.success && result?.data?.imageUrls) {
        setForm((prev) => ({ ...prev, images: [...prev.images, ...result.data.imageUrls] }));
      } else {
        setErrorMsg(result?.message || `Gallery upload failed (status ${res.status}). Please try again.`);
      }
    } catch (err) {
      console.error('Gallery upload error:', err);
      setErrorMsg('Could not reach the server to upload images. Check your connection and try again.');
    } finally {
      setUploadingGallery(false);
      e.target.value = '';
    }
  };

  const removeGalleryImage = (url) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((img) => img !== url) }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    const token = getToken();
    if (!token) {
      setErrorMsg('You are not logged in (no admin token found). Please log in again.');
      setSaving(false);
      return;
    }

    try {
      const url = editingPlant ? `${API_BASE_URL}/plants/${editingPlant._id}` : `${API_BASE_URL}/plants`;
      const method = editingPlant ? 'PUT' : 'POST';

      const payload = {
        ...form,
        badges: form.badges
          ? form.badges.split(',').map((b) => b.trim()).filter(Boolean)
          : [],
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      let result = null;
      try { result = await res.json(); } catch (_) {}

      if (res.ok && result?.success) {
        await fetchPlants();
        setShowModal(false);
      } else {
        setErrorMsg(result?.message || `Save failed (status ${res.status}). Please try again.`);
      }
    } catch (err) {
      console.error('Save error:', err);
      setErrorMsg('Could not reach the server. Check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/plants/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setPlants((prev) => prev.filter((p) => p._id !== id));
      } else {
        console.error('Delete failed with status', res.status);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filtered = plants.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const Toggle = ({ label, checked, onChange }) => (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded text-[var(--pa-primary)]"
      />
      <span className="text-sm text-slate-600">{label}</span>
    </label>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Plants</h1>
          <p className="text-slate-500 text-sm">Manage your plant catalog, prices and stock.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 text-white font-medium px-4 py-2.5 rounded-lg"
          style={{ backgroundColor: 'var(--pa-primary)' }}
        >
          <Plus className="w-4 h-4" /> Add New Plant
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[var(--pa-border)]">
        <div className="p-4 border-b border-[var(--pa-border)]">
          <div className="relative max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search plants..."
              className="pl-9 pr-3 py-2 bg-slate-50 border border-[var(--pa-border)] rounded-lg text-sm w-full focus:outline-none focus:border-[var(--pa-primary)]"
            />
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 border-b border-[var(--pa-border)]">
              <th className="px-4 py-3 font-medium">Plant</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Gallery</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((plant) => (
              <tr key={plant._id} className="border-b border-[var(--pa-border)] last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[var(--pa-primary-light)] flex items-center justify-center overflow-hidden flex-shrink-0">
                      {plant.image ? (
                        <img src={plant.image} alt={plant.name} className="w-full h-full object-cover" />
                      ) : (
                        <Sprout className="w-4 h-4" style={{ color: 'var(--pa-primary)' }} />
                      )}
                    </div>
                    <span className="font-medium text-slate-800">{plant.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500">{plant.category}</td>
                <td className="px-4 py-3 text-slate-800">₹{plant.price}</td>
                <td className="px-4 py-3 text-slate-500">{plant.stock}</td>
                <td className="px-4 py-3 text-slate-500">{plant.images?.length || 0} photos</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal(plant)}
                      className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(plant._id)}
                      className="p-2 hover:bg-rose-50 rounded-lg text-slate-500 hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                  No plants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl border border-[var(--pa-border)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[var(--pa-border)]">
              <h2 className="text-xl font-bold text-slate-800">{editingPlant ? 'Edit Plant' : 'Add New Plant'}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              {errorMsg && (
                <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-lg px-4 py-3">
                  {errorMsg}
                </div>
              )}

              {/* Primary image — this is what shows in the shop listing card */}
              <div>
                <label className="block text-slate-600 text-sm mb-2 font-medium">
                  Primary Image <span className="text-slate-400 font-normal">(shown in shop listing)</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <div className="w-20 h-20 bg-[var(--pa-primary-light)] rounded-xl flex items-center justify-center overflow-hidden border border-[var(--pa-border)]">
                      {form.image ? (
                        <img src={form.image} alt="Primary" className="w-full h-full object-cover" />
                      ) : (
                        <Sprout className="w-8 h-8" style={{ color: 'var(--pa-primary)' }} />
                      )}
                      {uploadingMain && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Loader2 className="w-5 h-5 text-white animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>
                  <label className="flex items-center gap-2 px-4 py-2.5 bg-[var(--pa-primary-light)] text-[var(--pa-primary)] rounded-lg text-sm font-medium cursor-pointer hover:opacity-90">
                    <Upload className="w-4 h-4" />
                    {form.image ? 'Change Image' : 'Upload Image'}
                    <input type="file" accept="image/*" onChange={handleMainImageChange} className="hidden" disabled={uploadingMain} />
                  </label>
                </div>
              </div>

              {/* Gallery images — this is the slider on shop/[slug] */}
              <div>
                <label className="block text-slate-600 text-sm mb-2 font-medium">
                  Gallery Photos <span className="text-slate-400 font-normal">(shown as slider on product page)</span>
                </label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {form.images.map((img) => (
                    <div key={img} className="relative w-16 h-16 rounded-lg overflow-hidden border border-[var(--pa-border)] group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(img)}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}
                  {uploadingGallery && (
                    <div className="w-16 h-16 rounded-lg border border-[var(--pa-border)] flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                    </div>
                  )}
                </div>
                <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium cursor-pointer hover:bg-slate-200">
                  <Upload className="w-4 h-4" />
                  Add Gallery Photos
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryImagesChange}
                    className="hidden"
                    disabled={uploadingGallery}
                  />
                </label>
              </div>

              <div>
                <label className="block text-slate-600 text-sm mb-2">Plant Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full p-3 bg-slate-50 border border-[var(--pa-border)] rounded-lg focus:outline-none focus:border-[var(--pa-primary)]"
                  placeholder="e.g. Areca Palm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 text-sm mb-2">Category</label>
                  <input
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-[var(--pa-border)] rounded-lg focus:outline-none focus:border-[var(--pa-primary)]"
                    placeholder="Indoor Plants"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 text-sm mb-2">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-[var(--pa-border)] rounded-lg focus:outline-none focus:border-[var(--pa-primary)]"
                    placeholder="899"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 text-sm mb-2">
                    MRP (₹) <span className="text-slate-400 font-normal">optional — shows strikethrough discount</span>
                  </label>
                  <input
                    type="number"
                    value={form.originalPrice}
                    onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-[var(--pa-border)] rounded-lg focus:outline-none focus:border-[var(--pa-primary)]"
                    placeholder="1199"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 text-sm mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-[var(--pa-border)] rounded-lg focus:outline-none focus:border-[var(--pa-primary)]"
                    placeholder="50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 text-sm mb-2">Light Requirement</label>
                  <select
                    value={form.light}
                    onChange={(e) => setForm({ ...form, light: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-[var(--pa-border)] rounded-lg focus:outline-none focus:border-[var(--pa-primary)]"
                  >
                    <option value="Low Light">Low Light</option>
                    <option value="Bright Indirect">Bright Indirect</option>
                    <option value="Direct Sunlight">Direct Sunlight</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 text-sm mb-2">Care Level</label>
                  <select
                    value={form.careLevel}
                    onChange={(e) => setForm({ ...form, careLevel: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-[var(--pa-border)] rounded-lg focus:outline-none focus:border-[var(--pa-primary)]"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 text-sm mb-2">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full p-3 bg-slate-50 border border-[var(--pa-border)] rounded-lg focus:outline-none focus:border-[var(--pa-primary)] resize-none"
                  placeholder="Short care/description note shown on the product page"
                />
              </div>

              <div>
                <label className="block text-slate-600 text-sm mb-2">
                  Badges <span className="text-slate-400 font-normal">(comma separated, e.g. "Air Purifying, Trending")</span>
                </label>
                <input
                  value={form.badges}
                  onChange={(e) => setForm({ ...form, badges: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-[var(--pa-border)] rounded-lg focus:outline-none focus:border-[var(--pa-primary)]"
                  placeholder="Air Purifying, Pet Friendly"
                />
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-1">
                <Toggle label="Pet Friendly" checked={form.petFriendly} onChange={(e) => setForm({ ...form, petFriendly: e.target.checked })} />
                <Toggle label="Pot Included" checked={form.potIncluded} onChange={(e) => setForm({ ...form, potIncluded: e.target.checked })} />
                <Toggle label="Best Seller" checked={form.isBestSeller} onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })} />
                <Toggle label="Low Maintenance" checked={form.isLowMaintenance} onChange={(e) => setForm({ ...form, isLowMaintenance: e.target.checked })} />
                <Toggle label="Air Purifying" checked={form.isAirPurifying} onChange={(e) => setForm({ ...form, isAirPurifying: e.target.checked })} />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingMain || uploadingGallery}
                  className="flex-1 py-3 bg-[var(--pa-primary)] text-white rounded-lg font-medium hover:bg-[var(--pa-primary-dark)] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {editingPlant ? 'Save Changes' : 'Add Plant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}