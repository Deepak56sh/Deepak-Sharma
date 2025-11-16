// FILE: src/components/admin/AdminFooterManager.js
'use client';
import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Github, Twitter, Linkedin, Mail, Facebook, Instagram, Youtube } from 'lucide-react';

const socialIcons = [
  { value: 'Github', label: 'GitHub', icon: Github },
  { value: 'Twitter', label: 'Twitter', icon: Twitter },
  { value: 'Linkedin', label: 'LinkedIn', icon: Linkedin },
  { value: 'Mail', label: 'Email', icon: Mail },
  { value: 'Facebook', label: 'Facebook', icon: Facebook },
  { value: 'Instagram', label: 'Instagram', icon: Instagram },
  { value: 'Youtube', label: 'YouTube', icon: Youtube }
];

export default function AdminFooterManager() {
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('https://my-site-backend-0661.onrender.com/api/footer', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setFooterData(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch footer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('https://my-site-backend-0661.onrender.com/api/footer', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(footerData)
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Footer updated successfully!');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update footer');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => {
    setFooterData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addQuickLink = () => {
    setFooterData(prev => ({
      ...prev,
      quickLinks: [...prev.quickLinks, { name: '', url: '', order: prev.quickLinks.length }]
    }));
  };

  const removeQuickLink = (index) => {
    setFooterData(prev => ({
      ...prev,
      quickLinks: prev.quickLinks.filter((_, i) => i !== index)
    }));
  };

  const updateQuickLink = (index, field, value) => {
    setFooterData(prev => ({
      ...prev,
      quickLinks: prev.quickLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const addServiceLink = () => {
    setFooterData(prev => ({
      ...prev,
      serviceLinks: [...prev.serviceLinks, { name: '', url: '', order: prev.serviceLinks.length }]
    }));
  };

  const removeServiceLink = (index) => {
    setFooterData(prev => ({
      ...prev,
      serviceLinks: prev.serviceLinks.filter((_, i) => i !== index)
    }));
  };

  const updateServiceLink = (index, field, value) => {
    setFooterData(prev => ({
      ...prev,
      serviceLinks: prev.serviceLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const addSocialLink = () => {
    setFooterData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: '', url: '', icon: 'Github' }]
    }));
  };

  const removeSocialLink = (index) => {
    setFooterData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };

  const updateSocialLink = (index, field, value) => {
    setFooterData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  if (loading || !footerData) {
    return <div className="p-6 text-white">Loading footer data...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Footer Management</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          <Save size={20} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Logo & Description */}
      <div className="bg-slate-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Brand Information</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-gray-300 mb-2">Logo Text</label>
            <input
              type="text"
              value={footerData.logoText}
              onChange={(e) => updateField('logoText', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Description</label>
            <textarea
              value={footerData.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows="3"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Copyright Text</label>
            <input
              type="text"
              value={footerData.copyrightText}
              onChange={(e) => updateField('copyrightText', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-slate-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Quick Links</h3>
          <button
            onClick={addQuickLink}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition-colors"
          >
            <Plus size={16} />
            Add Link
          </button>
        </div>
        <div className="space-y-3">
          {footerData.quickLinks.map((link, index) => (
            <div key={index} className="flex gap-3 items-start">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Link Name"
                  value={link.name}
                  onChange={(e) => updateQuickLink(index, 'name', e.target.value)}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
                <input
                  type="text"
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => updateQuickLink(index, 'url', e.target.value)}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <button
                onClick={() => removeQuickLink(index)}
                className="p-2 text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Service Links */}
      <div className="bg-slate-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Service Links</h3>
          <button
            onClick={addServiceLink}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition-colors"
          >
            <Plus size={16} />
            Add Link
          </button>
        </div>
        <div className="space-y-3">
          {footerData.serviceLinks.map((link, index) => (
            <div key={index} className="flex gap-3 items-start">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Service Name"
                  value={link.name}
                  onChange={(e) => updateServiceLink(index, 'name', e.target.value)}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
                <input
                  type="text"
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => updateServiceLink(index, 'url', e.target.value)}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <button
                onClick={() => removeServiceLink(index)}
                className="p-2 text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-slate-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Social Links</h3>
          <button
            onClick={addSocialLink}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition-colors"
          >
            <Plus size={16} />
            Add Link
          </button>
        </div>
        <div className="space-y-3">
          {footerData.socialLinks.map((link, index) => (
            <div key={index} className="flex gap-3 items-start">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <select
                  value={link.icon}
                  onChange={(e) => updateSocialLink(index, 'icon', e.target.value)}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  {socialIcons.map(icon => (
                    <option key={icon.value} value={icon.value}>
                      {icon.label}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <button
                onClick={() => removeSocialLink(index)}
                className="p-2 text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}