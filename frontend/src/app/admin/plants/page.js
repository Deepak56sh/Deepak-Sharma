'use client';
import { useState, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2, X, Upload, Loader2, Sprout } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

// Dummy rows so the table isn't empty before the API is wired up.
const dummyPlants = [
  { _id: '1', name: 'Areca Palm', category: 'Indoor Plants', price: 899, stock: 42, image: '' },
  { _id: '2', name: 'Snake Plant', category: 'Air Purifying', price: 499, stock: 65, image: '' },
  { _id: '3', name: 'Peace Lily', category: 'Low Maintenance', price: 599, stock: 30, image: '' },
];

export default function PlantsPage() {
  const [plants, setPlants] = useState(dummyPlants);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPlant, setEditingPlant] = useState(null);
  const [form, setForm] = useState({ name: '', category: '', price: '', stock: '', description: '', image: '' });
  const [previewImage, setPreviewImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  // ✅ FIX: surface errors to the user instead of failing silently
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
      // Keep dummy data if the endpoint isn't live yet
      console.log('Plants endpoint not connected yet, showing placeholder data.');
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  const openAddModal = () => {
    setEditingPlant(null);
    setForm({ name: '', category: '', price: '', stock: '', description: '', image: '' });
    setPreviewImage('');
    setErrorMsg('');
    setShowModal(true);
  };

  const openEditModal = (plant) => {
    setEditingPlant(plant);
    setForm({
      name: plant.name || '',
      category: plant.category || '',
      price: plant.price || '',
      stock: plant.stock || '',
      description: plant.description || '',
      image: plant.image || '',
    });
    setPreviewImage(plant.image || '');
    setErrorMsg('');
    setShowModal(true);
  };

  // ✅ FIX: Image upload now checks token first, and shows the real error
  // instead of silently keeping only a local (non-persisted) preview.
  const handleImageChange = async (e) => {
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

    const reader = new FileReader();
    reader.onload = (ev) => setPreviewImage(ev.target.result);
    reader.readAsDataURL(file);

    setUploading(true);
    setErrorMsg('');
    try {
      const fd = new FormData();
      fd.append('image', file);

      const res = await fetch(`${API_BASE_URL}/plants/upload-image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      // ✅ FIX: always read the body so we can show the real error message
      let result = null;
      try {
        result = await res.json();
      } catch (parseErr) {
        // response wasn't JSON (e.g. HTML error page from server crash)
      }

      if (res.ok && result?.success && result?.data?.imageUrl) {
        setForm((prev) => ({ ...prev, image: result.data.imageUrl }));
      } else {
        // ✅ FIX: no more silent failure — tell the user exactly what happened
        setErrorMsg(
          result?.message ||
            `Image upload failed (status ${res.status}). Please try again.`
        );
        // Roll back local preview so UI doesn't lie about upload state
        setPreviewImage(form.image || '');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setErrorMsg('Could not reach the server to upload the image. Check your connection and try again.');
      setPreviewImage(form.image || '');
    } finally {
      setUploading(false);
    }
  };

  // ✅ FIX: Save no longer fakes success on failure. It shows the real
  // error and does NOT touch local state unless the backend actually saved it.
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

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });

      let result = null;
      try {
        result = await res.json();
      } catch (parseErr) {
        // non-JSON response
      }

      if (res.ok && result?.success) {
        await fetchPlants();
        setShowModal(false);
      } else {
        // ✅ FIX: real error shown, modal stays open, no fake local insert
        setErrorMsg(
          result?.message || `Save failed (status ${res.status}). Please try again.`
        );
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
        // ✅ FIX: don't remove from UI if the backend didn't actually delete it
        console.error('Delete failed with status', res.status);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filtered = plants.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

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
                <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
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
          <div className="bg-white rounded-2xl w-full max-w-lg border border-[var(--pa-border)] max-h-[90vh] overflow-y-auto">
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
              {/* ✅ FIX: visible error banner instead of silent failure */}
              {errorMsg && (
                <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-lg px-4 py-3">
                  {errorMsg}
                </div>
              )}

              {/* Image upload */}
              <div className="flex flex-col items-center">
                <div className="relative mb-3">
                  <div className="w-24 h-24 bg-[var(--pa-primary-light)] rounded-xl flex items-center justify-center overflow-hidden border border-[var(--pa-border)]">
                    {previewImage ? (
                      <img src={previewImage} alt="Plant" className="w-full h-full object-cover" />
                    ) : (
                      <Sprout className="w-10 h-10" style={{ color: 'var(--pa-primary)' }} />
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-[var(--pa-primary)] rounded-full flex items-center justify-center cursor-pointer hover:bg-[var(--pa-primary-dark)]">
                    <Upload className="w-4 h-4 text-white" />
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" disabled={uploading} />
                  </label>
                </div>
                <p className="text-slate-400 text-xs">Click the icon to upload a plant photo</p>
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
                  <label className="block text-slate-600 text-sm mb-2">Price (₹)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-[var(--pa-border)] rounded-lg focus:outline-none focus:border-[var(--pa-primary)]"
                    placeholder="899"
                  />
                </div>
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

              <div>
                <label className="block text-slate-600 text-sm mb-2">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full p-3 bg-slate-50 border border-[var(--pa-border)] rounded-lg focus:outline-none focus:border-[var(--pa-primary)] resize-none"
                  placeholder="Short care/description note"
                />
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
                  disabled={saving || uploading}
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