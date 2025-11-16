// src/app/admin/about/page.js - FULLY RESPONSIVE VERSION
'use client';
import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function ManageAbout() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Get token function
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api'}/about`);
      
      if (!res.ok) throw new Error('Failed to fetch about data');
      
      const data = await res.json();
      setAboutData(data.data);
    } catch (error) {
      console.error('Error fetching about data:', error);
      setMessage({ type: 'error', text: 'Failed to load about data' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setAboutData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
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

  const handleImageUpload = async (file, imageType) => {
    try {
      const token = getToken();
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api'}/about/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setAboutData(prev => ({
          ...prev,
          [imageType]: data.data.imageUrl
        }));
        setMessage({ type: 'success', text: 'Image uploaded successfully' });
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      setMessage({ type: 'error', text: 'Image upload failed' });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api'}/about`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(aboutData)
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'About page updated successfully' });
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Update failed');
      }
    } catch (error) {
      console.error('Save error:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 sm:py-16 lg:py-20">
        <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 animate-spin" />
        <span className="ml-2 sm:ml-3 text-gray-400 text-sm sm:text-base">Loading about data...</span>
      </div>
    );
  }

  if (!aboutData) {
    return (
      <div className="text-center py-12 sm:py-16 lg:py-20">
        <p className="text-red-400 text-sm sm:text-base">Failed to load about data</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6 p-4 sm:p-5 lg:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">Manage About Page</h1>
          <p className="text-gray-400 text-xs sm:text-sm">Update your about page content and images</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base"
        >
          {saving ? (
            <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
          ) : (
            <Save className="w-3 h-3 sm:w-4 sm:h-4" />
          )}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`p-3 sm:p-4 rounded-lg text-xs sm:text-sm ${
          message.type === 'success' 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          {message.text}
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-4 sm:p-5 lg:p-6">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 sm:mb-5 lg:mb-6">Hero Section</h2>
        
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
          {/* Hero Image */}
          <div>
            <label className="block text-gray-300 mb-1.5 sm:mb-2 font-medium text-sm sm:text-base">Hero Image</label>
            <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-3 sm:p-4 text-center">
              <img 
                src={aboutData.heroImage} 
                alt="Hero preview" 
                className="w-full h-32 sm:h-36 lg:h-48 object-cover rounded-lg mb-2 sm:mb-3"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) handleImageUpload(file, 'heroImage');
                }}
                className="hidden"
                id="heroImage"
              />
              <label htmlFor="heroImage" className="cursor-pointer text-purple-400 hover:text-purple-300 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
                Change Hero Image
              </label>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-gray-300 mb-1.5 sm:mb-2 font-medium text-sm sm:text-base">Title</label>
              <input
                type="text"
                value={aboutData.title}
                onChange={(e) => setAboutData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 bg-slate-700 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1.5 sm:mb-2 font-medium text-sm sm:text-base">Subtitle</label>
              <input
                type="text"
                value={aboutData.subtitle}
                onChange={(e) => setAboutData(prev => ({ ...prev, subtitle: e.target.value }))}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 bg-slate-700 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1.5 sm:mb-2 font-medium text-sm sm:text-base">Main Heading</label>
              <input
                type="text"
                value={aboutData.mainHeading}
                onChange={(e) => setAboutData(prev => ({ ...prev, mainHeading: e.target.value }))}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 bg-slate-700 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 text-sm sm:text-base"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-4 sm:p-5 lg:p-6">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 sm:mb-5 lg:mb-6">Description</h2>
        
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
          <div>
            <label className="block text-gray-300 mb-1.5 sm:mb-2 font-medium text-sm sm:text-base">Description 1</label>
            <textarea
              rows="3"
              value={aboutData.description1}
              onChange={(e) => setAboutData(prev => ({ ...prev, description1: e.target.value }))}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 bg-slate-700 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1.5 sm:mb-2 font-medium text-sm sm:text-base">Description 2</label>
            <textarea
              rows="3"
              value={aboutData.description2}
              onChange={(e) => setAboutData(prev => ({ ...prev, description2: e.target.value }))}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 bg-slate-700 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 text-sm sm:text-base"
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-4 sm:p-5 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 lg:mb-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Statistics</h2>
          <button
            onClick={() => addArrayItem('stats', { number: '', label: '' })}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            Add Stat
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
          {aboutData.stats.map((stat, index) => (
            <div key={index} className="flex gap-3 sm:gap-4 items-start p-3 sm:p-4 bg-slate-700/50 rounded-lg">
              <div className="flex-1 grid grid-cols-2 gap-2 sm:gap-3">
                <input
                  type="text"
                  placeholder="Number"
                  value={stat.number}
                  onChange={(e) => handleArrayChange('stats', index, 'number', e.target.value)}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-600 border border-purple-500/20 rounded text-white focus:outline-none focus:border-purple-500 text-sm"
                />
                <input
                  type="text"
                  placeholder="Label"
                  value={stat.label}
                  onChange={(e) => handleArrayChange('stats', index, 'label', e.target.value)}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-600 border border-purple-500/20 rounded text-white focus:outline-none focus:border-purple-500 text-sm"
                />
              </div>
              <button
                onClick={() => removeArrayItem('stats', index)}
                className="p-1.5 sm:p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors flex-shrink-0"
              >
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-4 sm:p-5 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 lg:mb-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Core Values</h2>
          <button
            onClick={() => addArrayItem('values', { title: '', description: '', emoji: '🚀' })}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            Add Value
          </button>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {aboutData.values.map((value, index) => (
            <div key={index} className="p-3 sm:p-4 bg-slate-700/50 rounded-lg">
              <div className="flex gap-3 sm:gap-4 mb-2 sm:mb-3">
                <input
                  type="text"
                  placeholder="Emoji"
                  value={value.emoji}
                  onChange={(e) => handleArrayChange('values', index, 'emoji', e.target.value)}
                  className="w-12 sm:w-16 px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-600 border border-purple-500/20 rounded text-white focus:outline-none focus:border-purple-500 text-sm text-center"
                />
                <input
                  type="text"
                  placeholder="Title"
                  value={value.title}
                  onChange={(e) => handleArrayChange('values', index, 'title', e.target.value)}
                  className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-600 border border-purple-500/20 rounded text-white focus:outline-none focus:border-purple-500 text-sm"
                />
                <button
                  onClick={() => removeArrayItem('values', index)}
                  className="p-1.5 sm:p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
              <textarea
                placeholder="Description"
                value={value.description}
                onChange={(e) => handleArrayChange('values', index, 'description', e.target.value)}
                rows="2"
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-600 border border-purple-500/20 rounded text-white focus:outline-none focus:border-purple-500 text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Additional Images Section */}
      <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-4 sm:p-5 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 lg:mb-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Gallery Images</h2>
          <button
            onClick={() => addArrayItem('additionalImages', { url: '', caption: '', altText: '' })}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            Add Image
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
          {aboutData.additionalImages.map((image, index) => (
            <div key={index} className="p-3 sm:p-4 bg-slate-700/50 rounded-lg">
              <div className="flex gap-2 sm:gap-3 mb-2 sm:mb-3">
                <input
                  type="text"
                  placeholder="Image URL"
                  value={image.url}
                  onChange={(e) => handleArrayChange('additionalImages', index, 'url', e.target.value)}
                  className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-600 border border-purple-500/20 rounded text-white focus:outline-none focus:border-purple-500 text-sm"
                />
                <button
                  onClick={() => removeArrayItem('additionalImages', index)}
                  className="p-1.5 sm:p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Caption (optional)"
                value={image.caption}
                onChange={(e) => handleArrayChange('additionalImages', index, 'caption', e.target.value)}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-600 border border-purple-500/20 rounded text-white focus:outline-none focus:border-purple-500 text-sm mb-2"
              />
              <input
                type="text"
                placeholder="Alt Text"
                value={image.altText}
                onChange={(e) => handleArrayChange('additionalImages', index, 'altText', e.target.value)}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-600 border border-purple-500/20 rounded text-white focus:outline-none focus:border-purple-500 text-sm"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}