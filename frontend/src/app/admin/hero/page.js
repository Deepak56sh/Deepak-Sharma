// ============================================
// FILE: src/app/admin/hero/page.js
// ============================================
'use client';
import { useState } from 'react';
import { Save, Eye } from 'lucide-react';

export default function HeroManagement() {
  const [heroData, setHeroData] = useState({
    badge: 'Welcome to the Future',
    mainTitle: 'Digital Innovation',
    subTitle: 'Starts Here',
    description: 'Transform your vision into reality with cutting-edge technology and stunning design that captivates your audience',
    primaryButton: 'Explore Services',
    secondaryButton: 'Get in Touch'
  });

  const handleChange = (e) => {
    setHeroData({ ...heroData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    alert('Hero section updated! (In production, this will update the database)');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Hero Section</h1>
          <p className="text-gray-400">Manage your homepage hero content</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-slate-800 border border-purple-500/20 rounded-lg text-white hover:bg-slate-700 transition-all flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-6 space-y-6">
        <div>
          <label className="block text-gray-300 mb-2 font-medium">Badge Text</label>
          <input
            type="text"
            name="badge"
            value={heroData.badge}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Main Title</label>
            <input
              type="text"
              name="mainTitle"
              value={heroData.mainTitle}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium">Sub Title</label>
            <input
              type="text"
              name="subTitle"
              value={heroData.subTitle}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-300 mb-2 font-medium">Description</label>
          <textarea
            name="description"
            value={heroData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 resize-none"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Primary Button Text</label>
            <input
              type="text"
              name="primaryButton"
              value={heroData.primaryButton}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium">Secondary Button Text</label>
            <input
              type="text"
              name="secondaryButton"
              value={heroData.secondaryButton}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
