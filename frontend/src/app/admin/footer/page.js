'use client';
import { useState, useEffect, useRef } from 'react';
import {
  Save, Plus, Trash2, Upload, Image as ImageIcon, Loader2, X,
  Instagram, Facebook, Twitter, Youtube, Github, Linkedin, Mail
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

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

function LinkEditor({ title, links, onUpdate, onAdd, onRemove }) {
  return (
    <div className="bg-white rounded-2xl border border-[#e8ece9] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[#1f2937]">{title}</h3>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#eaf7ee] text-[#2f9e44] rounded-lg hover:bg-[#d4edda]"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>

      {links.length === 0 ? (
        <p className="text-sm text-[#9ca3af] py-4 text-center">No links yet</p>
      ) : (
        <div className="space-y-3">
          {links.map((link, i) => (
            <div key={i} className="flex gap-2 items-start">
              <input
                value={link.name}
                onChange={(e) => onUpdate(i, 'name', e.target.value)}
                placeholder="Name"
                className="flex-1 px-3 py-2 border border-[#e8ece9] rounded-lg text-sm focus:outline-none focus:border-[#2f9e44]"
              />
              <input
                value={link.url}
                onChange={(e) => onUpdate(i, 'url', e.target.value)}
                placeholder="/path or https://"
                className="flex-[1.5] px-3 py-2 border border-[#e8ece9] rounded-lg text-sm focus:outline-none focus:border-[#2f9e44]"
              />
              <input
                type="number"
                value={link.order}
                onChange={(e) => onUpdate(i, 'order', Number(e.target.value))}
                className="w-16 px-2 py-2 border border-[#e8ece9] rounded-lg text-sm text-center focus:outline-none focus:border-[#2f9e44]"
              />
              <button
                type="button"
                onClick={() => onRemove(i)}
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
}

export default function AdminFooterPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
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
    typeof window !== 'undefined' ? (localStorage.getItem('adminToken') || localStorage.getItem('token')) : '';

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

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
      showMsg('error', 'Failed to load footer data. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFooter();
  }, []);

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

  // ---- Logo Upload (same robust pattern as Settings → logo/favicon) ----
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showMsg('error', 'Please select a valid image file.');
      if (fileRef.current) fileRef.current.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showMsg('error', 'Image must be under 2MB.');
      if (fileRef.current) fileRef.current.value = '';
      return;
    }

    // ✅ FIX: check token BEFORE trying to upload, so the real reason shows up
    const token = getToken();
    if (!token) {
      showMsg('error', 'You are not logged in (no admin token found). Please log in again.');
      if (fileRef.current) fileRef.current.value = '';
      return;
    }

    setUploadingLogo(true);
    try {
      const fd = new FormData();
      fd.append('logo', file);

      const res = await fetch(`${API_URL}/footer/logo`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });

      // ✅ FIX: always read the body so real errors surface instead of a generic message
      let result = null;
      try {
        result = await res.json();
      } catch (parseErr) {
        // non-JSON response (e.g. server crashed / HTML error page)
      }

      if (res.ok && result?.success && result?.data?.logoImage) {
        setForm((prev) => ({ ...prev, logoImage: result.data.logoImage }));
        showMsg('success', 'Logo uploaded successfully.');
      } else {
        showMsg('error', result?.message || `Logo upload failed (status ${res.status}). Please try again.`);
      }
    } catch (err) {
      console.error('Logo upload error:', err);
      showMsg('error', 'Could not reach the server to upload the logo. Check your connection and try again.');
    } finally {
      setUploadingLogo(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const removeLogo = () => {
    setForm((prev) => ({ ...prev, logoImage: '' }));
  };

  // ---- Save all ----
  const handleSave = async (e) => {
    e.preventDefault();

    const token = getToken();
    if (!token) {
      showMsg('error', 'You are not logged in (no admin token found). Please log in again.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/footer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      let data = null;
      try {
        data = await res.json();
      } catch (parseErr) {}

      if (res.ok && data?.success) {
        showMsg('success', 'Footer saved successfully.');
      } else {
        showMsg('error', data?.message || `Failed to save (status ${res.status}).`);
      }
    } catch (err) {
      console.error('Save footer error:', err);
      showMsg('error', 'Could not reach the server. Check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  // ✅ FIX: Cloudinary already returns a full https:// URL — no more manual BASE_URL prefixing,
  // which used to be needed only for the old local /uploads/ path format.
  const getLogoUrl = () => {
    if (!form.logoImage) return null;
    return form.logoImage;
  };

  if (loading) {
    return (
      <div className="plant-admin flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#2f9e44]" />
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
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
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
                <div className="relative w-20 h-20 flex-shrink-0 rounded-xl border-2 border-dashed border-[#e8ece9] bg-[#f6f8f7] flex items-center justify-center overflow-hidden">
                  {getLogoUrl() ? (
                    <img
                      src={getLogoUrl()}
                      alt="Logo"
                      className="w-full h-full object-contain p-1.5"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-[#9ca3af]" />
                  )}
                  {uploadingLogo && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    disabled={uploadingLogo}
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      disabled={uploadingLogo}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#eaf7ee] text-[#2f9e44] text-sm font-semibold rounded-xl hover:bg-[#d4edda] disabled:opacity-60"
                    >
                      <Upload className="w-4 h-4" />
                      {uploadingLogo ? 'Uploading...' : form.logoImage ? 'Change Logo' : 'Upload Logo'}
                    </button>
                    {form.logoImage && !uploadingLogo && (
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="p-2 text-[#9ca3af] hover:text-red-500 hover:bg-red-50 rounded-xl"
                        title="Remove logo (falls back to icon)"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-[#9ca3af] mt-1.5">PNG, JPG up to 2MB. Transparent background recommended.</p>
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
        <div className="grid lg:grid-cols-2 gap-6">
          <LinkEditor
            title="Quick Links"
            links={form.quickLinks}
            onUpdate={(i, field, value) => updateLink('quickLinks', i, field, value)}
            onAdd={() => addLink('quickLinks')}
            onRemove={(i) => removeLink('quickLinks', i)}
          />
          <LinkEditor
            title="Collections"
            links={form.serviceLinks}
            onUpdate={(i, field, value) => updateLink('serviceLinks', i, field, value)}
            onAdd={() => addLink('serviceLinks')}
            onRemove={(i) => removeLink('serviceLinks', i)}
          />
          <LinkEditor
            title="Customer Care"
            links={form.customerCare}
            onUpdate={(i, field, value) => updateLink('customerCare', i, field, value)}
            onAdd={() => addLink('customerCare')}
            onRemove={(i) => removeLink('customerCare', i)}
          />
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
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}