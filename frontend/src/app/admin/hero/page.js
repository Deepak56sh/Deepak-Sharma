// src/app/admin/hero/page.js - FIXED SYNTAX
'use client';
import { useState, useEffect } from 'react';
import { Save, Eye, Loader2, AlertCircle, Link as LinkIcon, ExternalLink } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com';

export default function HeroManagement() {
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch hero data on component mount
  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/api/hero`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch hero data');
      }

      const result = await response.json();
      
      if (result.success) {
        setHeroData(result.data);
      }
    } catch (err) {
      console.error('Error fetching hero data:', err);
      setError('Failed to load hero data. Using default values.');
      // Set default data if API fails
      setHeroData({
        badge: 'Welcome to the Future',
        mainTitle: 'Digital Innovation',
        subTitle: 'Starts Here',
        description: 'Transform your vision into reality with cutting-edge technology and stunning design that captivates your audience',
        primaryButton: 'Explore Services',
        primaryButtonType: 'page',
        primaryButtonLink: '/services',
        secondaryButton: 'Get in Touch',
        secondaryButtonType: 'page',
        secondaryButtonLink: '/contact'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setHeroData({ ...heroData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage('');

      const response = await fetch(`${API_URL}/api/hero`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(heroData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage('Hero section updated successfully! ✅');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error(result.message || 'Failed to update');
      }
    } catch (err) {
      console.error('Error saving hero data:', err);
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !heroData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading hero data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Hero Section Management</h1>
          <p className="text-gray-400">Manage your homepage hero content and button links</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-slate-800 border border-purple-500/20 rounded-lg text-white hover:bg-slate-700 transition-all flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
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

      {/* Content Management Section */}
      <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-6 space-y-6">
        <div>
          <label className="block text-gray-300 mb-2 font-medium">Badge Text</label>
          <input
            type="text"
            name="badge"
            value={heroData.badge || ''}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            placeholder="Welcome to the Future"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Main Title</label>
            <input
              type="text"
              name="mainTitle"
              value={heroData.mainTitle || ''}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
              placeholder="Digital Innovation"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium">Sub Title</label>
            <input
              type="text"
              name="subTitle"
              value={heroData.subTitle || ''}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
              placeholder="Starts Here"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-300 mb-2 font-medium">Description</label>
          <textarea
            name="description"
            value={heroData.description || ''}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 resize-none"
            placeholder="Transform your vision into reality with cutting-edge technology and stunning design that captivates your audience"
          />
        </div>

        {/* Primary Button Settings */}
        <div className="border-t border-purple-500/20 pt-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-purple-400" />
            Primary Button Settings
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Button Text</label>
              <input
                type="text"
                name="primaryButton"
                value={heroData.primaryButton || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="Explore Services"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Link Type</label>
              <select
                name="primaryButtonType"
                value={heroData.primaryButtonType || 'page'}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                <option value="page">Internal Page</option>
                <option value="external">External URL</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                {heroData.primaryButtonType === 'external' ? 'External URL' : 'Page Link'}
              </label>
              <input
                type="text"
                name="primaryButtonLink"
                value={heroData.primaryButtonLink || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder={heroData.primaryButtonType === 'external' ? 'https://example.com' : '/services'}
              />
            </div>
          </div>
        </div>

        {/* Secondary Button Settings */}
        <div className="border-t border-purple-500/20 pt-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-purple-400" />
            Secondary Button Settings
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Button Text</label>
              <input
                type="text"
                name="secondaryButton"
                value={heroData.secondaryButton || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="Get in Touch"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Link Type</label>
              <select
                name="secondaryButtonType"
                value={heroData.secondaryButtonType || 'page'}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                <option value="page">Internal Page</option>
                <option value="external">External URL</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                {heroData.secondaryButtonType === 'external' ? 'External URL' : 'Page Link'}
              </label>
              <input
                type="text"
                name="secondaryButtonLink"
                value={heroData.secondaryButtonLink || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder={heroData.secondaryButtonType === 'external' ? 'https://example.com' : '/contact'}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Live Preview</h2>
        <div className="bg-slate-900/50 rounded-lg p-6 border border-purple-500/10">
          <div className="text-center">
            <div className="inline-block mb-4 px-4 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full">
              <span className="text-purple-300 text-sm">{heroData.badge}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {heroData.mainTitle} <span className="text-purple-400">{heroData.subTitle}</span>
            </h1>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              {heroData.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="px-6 py-2 bg-purple-500 text-white rounded-lg flex items-center gap-2">
                {heroData.primaryButton}
                {heroData.primaryButtonType === 'external' && <ExternalLink className="w-4 h-4" />}
              </button>
              <button className="px-6 py-2 bg-slate-700 text-white border border-purple-500/30 rounded-lg flex items-center gap-2">
                {heroData.secondaryButton}
                {heroData.secondaryButtonType === 'external' && <ExternalLink className="w-4 h-4" />}
              </button>
            </div>
            <div className="mt-4 text-sm text-gray-400">
              <p>Primary: {heroData.primaryButtonLink}</p>
              <p>Secondary: {heroData.secondaryButtonLink}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}