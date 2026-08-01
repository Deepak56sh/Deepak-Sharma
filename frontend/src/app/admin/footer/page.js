'use client';
import { useState, useEffect, useRef } from 'react';
import {
  Save, Plus, Trash2, Upload, Image as ImageIcon,
  Instagram, Facebook, Twitter, Youtube, Github, Linkedin, Mail
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://my-site-backend-0661.onrender.com';

const PLATFORM_OPTIONS = [
  { value: 'instagram', icon: 'Instagram', label: 'Instagram' },
  { value: 'facebook', icon: 'Facebook', label: 'Facebook' },
  { value: 'twitter', icon: 'Twitter', label: 'Twitter' },
  { value: 'youtube', icon: 'Youtube', label: 'Youtube' },
  { value: 'github', icon: 'Github', label: 'Github' },
  { value: 'linkedin', icon: 'Linkedin', label: 'LinkedIn' },
  { value: 'email', icon: 'Mail', label: 'Email' },
];

const emptyLink = { name: '', url: '', order: 0 };
const emptySocial = { platform: 'instagram', url: '', icon: 'Instagram' };

export default function AdminFooterPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    logoText: 'Plantora',
    logoImage: '',
    description: '',
    copyrightText: 'All rights reserved.',
    quickLinks: [],
    serviceLinks: [],
    customerCare: [],
    socialLinks: [],
  });

  const getToken = () =>
    typeof window !== 'undefined' ? localStorage.getItem('adminToken') || localStorage.getItem('token') : '';

  useEffect(() => {
    fetchFooter();
  }, []);

  const fetchFooter = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/footer`);
      const data = await res.json();
      if (data.success && data.data) {
        setForm({
          logoText: data.data.logoText || 'Plantora',
          logoImage: data.data.logoImage || '',
          description: data.data.description || '',
          copyrightText: data.data.copyrightText || 'All rights reserved.',
          quickLinks: data.data.quickLinks || [],
          serviceLinks: data.data.serviceLinks || [],
          customerCare: data.data.customerCare || [],
          socialLinks: data.data.socialLinks || [],
        });
      }
    } catch (err) {
      console.error(err);
      showMsg('error', 'Failed to load footer data');
    } finally {
      setLoading(false);
    }
  };

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleTextChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ---- Link list helpers ----
  const updateLink = (listKey, index, field, value) => {
    setForm((prev) => {
      const list = [...prev[listKey]];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, [listKey]: list };
    });
  };

  const addLink = (listKey) => {
    setForm((prev) => ({
      ...prev,
      [listKey]: [...prev[listKey], { ...emptyLink, order: prev[listKey].length }]
    }));
  };

  const removeLink = (listKey, index) => {
    setForm((prev) => ({
      ...prev,
      [listKey]: prev[listKey].filter((_, i) => i !== index)
    }));
  };

  // ---- Social helpers ----
  const updateSocial = (index, field, value) => {
    setForm((prev) => {
      const list = [...prev.socialLinks];
      list[index] = { ...list[index], [field]: value };
      if (field === 'platform') {
        const found = PLATFORM_OPTIONS.find((p) => p.value === value);
        if (found) list[index].icon = found.icon;
      }
      return { ...prev, socialLinks: list };
    });
  };

  const addSocial = () => {
    setForm((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { ...emptySocial }]
    }));
  };

  const removeSocial = (index) => {
    setForm((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };

  // ---- Logo Upload ----
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showMsg('error', 'Please upload an image file');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showMsg('error', 'Image must be under 2MB');
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('logo', file);

      const res = await fetch(`${API_URL}/footer/logo`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: fd
      });

      const data = await res.json();
      if (data.success) {
        setForm((prev) => ({ ...prev, logoImage: data.data.logoImage }));
        showMsg('success', 'Logo uploaded successfully');
      } else {
        showMsg('error', data.message || 'Upload failed');
      }
    } catch {
      showMsg('error', 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  // ---- Save all ----
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/footer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (data.success) {
        showMsg('success', 'Footer saved successfully');
      } else {
        showMsg('error', data.message || 'Failed to save');
      }
    } catch {
      showMsg('error', 'Server error');
    } finally {
      setSaving(false);
    }
  };

  const getLogoUrl = () => {
    if (!form.logoImage) return null;
    if (form.logoImage.startsWith('http')) return form.logoImage;
    return `${BASE_URL}${form.logoImage}`;
  };

  const LinkEditor = ({ title, listKey }) => (
    <div className="bg-white rounded-2xl border border-[#e8ece9] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[#1f2937]">{title}</h3>
        <button
          type="button"
          onClick={() => addLink(listKey)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#eaf7ee] text-[#2f9e44] rounded-lg hover:bg-[#d4edda]"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>

      {form[listKey].length === 0 ? (
        <p className="text-sm text-[#9ca3af] py-4 text-center">No links yet</p>
      ) : (
        <div className="space-y-3">
          {form[listKey].map((link, i) => (
            <div key={i} className="flex gap-2 items-start">
              <input
                value={link.name}
                onChange={(e) => updateLink(listKey, i, 'name', e.target.value)}
                placeholder="Name"
                className="flex-1 px-3 py-2 border border-[#e8ece9] rounded-lg text-sm focus:outline-none focus:border-[#2f9e44]"
              />
              <input
                value={link.url}
                onChange={(e) => updateLink(listKey, i, 'url', e.target.value)}
                placeholder="/path or https://"
                className="flex-[1.5] px-3 py-2 border border-[#e8ece9] rounded-lg text-sm focus:outline-none focus:border-[#2f9e44]"
              />
              <input
                type="number"
                value={link.order}
                onChange={(e) => updateLink(listKey, i, 'order', Number(e.target.value))}
                className="w-16 px-2 py-2 border border-[#e8ece9] rounded-lg text-sm text-center focus:outline-none focus:border-[#2f9e44]"
              />
              <button
                type="button"
                onClick={() => removeLink(listKey, i)}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="plant-admin flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2f9e44]" />
      </div>
    );
  }

  return (
    <div className="plant-admin p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1f2937]">Footer Management</h1>
          <p className="text-sm text-[#6b7280] mt-1">Logo, links, social icons & copyright</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2f9e44] hover:bg-[#237a35] text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Footer'}
        </button>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${
          message.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Logo + Brand */}
        <div className="bg-white rounded-2xl border border-[#e8ece9] p-6">
          <h3 className="font-bold text-[#1f2937] mb-5">Brand & Logo</h3>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-[#1f2937] mb-2">Logo Image</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl border-2 border-dashed border-[#e8ece9] bg-[#f6f8f7] flex items-center justify-center overflow-hidden">
                  {getLogoUrl() ? (
                    <img src={getLogoUrl()} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-[#9ca3af]" />
                  )}
                </div>
                <div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#eaf7ee] text-[#2f9e44] text-sm font-semibold rounded-xl hover:bg-[#d4edda] disabled:opacity-60"
                  >
                    <Upload className="w-4 h-4" />
                    {uploading ? 'Uploading...' : 'Upload Logo'}
                  </button>
                  <p className="text-xs text-[#9ca3af] mt-1.5">PNG, JPG up to 2MB</p>
                </div>
              </div>
            </div>

            {/* Logo Text + Description */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1f2937] mb-1.5">Logo Text</label>
                <input
                  name="logoText"
                  value={form.logoText}
                  onChange={handleTextChange}
                  className="w-full px-4 py-2.5 border border-[#e8ece9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2f9e44]/30 focus:border-[#2f9e44]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1f2937] mb-1.5">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleTextChange}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-[#e8ece9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2f9e44]/30 focus:border-[#2f9e44] resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Link Sections */}
        <div className="grid lg:grid-cols-3 gap-6">
          <LinkEditor title="Quick Links" listKey="quickLinks" />
          <LinkEditor title="Collections" listKey="serviceLinks" />
          <LinkEditor title="Customer Care" listKey="customerCare" />
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-2xl border border-[#e8ece9] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#1f2937]">Social Links</h3>
            <button
              type="button"
              onClick={addSocial}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#eaf7ee] text-[#2f9e44] rounded-lg hover:bg-[#d4edda]"
            >
              <Plus className="w-3.5 h-3.5" /> Add Social
            </button>
          </div>

          {form.socialLinks.length === 0 ? (
            <p className="text-sm text-[#9ca3af] py-4 text-center">No social links yet</p>
          ) : (
            <div className="space-y-3">
              {form.socialLinks.map((social, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <select
                    value={social.platform}
                    onChange={(e) => updateSocial(i, 'platform', e.target.value)}
                    className="w-36 px-3 py-2 border border-[#e8ece9] rounded-lg text-sm focus:outline-none focus:border-[#2f9e44]"
                  >
                    {PLATFORM_OPTIONS.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                  <input
                    value={social.url}
                    onChange={(e) => updateSocial(i, 'url', e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 border border-[#e8ece9] rounded-lg text-sm focus:outline-none focus:border-[#2f9e44]"
                  />
                  <button
                    type="button"
                    onClick={() => removeSocial(i)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Copyright */}
        <div className="bg-white rounded-2xl border border-[#e8ece9] p-5">
          <h3 className="font-bold text-[#1f2937] mb-4">Copyright</h3>
          <input
            name="copyrightText"
            value={form.copyrightText}
            onChange={handleTextChange}
            placeholder="All rights reserved."
            className="w-full max-w-md px-4 py-2.5 border border-[#e8ece9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2f9e44]/30 focus:border-[#2f9e44]"
          />
        </div>

        {/* Save bottom */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#2f9e44] hover:bg-[#237a35] text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}