'use client';
import { useState, useEffect } from 'react';
import { X, User, Camera, Loader2 } from 'lucide-react';

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

  // ✅ Simple URL construction
  const getApiUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';
  };

  const getBaseUrl = () => {
    return process.env.NEXT_PUBLIC_BACKEND_URL || 'https://my-site-backend-0661.onrender.com';
  };

  useEffect(() => {
    if (adminUser && isOpen) {
      setFormData({
        name: adminUser.name || '',
        email: adminUser.email || '',
        profilePicture: adminUser.profilePicture || ''
      });
      
      // ✅ SIMPLE URL CONSTRUCTION
      if (adminUser.profilePicture) {
        const baseUrl = getBaseUrl();
        let imageUrl = '';
        
        if (adminUser.profilePicture.startsWith('/uploads/')) {
          imageUrl = baseUrl + adminUser.profilePicture;
        } else if (adminUser.profilePicture.includes('uploads/')) {
          imageUrl = baseUrl + '/' + adminUser.profilePicture;
        } else {
          imageUrl = baseUrl + '/uploads/' + adminUser.profilePicture;
        }
        
        // Add cache busting
        imageUrl += '?t=' + Date.now();
        setPreviewImage(imageUrl);
      }
    }
  }, [adminUser, isOpen]);

  // ✅ Simple image upload
  const uploadImage = async (file) => {
    setUploadingImage(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Please login again');

      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${getApiUrl()}/auth/upload-profile-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      const result = await res.json();
      console.log('📡 Upload response:', result);

      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Upload failed');
      }

      // ✅ Use 'url' field (same as test upload)
      const imageUrl = result.data?.url || result.data?.imageUrl;
      
      if (!imageUrl) {
        throw new Error('No image URL returned');
      }

      console.log('✅ Image URL:', imageUrl);
      return imageUrl;

    } catch (error) {
      console.error('❌ Upload error:', error);
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    e.target.value = '';

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select a valid image file' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size should be less than 5MB' });
      return;
    }

    try {
      // Local preview
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);

      // Upload to server
      const imageUrl = await uploadImage(file);
      
      // Update form data
      setFormData(prev => ({
        ...prev,
        profilePicture: imageUrl
      }));

      // Update preview with server URL
      const baseUrl = getBaseUrl();
      const fullUrl = baseUrl + imageUrl + '?t=' + Date.now();
      setPreviewImage(fullUrl);

      setMessage({
        type: 'success',
        text: '✅ Profile image uploaded successfully!'
      });

    } catch (error) {
      setMessage({
        type: 'error',
        text: `❌ ${error.message}`
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Please login again');

      const res = await fetch(`${getApiUrl()}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (result.success) {
        const updatedUser = result.data || { ...adminUser, ...formData };
        localStorage.setItem('adminUser', JSON.stringify(updatedUser));
        onUpdate(updatedUser);
        
        setMessage({
          type: 'success',
          text: '✅ Profile updated successfully!'
        });
        
        setTimeout(() => onClose(), 1500);
      } else {
        throw new Error(result.message || 'Update failed');
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: `❌ ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl w-full max-w-md border border-purple-500/20">
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {message.text && (
            <div className={`p-3 rounded-lg text-sm ${
              message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
              'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {message.text}
            </div>
          )}

          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center overflow-hidden border-4 border-slate-700">
                {previewImage ? (
                  <img 
                    src={previewImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.log('Image failed:', e.target.src);
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
              
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-600 transition-colors">
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
            
            <p className="text-gray-400 text-sm text-center mb-2">
              {uploadingImage ? 'Uploading...' : 'Click camera icon to upload'}
            </p>
            
            {/* Debug info */}
            {formData.profilePicture && (
              <div className="p-2 bg-slate-900/50 rounded text-xs text-center">
                <div className="text-gray-500">Current path:</div>
                <div className="text-purple-400 truncate">{formData.profilePicture}</div>
                <a 
                  href={getBaseUrl() + formData.profilePicture}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-[10px] mt-1 inline-block"
                >
                  🔗 Direct link
                </a>
              </div>
            )}
          </div>

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