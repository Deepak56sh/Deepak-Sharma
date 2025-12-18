'use client';
import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function ManageAbout() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // ✅ CRITICAL FIX: Separate API URL (with /api) from Base URL (without /api)
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

  // ✅ CRITICAL FIX: Use base URL without /api for image access
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

    // Clean the path
    let cleanPath = imagePath;
    
    // Remove /api if present (shouldn't be, but just in case)
    if (cleanPath.startsWith('/api')) {
      cleanPath = cleanPath.replace('/api', '');
    }
    
    // Ensure /uploads/ prefix
    if (!cleanPath.startsWith('/uploads/')) {
      cleanPath = '/uploads/' + cleanPath.replace(/^\/+/, '');
    }

    const finalUrl = BASE_URL + cleanPath;
    console.log('🖼️ Constructing image URL:', {
      input: imagePath,
      baseUrl: BASE_URL,
      cleanPath: cleanPath,
      output: finalUrl
    });
    
    return finalUrl;
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    setAboutData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addArrayItem = (arrayName, template) => {
    setAboutData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], template]
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    setAboutData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
  };

  // ✅ FIXED: Added missing handleSave function
  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = getToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }

      console.log('💾 Saving about data:', aboutData);

      const res = await fetch(`${getApiUrl()}/about`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(aboutData)
      });

      const result = await res.json();
      console.log('💾 Save result:', result);

      if (res.ok && result.success) {
        setMessage({
          type: 'success',
          text: '✅ About page updated successfully!'
        });

        setTimeout(() => {
          fetchAboutData();
        }, 1000);

      } else {
        throw new Error(result.message || 'Update failed');
      }
    } catch (error) {
      console.error('❌ Save error:', error);
      setMessage({
        type: 'error',
        text: `❌ Save failed: ${error.message}`
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 px-4">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        <span className="ml-3 text-gray-400 text-sm sm:text-base">Loading about data...</span>
      </div>
    );
  }

  if (!aboutData) {
    return (
      <div className="text-center py-20 px-4">
        <p className="text-red-400 text-sm sm:text-base">Failed to load about data</p>
        <button
          onClick={fetchAboutData}
          className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm sm:text-base"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 mx-auto">
      {/* Header - Fully Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 truncate">
            Manage About Page
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm">
            Update your about page content and team image
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base shrink-0"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Message - Fully Responsive */}
      {message.text && (
        <div className={`p-3 sm:p-4 rounded-lg text-xs sm:text-sm break-words ${
          message.type === 'success'
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          {message.text}
        </div>
      )}

      {/* Content Section - Fully Responsive */}
      <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-4 sm:p-5 md:p-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Content</h2>

        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-gray-300 mb-2 font-medium text-sm sm:text-base">Title</label>
            <input
              type="text"
              value={aboutData.title || ''}
              onChange={(e) => setAboutData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 text-sm sm:text-base"
              placeholder="About Us"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium text-sm sm:text-base">Subtitle</label>
            <input
              type="text"
              value={aboutData.subtitle || ''}
              onChange={(e) => setAboutData(prev => ({ ...prev, subtitle: e.target.value }))}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 text-sm sm:text-base"
              placeholder="Crafting digital experiences that inspire"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium text-sm sm:text-base">Main Heading</label>
            <input
              type="text"
              value={aboutData.mainHeading || ''}
              onChange={(e) => setAboutData(prev => ({ ...prev, mainHeading: e.target.value }))}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 text-sm sm:text-base"
              placeholder="We Build Digital Dreams"
            />
          </div>
        </div>
      </div>

      {/* Team Image Section - Fully Responsive */}
      <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-4 sm:p-5 md:p-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Team Image</h2>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start">
          {/* Image Preview - Responsive */}
          <div className="w-full lg:w-auto lg:flex-shrink-0">
            <div className="w-full max-w-[200px] mx-auto lg:mx-0 aspect-square rounded-lg border-2 border-dashed border-purple-500/30 bg-slate-800/50 overflow-hidden">
              {aboutData.teamImage ? (
                <img
                  src={getFullImageUrl(aboutData.teamImage)}
                  alt="Team preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const placeholder = 'https://via.placeholder.com/200/1f2937/9ca3af?text=Image+Error';
                    if (e.target.src !== placeholder) {
                      console.error('❌ Image failed to load:', e.target.src);
                      e.target.src = placeholder;
                    }
                  }}
                  onLoad={(e) => {
                    console.log('✅ Image loaded successfully:', e.target.src);
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500" />
                </div>
              )}
            </div>
            {/* Debug Info - Responsive */}
            <div className="mt-2 p-2 bg-slate-900 rounded text-[10px] sm:text-xs font-mono overflow-hidden">
              <div className="text-gray-500">Stored path:</div>
              <div className="text-purple-400 break-all line-clamp-2">{aboutData.teamImage || 'None'}</div>
              <div className="text-gray-500 mt-1">Full URL:</div>
              <div className="text-green-400 break-all line-clamp-2">
                {getFullImageUrl(aboutData.teamImage)}
              </div>
            </div>
          </div>

          {/* Upload Controls - Responsive */}
          <div className="flex-1 w-full space-y-3">
            <div>
              <label className="block text-gray-400 text-xs sm:text-sm mb-2">Upload New Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={uploadingImage}
                className="w-full text-xs sm:text-sm text-gray-400 
                  file:mr-2 sm:file:mr-4 
                  file:py-1.5 sm:file:py-2 
                  file:px-3 sm:file:px-4 
                  file:rounded-full file:border-0 
                  file:text-xs sm:file:text-sm file:font-semibold 
                  file:bg-purple-500/20 file:text-purple-400 
                  hover:file:bg-purple-500/30 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-xs sm:text-sm mb-2">Or Enter Image URL</label>
              <input
                type="url"
                value={aboutData.teamImage || ''}
                onChange={(e) => setAboutData(prev => ({ ...prev, teamImage: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-800/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 text-xs sm:text-sm"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {uploadingImage && (
              <div className="flex items-center gap-2 text-purple-400 text-xs sm:text-sm">
                <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                Uploading image...
              </div>
            )}

            <div className="text-[10px] sm:text-xs text-gray-500 space-y-1">
              <div>✓ Accepted: JPEG, PNG, WebP</div>
              <div>✓ Max size: 5MB</div>
              <div className="text-yellow-500">⚠ Click "Save Changes" after upload</div>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section - Fully Responsive */}
      <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-4 sm:p-5 md:p-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Description</h2>

        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-gray-300 mb-2 font-medium text-sm sm:text-base">Description 1</label>
            <textarea
              rows="4"
              value={aboutData.description1 || ''}
              onChange={(e) => setAboutData(prev => ({ ...prev, description1: e.target.value }))}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 resize-vertical text-sm sm:text-base"
              placeholder="First paragraph of description..."
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium text-sm sm:text-base">Description 2</label>
            <textarea
              rows="4"
              value={aboutData.description2 || ''}
              onChange={(e) => setAboutData(prev => ({ ...prev, description2: e.target.value }))}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 resize-vertical text-sm sm:text-base"
              placeholder="Second paragraph of description..."
            />
          </div>
        </div>
      </div>

      {/* Stats Section - Fully Responsive */}
      <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-4 sm:p-5 md:p-6">
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Statistics</h2>
          <button
            onClick={() => addArrayItem('stats', { number: '', label: '' })}
            className="w-full xs:w-auto px-3 sm:px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm shrink-0"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            Add Stat
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {aboutData.stats.map((stat, index) => (
            <div key={index} className="flex gap-2 sm:gap-4 items-start p-3 sm:p-4 bg-slate-700/50 rounded-lg">
              <div className="flex-1 grid grid-cols-2 gap-2 sm:gap-3">
                <input
                  type="text"
                  placeholder="Number"
                  value={stat.number}
                  onChange={(e) => handleArrayChange('stats', index, 'number', e.target.value)}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-600 border border-purple-500/20 rounded text-white focus:outline-none focus:border-purple-500 text-xs sm:text-sm"
                />
                <input
                  type="text"
                  placeholder="Label"
                  value={stat.label}
                  onChange={(e) => handleArrayChange('stats', index, 'label', e.target.value)}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-600 border border-purple-500/20 rounded text-white focus:outline-none focus:border-purple-500 text-xs sm:text-sm"
                />
              </div>
              <button
                onClick={() => removeArrayItem('stats', index)}
                className="p-1.5 sm:p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors shrink-0"
                aria-label="Delete stat"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Values Section - Fully Responsive */}
      <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-4 sm:p-5 md:p-6">
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Core Values</h2>
          <button
            onClick={() => addArrayItem('values', { title: '', description: '', emoji: '🚀' })}
            className="w-full xs:w-auto px-3 sm:px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm shrink-0"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            Add Value
          </button>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {aboutData.values.map((value, index) => (
            <div key={index} className="p-3 sm:p-4 bg-slate-700/50 rounded-lg">
              <div className="flex gap-2 sm:gap-4 mb-2 sm:mb-3">
                <input
                  type="text"
                  placeholder="🚀"
                  value={value.emoji}
                  onChange={(e) => handleArrayChange('values', index, 'emoji', e.target.value)}
                  className="w-12 sm:w-16 px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-600 border border-purple-500/20 rounded text-white focus:outline-none focus:border-purple-500 text-center text-sm sm:text-base shrink-0"
                />
                <input
                  type="text"
                  placeholder="Title"
                  value={value.title}
                  onChange={(e) => handleArrayChange('values', index, 'title', e.target.value)}
                  className="flex-1 min-w-0 px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-600 border border-purple-500/20 rounded text-white focus:outline-none focus:border-purple-500 text-xs sm:text-sm"
                />
                <button
                  onClick={() => removeArrayItem('values', index)}
                  className="p-1.5 sm:p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors shrink-0"
                  aria-label="Delete value"
                >
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
              <textarea
                placeholder="Description"
                value={value.description}
                onChange={(e) => handleArrayChange('values', index, 'description', e.target.value)}
                rows="2"
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-600 border border-purple-500/20 rounded text-white focus:outline-none focus:border-purple-500 resize-vertical text-xs sm:text-sm"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}