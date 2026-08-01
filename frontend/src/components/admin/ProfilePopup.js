'use client';
import { useState, useEffect } from 'react';
import { X, User, Camera, Loader2 } from 'lucide-react';

export default function ProfilePopup({ isOpen, onClose, adminUser, onUpdate }) {
  const [formData, setFormData] = useState({ name: '', email: '', profilePicture: '' });
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';
  const getBaseUrl = () => process.env.NEXT_PUBLIC_BACKEND_URL || 'https://my-site-backend-0661.onrender.com';

  useEffect(() => {
    if (adminUser) {
      setFormData({
        name: adminUser.name || '',
        email: adminUser.email || '',
        profilePicture: adminUser.profilePicture || '',
      });
      setPreviewImage(getFullImageUrl(adminUser.profilePicture || ''));
    }
  }, [adminUser]);

  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;

    const BASE_URL = getBaseUrl();
    let cleanPath = imagePath;
    if (cleanPath.startsWith('/api')) cleanPath = cleanPath.replace('/api', '');
    if (!cleanPath.startsWith('/uploads/')) cleanPath = '/uploads/' + cleanPath.replace(/^\/+/, '');

    return BASE_URL + cleanPath;
  };

  const uploadImage = async (file) => {
    setUploadingImage(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication token not found. Please login again.');

      const fd = new FormData();
      fd.append('image', file);

      const uploadUrl = `${getApiUrl()}/auth/upload-profile-image`;

      const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Upload failed: ${res.status} - ${errorText}`);
      }

      const result = await res.json();

      if (result.success && result.data && result.data.imageUrl) {
        return result.data.imageUrl;
      } else {
        throw new Error(result.message || 'Upload failed - no image URL returned');
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select a valid image file' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size should be less than 5MB' });
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);

      const imageUrl = await uploadImage(file);

      setFormData((prev) => ({ ...prev, profilePicture: imageUrl }));
      setMessage({ type: 'success', text: '✅ Profile image uploaded successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Upload failed: ${error.message}` });
      setPreviewImage(getFullImageUrl(formData.profilePicture));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${getApiUrl()}/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.success) {
        const updatedUser = { ...adminUser, ...formData, profilePicture: formData.profilePicture };
        localStorage.setItem('adminUser', JSON.stringify(updatedUser));
        onUpdate(updatedUser);
        setMessage({ type: 'success', text: '✅ Profile updated successfully!' });
        setTimeout(() => onClose(), 1500);
      } else {
        throw new Error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Failed to update profile: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md border border-[var(--pa-border)]">
        <div className="flex items-center justify-between p-6 border-b border-[var(--pa-border)]">
          <h2 className="text-xl font-bold text-slate-800">Update Profile</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {message.text && (
            <div
              className={`p-3 rounded-lg text-sm ${
                message.type === 'success'
                  ? 'bg-[var(--pa-primary-light)] text-[var(--pa-primary)] border border-[var(--pa-primary)]/20'
                  : 'bg-rose-50 text-rose-500 border border-rose-200'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 bg-[var(--pa-primary-light)] rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '';
                    }}
                  />
                ) : (
                  <User className="w-10 h-10 text-[var(--pa-primary)]" />
                )}

                {uploadingImage && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>

              <label className="absolute bottom-0 right-0 w-8 h-8 bg-[var(--pa-primary)] rounded-full flex items-center justify-center cursor-pointer hover:bg-[var(--pa-primary-dark)] transition-colors">
                {uploadingImage ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <Camera className="w-4 h-4 text-white" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={uploadingImage || loading}
                />
              </label>
            </div>

            <p className="text-slate-400 text-sm text-center">
              {uploadingImage ? 'Uploading...' : 'Click camera icon to upload profile picture'}
            </p>
          </div>

          <div>
            <label className="block text-slate-600 text-sm mb-2">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-[var(--pa-border)] rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[var(--pa-primary)] transition-colors"
              placeholder="Enter your name"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-slate-600 text-sm mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-[var(--pa-border)] rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[var(--pa-primary)] transition-colors"
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="flex-1 py-3 bg-[var(--pa-primary)] text-white rounded-lg font-medium hover:bg-[var(--pa-primary-dark)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
