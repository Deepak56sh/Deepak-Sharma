'use client';
import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function ManageAbout() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // ✅ FIXED: Correct API URL
  const getApiUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';
  };

  const getBaseUrl = () => {
    // Base URL for static files (WITHOUT /api path)
    return process.env.NEXT_PUBLIC_BACKEND_URL || 'https://my-site-backend-0661.onrender.com';
  };

  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminToken');
    }
    return null;
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const res = await fetch(`${getApiUrl()}/about`);

      if (!res.ok) throw new Error('Failed to fetch about data');

      const data = await res.json();
      console.log('📥 Fetched about data:', data.data);
      setAboutData(data.data);
    } catch (error) {
      console.error('Error fetching about data:', error);
      setMessage({ type: 'error', text: 'Failed to load about data' });
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file) => {
    setUploadingImage(true);
    setMessage({ type: '', text: '' });

    try {
      const token = getToken();
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      console.log('📤 Starting upload...');
      console.log('📁 File:', file.name, file.type, file.size);

      const formData = new FormData();
      formData.append('image', file);

      const uploadUrl = `${getApiUrl()}/about/upload`;
      console.log('🔗 Upload URL:', uploadUrl);

      const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      console.log('📡 Response status:', res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Upload failed:', errorText);
        throw new Error(`Upload failed: ${res.status} - ${errorText}`);
      }

      const result = await res.json();
      console.log('✅ Upload result:', result);

      if (result.success && result.data && result.data.imageUrl) {
        return result.data.imageUrl; // Should be: /uploads/about-123.png
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

    console.log('🖼️ Image selected:', file.name);

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select a valid image file' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size should be less than 5MB' });
      return;
    }

    try {
      const imageUrl = await uploadImage(file);

      console.log('✅ Image URL received:', imageUrl);

      setAboutData(prev => ({
        ...prev,
        teamImage: imageUrl
      }));

      setMessage({
        type: 'success',
        text: '✅ Image uploaded successfully! Click Save to update.'
      });

    } catch (error) {
      console.error('❌ Image processing error:', error);
      setMessage({
        type: 'error',
        text: `❌ Upload failed: ${error.message}`
      });
    }
  };

  // ✅ FIXED: Simplified image URL construction
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) {
      return 'https://via.placeholder.com/200/1f2937/9ca3af?text=No+Image';
    }

    // If already full URL
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // ✅ Use BASE URL (without /api) for static files
    const BASE_URL = getBaseUrl();

    // Clean the path - ensure it starts with /uploads/
    let cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    
    // If it doesn't start with /uploads/, add it
    if (!cleanPath.startsWith('/uploads/')) {
      cleanPath = '/uploads' + (cleanPath.startsWith('/') ? '' : '/') + cleanPath;
    }

    // Remove any double slashes
    cleanPath = cleanPath.replace(/([^:]\/)\/+/g, '$1');
    
    const finalUrl = BASE_URL + cleanPath;
    console.log('🖼️ Constructing image URL:', {
      input: imagePath,
      baseUrl: BASE_URL,
      cleanPath: cleanPath,
      output: finalUrl
    });
    
    return finalUrl;
  };

  // ... rest of your admin code remains the same (handleArrayChange, addArrayItem, etc.)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Manage About Page</h1>
          <p className="text-gray-400 text-sm">Update your about page content and team image</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`p-4 rounded-lg ${message.type === 'success'
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
          {message.text}
        </div>
      )}

      {/* Team Image Section - Updated with better debug info */}
      <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Team Image</h2>

        <div className="flex gap-6 items-start">
          {/* Image Preview */}
          <div className="flex-shrink-0">
            <div className="w-48 h-48 rounded-lg border-2 border-dashed border-purple-500/30 bg-slate-800/50 overflow-hidden">
              {aboutData?.teamImage ? (
                <img
                  src={getFullImageUrl(aboutData.teamImage)}
                  alt="Team preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('❌ Image failed to load:', e.target.src);
                    e.target.src = 'https://via.placeholder.com/200/1f2937/9ca3af?text=Image+Error';
                  }}
                  onLoad={() => console.log('✅ Admin image loaded successfully')}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-500" />
                </div>
              )}
            </div>
            {/* Debug Info - Enhanced */}
            <div className="mt-2 p-2 bg-slate-900 rounded text-xs font-mono">
              <div className="text-gray-500">Stored path:</div>
              <div className="text-purple-400 break-all">{aboutData?.teamImage || 'None'}</div>
              <div className="text-gray-500 mt-1">Constructed URL:</div>
              <div className="text-green-400 break-all">
                {aboutData?.teamImage ? getFullImageUrl(aboutData.teamImage) : 'No image'}
              </div>
            </div>
          </div>

          {/* Upload Controls */}
          <div className="flex-1 space-y-3">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Upload New Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={uploadingImage}
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500/20 file:text-purple-400 hover:file:bg-purple-500/30 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Or Enter Image URL</label>
              <input
                type="url"
                value={aboutData.teamImage || ''}
                onChange={(e) => setAboutData(prev => ({ ...prev, teamImage: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-800/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 text-sm"
                placeholder="https://example.com/image.jpg or /uploads/image.jpg"
              />
            </div>

            {uploadingImage && (
              <div className="flex items-center gap-2 text-purple-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading image...
              </div>
            )}

            <div className="text-xs text-gray-500 space-y-1">
              <div>✓ Accepted: JPEG, PNG, WebP</div>
              <div>✓ Max size: 5MB</div>
              <div className="text-yellow-500">⚠ Click "Save Changes" after upload</div>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Description</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Description 1</label>
            <textarea
              rows="4"
              value={aboutData.description1 || ''}
              onChange={(e) => setAboutData(prev => ({ ...prev, description1: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-700 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 resize-vertical"
              placeholder="First paragraph of description..."
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium">Description 2</label>
            <textarea
              rows="4"
              value={aboutData.description2 || ''}
              onChange={(e) => setAboutData(prev => ({ ...prev, description2: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-700 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 resize-vertical"
              placeholder="Second paragraph of description..."
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Statistics</h2>
          <button
            onClick={() => addArrayItem('stats', { number: '', label: '' })}
            className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Stat
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {aboutData.stats.map((stat, index) => (
            <div key={index} className="flex gap-4 items-start p-4 bg-slate-700/50 rounded-lg">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Number"
                  value={stat.number}
                  onChange={(e) => handleArrayChange('stats', index, 'number', e.target.value)}
                  className="px-3 py-2 bg-slate-600 border border-purple-500/20 rounded text-white focus:outline-none focus:border-purple-500"
                />
                <input
                  type="text"
                  placeholder="Label"
                  value={stat.label}
                  onChange={(e) => handleArrayChange('stats', index, 'label', e.target.value)}
                  className="px-3 py-2 bg-slate-600 border border-purple-500/20 rounded text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <button
                onClick={() => removeArrayItem('stats', index)}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Core Values</h2>
          <button
            onClick={() => addArrayItem('values', { title: '', description: '', emoji: '🚀' })}
            className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Value
          </button>
        </div>

        <div className="space-y-4">
          {aboutData.values.map((value, index) => (
            <div key={index} className="p-4 bg-slate-700/50 rounded-lg">
              <div className="flex gap-4 mb-3">
                <input
                  type="text"
                  placeholder="Emoji"
                  value={value.emoji}
                  onChange={(e) => handleArrayChange('values', index, 'emoji', e.target.value)}
                  className="w-16 px-3 py-2 bg-slate-600 border border-purple-500/20 rounded text-white focus:outline-none focus:border-purple-500 text-center"
                />
                <input
                  type="text"
                  placeholder="Title"
                  value={value.title}
                  onChange={(e) => handleArrayChange('values', index, 'title', e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-600 border border-purple-500/20 rounded text-white focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={() => removeArrayItem('values', index)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <textarea
                placeholder="Description"
                value={value.description}
                onChange={(e) => handleArrayChange('values', index, 'description', e.target.value)}
                rows="2"
                className="w-full px-3 py-2 bg-slate-600 border border-purple-500/20 rounded text-white focus:outline-none focus:border-purple-500 resize-vertical"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}