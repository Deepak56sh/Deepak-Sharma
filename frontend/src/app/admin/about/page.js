// src/app/admin/about/page.js
'use client';
import { useState, useEffect, useRef } from 'react';
import { Save, Plus, Trash2, Loader2, AlertCircle, Upload, Image as ImageIcon, Link } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AboutManagement() {
  const [aboutData, setAboutData] = useState({
    title: 'About Us',
    subtitle: 'Crafting digital experiences that inspire and innovate',
    mainHeading: 'We Build Digital Dreams',
    description1: '',
    description2: '',
    heroImage: '',
    teamImage: '',
    additionalImages: [],
    stats: [],
    values: []
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);
  const teamFileInputRef = useRef(null);

  // Fetch about data on component mount
  useEffect(() => {
    fetchAboutData();
  }, []);

  const getFullImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url; // already full URL
  return `${API_URL}${url}`; // prepend API url if it's a relative path
};

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/api/about`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch about data');
      }

      const result = await response.json();
      
      if (result.success) {
        setAboutData(result.data);
      }
    } catch (err) {
      console.error('Error fetching about data:', err);
      setError('Failed to load about data. Using default values.');
      // Set default values
      setAboutData({
        title: 'About Us',
        subtitle: 'Crafting digital experiences that inspire and innovate',
        mainHeading: 'We Build Digital Dreams',
        description1: 'We\'re a passionate team of designers, developers, and innovators dedicated to pushing the boundaries of what\'s possible in the digital realm.',
        description2: 'With years of experience and countless successful projects, we transform complex challenges into elegant solutions that drive real results for our clients.',
        heroImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
        teamImage: '',
        additionalImages: [],
        stats: [
          { number: '500+', label: 'Projects Completed' },
          { number: '50+', label: 'Happy Clients' },
          { number: '15+', label: 'Awards Won' },
          { number: '99%', label: 'Satisfaction Rate' }
        ],
        values: [
          {
            title: 'Innovation First',
            description: 'We constantly push boundaries and explore new technologies to deliver cutting-edge solutions.',
            emoji: '🚀'
          },
          {
            title: 'Client Success',
            description: 'Your success is our success. We are committed to exceeding expectations on every project.',
            emoji: '🎯'
          },
          {
            title: 'Quality Driven',
            description: 'We never compromise on quality, ensuring every detail is perfect before delivery.',
            emoji: '⭐'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setAboutData({ ...aboutData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (field, value) => {
    setAboutData({ ...aboutData, [field]: value });
  };

  const handleAdditionalImageChange = (index, field, value) => {
    const newImages = [...aboutData.additionalImages];
    newImages[index][field] = value;
    setAboutData({ ...aboutData, additionalImages: newImages });
  };

  const addAdditionalImage = () => {
    setAboutData({
      ...aboutData,
      additionalImages: [...aboutData.additionalImages, { url: '', caption: '', altText: '' }]
    });
  };

  const deleteAdditionalImage = (index) => {
    setAboutData({
      ...aboutData,
      additionalImages: aboutData.additionalImages.filter((_, i) => i !== index)
    });
  };

  const handleStatChange = (index, field, value) => {
    const newStats = [...aboutData.stats];
    newStats[index][field] = value;
    setAboutData({ ...aboutData, stats: newStats });
  };

  const handleValueChange = (index, field, value) => {
    const newValues = [...aboutData.values];
    newValues[index][field] = value;
    setAboutData({ ...aboutData, values: newValues });
  };

  const addValue = () => {
    setAboutData({
      ...aboutData,
      values: [...aboutData.values, { title: '', description: '', emoji: '✨' }]
    });
  };

  const deleteValue = (index) => {
    setAboutData({
      ...aboutData,
      values: aboutData.values.filter((_, i) => i !== index)
    });
  };

  // Handle file upload
  const handleFileUpload = async (file, field) => {
    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_URL}/api/about/upload`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setAboutData({ ...aboutData, [field]: result.imageUrl });
        setSuccessMessage('Image uploaded successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage('');

      const response = await fetch(`${API_URL}/api/about`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aboutData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage('About page updated successfully! ✅');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error(result.message || 'Failed to update');
      }
    } catch (err) {
      console.error('Error saving about data:', err);
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading about page data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">About Page Management</h1>
          <p className="text-gray-400">Update your about page content and images</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-lg">✓</span>
          </div>
          <p className="text-green-300 font-medium">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* Image Management Section */}
      <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-6 space-y-6">
        <h2 className="text-xl font-bold text-white mb-4">Image Management</h2>
        
        {/* Hero Image */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Hero Image</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-gray-300 mb-2 font-medium">Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aboutData.heroImage}
                  onChange={(e) => handleImageChange('heroImage', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'heroImage')}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-3 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  Upload
                </button>
              </div>
              <p className="text-sm text-gray-400">Enter image URL or upload from your device</p>
            </div>
            <div className="flex items-center justify-center">
              {aboutData.heroImage ? (
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                  <img 
                    src={getFullImageUrl(aboutData.heroImage)}
                    alt="Hero preview" 
                    className="relative rounded-2xl shadow-2xl w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-slate-900/50 border-2 border-dashed border-purple-500/20 rounded-2xl flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                    <p>No hero image set</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Team Image */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Team Image</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-gray-300 mb-2 font-medium">Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aboutData.teamImage}
                  onChange={(e) => handleImageChange('teamImage', e.target.value)}
                  placeholder="https://example.com/team-image.jpg"
                  className="flex-1 px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
                <input
                  type="file"
                  ref={teamFileInputRef}
                  onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'teamImage')}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => teamFileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-3 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  Upload
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              {aboutData.teamImage ? (
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                  <img 
                    src={getFullImageUrl(aboutData.teamImage)} 
                    alt="Team preview" 
                    className="relative rounded-2xl shadow-2xl w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-slate-900/50 border-2 border-dashed border-purple-500/20 rounded-2xl flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                    <p>No team image set</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Images */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Additional Images</h3>
            <button
              onClick={addAdditionalImage}
              className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Image
            </button>
          </div>

          <div className="space-y-4">
            {aboutData.additionalImages.map((image, index) => (
              <div key={index} className="p-4 bg-slate-900/50 rounded-lg border border-purple-500/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-white font-medium">Additional Image {index + 1}</h4>
                  <button
                    onClick={() => deleteAdditionalImage(index)}
                    className="w-8 h-8 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={image.url}
                      onChange={(e) => handleAdditionalImageChange(index, 'url', e.target.value)}
                      placeholder="Image URL"
                      className="w-full px-4 py-2 bg-slate-800 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    />
                    <input
                      type="text"
                      value={image.caption}
                      onChange={(e) => handleAdditionalImageChange(index, 'caption', e.target.value)}
                      placeholder="Image caption"
                      className="w-full px-4 py-2 bg-slate-800 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    />
                    <input
                      type="text"
                      value={image.altText}
                      onChange={(e) => handleAdditionalImageChange(index, 'altText', e.target.value)}
                      placeholder="Alt text for accessibility"
                      className="w-full px-4 py-2 bg-slate-800 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    {image.url ? (
                      <img 
                        src={image.url} 
                        alt={image.altText || 'Additional image'} 
                        className="rounded-lg w-full h-32 object-cover"
                      />
                    ) : (
                      <div className="w-full h-32 bg-slate-800 border-2 border-dashed border-purple-500/20 rounded-lg flex items-center justify-center">
                        <div className="text-center text-gray-400">
                          <ImageIcon className="w-8 h-8 mx-auto mb-1" />
                          <p className="text-sm">No image</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-6 space-y-4">
        <h2 className="text-xl font-bold text-white mb-4">Basic Information</h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Page Title</label>
            <input
              type="text"
              name="title"
              value={aboutData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Subtitle</label>
            <input
              type="text"
              name="subtitle"
              value={aboutData.subtitle}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-300 mb-2 font-medium">Main Heading</label>
          <input
            type="text"
            name="mainHeading"
            value={aboutData.mainHeading}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2 font-medium">Description Paragraph 1</label>
          <textarea
            name="description1"
            value={aboutData.description1}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2 font-medium">Description Paragraph 2</label>
          <textarea
            name="description2"
            value={aboutData.description2}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 resize-none"
          />
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Statistics</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {aboutData.stats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <input
                type="text"
                value={stat.number}
                onChange={(e) => handleStatChange(index, 'number', e.target.value)}
                placeholder="500+"
                className="w-full px-4 py-2 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
              <input
                type="text"
                value={stat.label}
                onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                placeholder="Projects Completed"
                className="w-full px-4 py-2 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Core Values */}
      <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Core Values</h2>
          <button
            onClick={addValue}
            className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Value
          </button>
        </div>

        <div className="space-y-4">
          {aboutData.values.map((value, index) => (
            <div key={index} className="p-4 bg-slate-900/50 rounded-lg border border-purple-500/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{value.emoji}</span>
                <button
                  onClick={() => deleteValue(index)}
                  className="w-8 h-8 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={value.emoji}
                  onChange={(e) => handleValueChange(index, 'emoji', e.target.value)}
                  placeholder="🚀"
                  className="px-4 py-2 bg-slate-800 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
                <input
                  type="text"
                  value={value.title}
                  onChange={(e) => handleValueChange(index, 'title', e.target.value)}
                  placeholder="Value Title"
                  className="md:col-span-2 px-4 py-2 bg-slate-800 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              
              <textarea
                value={value.description}
                onChange={(e) => handleValueChange(index, 'description', e.target.value)}
                rows="2"
                placeholder="Value description..."
                className="w-full px-4 py-2 bg-slate-800 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}