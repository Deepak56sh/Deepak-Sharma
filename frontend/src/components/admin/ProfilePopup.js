'use client';
import { useState, useEffect } from 'react';
import { X, Upload, User, Camera, Loader2 } from 'lucide-react';

export default function ProfilePopup({ isOpen, onClose, adminUser, onUpdate }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profilePicture: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  // ✅ Get API URL
  const getApiUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';
  };

  // ✅ Get Base URL for static files
  const getBaseUrl = () => {
    return process.env.NEXT_PUBLIC_BACKEND_URL || 'https://my-site-backend-0661.onrender.com';
  };

  useEffect(() => {
    if (adminUser) {
      setFormData({
        name: adminUser.name || '',
        email: adminUser.email || '',
        profilePicture: adminUser.profilePicture || ''
      });
      // ✅ Get full image URL for preview
      setPreviewImage(getFullImageUrl(adminUser.profilePicture || ''));
    }
  }, [adminUser]);

  // ✅ Get full image URL
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) {
      return '';
    }

    // If already full URL
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // ✅ Use BASE URL (without /api) for static files
    const BASE_URL = getBaseUrl();

    // Clean the path
    let cleanPath = imagePath;
    
    // Remove /api if present
    if (cleanPath.startsWith('/api')) {
      cleanPath = cleanPath.replace('/api', '');
    }
    
    // Ensure /uploads/ prefix
    if (!cleanPath.startsWith('/uploads/')) {
      cleanPath = '/uploads/' + cleanPath.replace(/^\/+/, '');
    }

    return BASE_URL + cleanPath;
  };

  // ✅ Image upload function - FIXED
  const uploadImage = async (file) => {
    setUploadingImage(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      console.log('📤 Uploading profile image:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      // ✅ Create FormData with different variable name
      const formDataToSend = new FormData();
      formDataToSend.append('image', file); // Field name must be 'image'

      // Debug: Log FormData contents
      console.log('📦 FormData entries:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value instanceof File ? `${value.name} (${value.type}, ${value.size} bytes)` : value);
      }

      // ✅ Use the correct endpoint
      const uploadUrl = `${getApiUrl()}/auth/upload-profile-image`;
      console.log('🔗 Upload URL:', uploadUrl);

      // ✅ IMPORTANT: DON'T set Content-Type header for FormData
      const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // ❌ NO 'Content-Type' header - browser sets it automatically
        },
        body: formDataToSend
      });

      console.log('📡 Response status:', res.status);
      console.log('📡 Response headers:', {
        'content-type': res.headers.get('content-type')
      });

      const result = await res.json();
      console.log('📡 Response data:', result);

      if (!res.ok) {
        throw new Error(result.message || `Upload failed: ${res.status}`);
      }

      if (result.success && result.data && result.data.imageUrl) {
        return result.data.imageUrl;
      } else {
        throw new Error(result.message || 'Upload failed - no image URL returned');
      }

    } catch (error) {
      console.error('❌ Image upload error:', error);
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('🖼️ Profile image selected:', file.name);

    // Reset input value so same file can be selected again
    e.target.value = '';

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select a valid image file (JPEG, PNG, WebP, GIF)' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size should be less than 5MB' });
      return;
    }

    try {
      // Create immediate preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);

      // Upload image to server
      const imageUrl = await uploadImage(file);
      console.log('✅ Profile image URL received:', imageUrl);

      // Update form data with server path
      setFormData(prev => ({
        ...prev,
        profilePicture: imageUrl
      }));

      setMessage({
        type: 'success',
        text: '✅ Profile image uploaded successfully!'
      });

    } catch (error) {
      console.error('❌ Image processing error:', error);
      setMessage({
        type: 'error',
        text: `❌ Upload failed: ${error.message}`
      });
      // Reset preview on error
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
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json();
      console.log('📊 Profile update result:', result);

      if (result.success) {
        // Update localStorage with complete user data
        const updatedUser = { 
          ...adminUser, 
          ...formData,
          profilePicture: formData.profilePicture // Ensure profile picture is included
        };
        localStorage.setItem('adminUser', JSON.stringify(updatedUser));
        
        // Call parent callback
        onUpdate(updatedUser);
        
        setMessage({
          type: 'success',
          text: '✅ Profile updated successfully!'
        });
        
        // Close popup after success
        setTimeout(() => {
          onClose();
        }, 1500);
        
      } else {
        throw new Error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        type: 'error',
        text: `❌ Failed to update profile: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl w-full max-w-md border border-purple-500/20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Update Profile</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-slate-600 transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Message Display */}
          {message.text && (
            <div className={`p-3 rounded-lg text-sm ${
              message.type === 'success'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {message.text}
            </div>
          )}

          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center overflow-hidden border-4 border-slate-700">
                {previewImage ? (
                  <img 
                    src={previewImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('❌ Profile image failed to load:', e.target.src);
                      e.target.onerror = null;
                      e.target.src = '';
                    }}
                  />
                ) : (
                  <User className="w-10 h-10 text-white" />
                )}
                
                {uploadingImage && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>
              
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-600 transition-colors disabled:opacity-50">
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
            
            <p className="text-gray-400 text-sm text-center">
              {uploadingImage ? 'Uploading...' : 'Click camera icon to upload profile picture'}
            </p>
            
            {/* Debug Info */}
            {formData.profilePicture && (
              <div className="mt-2 p-2 bg-slate-900 rounded text-xs font-mono max-w-full overflow-hidden">
                <div className="text-gray-500 text-[10px]">Stored path:</div>
                <div className="text-purple-400 text-[10px] truncate">{formData.profilePicture}</div>
              </div>
            )}
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="Enter your name"
              required
              disabled={loading}
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 bg-slate-700 text-gray-300 rounded-lg font-medium hover:bg-slate-600 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}