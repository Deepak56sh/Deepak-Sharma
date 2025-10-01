
// ============================================
// FILE: src/app/admin/about/page.js
// ============================================
'use client';
import { useState } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';

export default function AboutManagement() {
  const [aboutData, setAboutData] = useState({
    title: 'About Us',
    subtitle: 'Crafting digital experiences that inspire and innovate',
    mainHeading: 'We Build Digital Dreams',
    description1: 'We\'re a passionate team of designers, developers, and innovators dedicated to pushing the boundaries of what\'s possible in the digital realm.',
    description2: 'With years of experience and countless successful projects, we transform complex challenges into elegant solutions that drive real results for our clients.',
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

  const handleChange = (e) => {
    setAboutData({ ...aboutData, [e.target.name]: e.target.value });
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

  const handleSave = () => {
    alert('About page updated successfully! (In production, this will update the database)');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">About Page Management</h1>
          <p className="text-gray-400">Update your about page content</p>
        </div>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
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
