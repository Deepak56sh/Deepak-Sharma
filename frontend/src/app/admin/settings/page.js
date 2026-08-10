'use client';
import { useState, useEffect, useRef } from 'react';
import {
  Save,
  Loader2,
  Upload,
  Image as ImageIcon,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  Share2,
  Sprout,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

const emptySettings = {
  siteName: '',
  siteTagline: '',
  siteUrl: '',
  siteLogo: '',
  siteFavicon: '',
  contactEmail: '',
  contactPhone: '',
  contactAddress: '',
  socialGithub: '',
  socialTwitter: '',
  socialLinkedin: '',
  socialInstagram: '',
  socialFacebook: '',
  businessHours: {
    weekdays: '',
    saturday: '',
    sunday: '',
  },
};

export default function SettingsPage() {
  const [form, setForm] = useState(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const logoInputRef = useRef(null);
  const faviconInputRef = useRef(null);

  const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null);

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3500);
  };

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/settings`);
      const data = await res.json();
      if (data.success && data.data) {
        setForm({
          siteName: data.data.siteName || '',
          siteTagline: data.data.siteTagline || '',
          siteUrl: data.data.siteUrl || '',
          siteLogo: data.data.siteLogo || '',
          siteFavicon: data.data.siteFavicon || '',
          contactEmail: data.data.contactEmail || '',
          contactPhone: data.data.contactPhone || '',
          contactAddress: data.data.contactAddress || '',
          socialGithub: data.data.socialGithub || '',
          socialTwitter: data.data.socialTwitter || '',
          socialLinkedin: data.data.socialLinkedin || '',
          socialInstagram: data.data.socialInstagram || '',
          socialFacebook: data.data.socialFacebook || '',
          businessHours: {
            weekdays: data.data.businessHours?.weekdays || '',
            saturday: data.data.businessHours?.saturday || '',
            sunday: data.data.businessHours?.sunday || '',
          },
        });
      }
    } catch (err) {
      console.error('Fetch settings error:', err);
      showMsg('error', 'Could not load settings. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // ---------- Logo upload ----------
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showMsg('error', 'Please select a valid image file for the logo.');
      return;
    }

    const token = getToken();
    if (!token) {
      showMsg('error', 'You are not logged in. Please log in again.');
      return;
    }

    setUploadingLogo(true);
    try {
      const fd = new FormData();
      fd.append('logo', file);

      const res = await fetch(`${API_URL}/settings/upload-logo`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      let result = null;
      try { result = await res.json(); } catch (_) {}

      if (res.ok && result?.success) {
        setForm((prev) => ({ ...prev, siteLogo: result.data.siteLogo }));
        showMsg('success', 'Logo updated — it will now show in the header.');
      } else {
        showMsg('error', result?.message || `Logo upload failed (status ${res.status}).`);
      }
    } catch (err) {
      console.error('Logo upload error:', err);
      showMsg('error', 'Could not reach the server to upload the logo.');
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = '';
    }
  };

  // ---------- Favicon upload ----------
  const handleFaviconUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showMsg('error', 'Please select a valid image file for the favicon.');
      return;
    }

    const token = getToken();
    if (!token) {
      showMsg('error', 'You are not logged in. Please log in again.');
      return;
    }

    setUploadingFavicon(true);
    try {
      const fd = new FormData();
      fd.append('favicon', file);

      const res = await fetch(`${API_URL}/settings/upload-favicon`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      let result = null;
      try { result = await res.json(); } catch (_) {}

      if (res.ok && result?.success) {
        setForm((prev) => ({ ...prev, siteFavicon: result.data.siteFavicon }));
        showMsg('success', 'Favicon updated — it will show in the browser tab.');
      } else {
        showMsg('error', result?.message || `Favicon upload failed (status ${res.status}).`);
      }
    } catch (err) {
      console.error('Favicon upload error:', err);
      showMsg('error', 'Could not reach the server to upload the favicon.');
    } finally {
      setUploadingFavicon(false);
      if (faviconInputRef.current) faviconInputRef.current.value = '';
    }
  };

  // ---------- Save text fields ----------
  const handleSave = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      showMsg('error', 'You are not logged in. Please log in again.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });

      let result = null;
      try { result = await res.json(); } catch (_) {}

      if (res.ok && result?.success) {
        showMsg('success', 'Settings saved successfully.');
      } else {
        showMsg('error', result?.message || `Save failed (status ${res.status}).`);
      }
    } catch (err) {
      console.error('Save settings error:', err);
      showMsg('error', 'Could not reach the server. Check your connection.');
    } finally {
      setSaving(false);
    }
  };

  const Section = ({ icon: Icon, title, subtitle, children }) => (
    <div className="bg-white rounded-xl border border-[var(--pa-border)] p-6">
      <div className="flex items-center gap-2.5 mb-1">
        <Icon className="w-5 h-5" style={{ color: 'var(--pa-primary)' }} />
        <h2 className="font-bold text-slate-800">{title}</h2>
      </div>
      {subtitle && <p className="text-slate-400 text-sm mb-5">{subtitle}</p>}
      <div className={subtitle ? '' : 'mt-5'}>{children}</div>
    </div>
  );

  const Field = ({ label, ...props }) => (
    <div>
      <label className="block text-slate-600 text-sm mb-2">{label}</label>
      <input
        {...props}
        className="w-full p-3 bg-slate-50 border border-[var(--pa-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--pa-primary)]"
      />
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Site Settings</h1>
          <p className="text-slate-500 text-sm">Logo, favicon, contact info and everything the site needs.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 text-white font-medium px-5 py-2.5 rounded-lg disabled:opacity-50"
          style={{ backgroundColor: 'var(--pa-primary)' }}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      {message.text && (
        <div
          className={`p-3 rounded-xl text-sm font-medium ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Branding: Logo + Favicon */}
        <Section icon={ImageIcon} title="Branding" subtitle="Shown in the header, browser tab and across the site">
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Logo */}
            <div>
              <p className="text-slate-600 text-sm mb-2">Site Logo</p>
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 flex-shrink-0 rounded-xl border border-[var(--pa-border)] bg-[var(--pa-primary-light)] flex items-center justify-center overflow-hidden">
                  {form.siteLogo ? (
                    <img src={form.siteLogo} alt="Logo" className="w-full h-full object-contain p-2" />
                  ) : (
                    <Sprout className="w-8 h-8" style={{ color: 'var(--pa-primary)' }} />
                  )}
                  {uploadingLogo && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <label className="flex items-center gap-2 px-4 py-2.5 bg-[var(--pa-primary-light)] text-[var(--pa-primary)] rounded-lg text-sm font-medium cursor-pointer hover:opacity-90">
                  <Upload className="w-4 h-4" />
                  {form.siteLogo ? 'Change Logo' : 'Upload Logo'}
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    disabled={uploadingLogo}
                  />
                </label>
              </div>
              <p className="text-xs text-slate-400 mt-2">PNG with transparent background recommended, square or wide.</p>
            </div>

            {/* Favicon */}
            <div>
              <p className="text-slate-600 text-sm mb-2">Favicon</p>
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 flex-shrink-0 rounded-xl border border-[var(--pa-border)] bg-slate-50 flex items-center justify-center overflow-hidden">
                  {form.siteFavicon ? (
                    <img src={form.siteFavicon} alt="Favicon" className="w-10 h-10 object-contain" />
                  ) : (
                    <Globe className="w-7 h-7 text-slate-300" />
                  )}
                  {uploadingFavicon && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium cursor-pointer hover:bg-slate-200">
                  <Upload className="w-4 h-4" />
                  {form.siteFavicon ? 'Change Favicon' : 'Upload Favicon'}
                  <input
                    ref={faviconInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFaviconUpload}
                    className="hidden"
                    disabled={uploadingFavicon}
                  />
                </label>
              </div>
              <p className="text-xs text-slate-400 mt-2">Square image (e.g. 512×512 PNG) works best.</p>
            </div>
          </div>
        </Section>

        {/* General */}
        <Section icon={Globe} title="General" subtitle="Basic site identity">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field
              label="Site Name"
              value={form.siteName}
              onChange={(e) => setForm({ ...form, siteName: e.target.value })}
              placeholder="Plantora"
            />
            <Field
              label="Tagline"
              value={form.siteTagline}
              onChange={(e) => setForm({ ...form, siteTagline: e.target.value })}
              placeholder="Bring Nature Home"
            />
            <div className="sm:col-span-2">
              <Field
                label="Site URL"
                type="url"
                value={form.siteUrl}
                onChange={(e) => setForm({ ...form, siteUrl: e.target.value })}
                placeholder="https://plantora.com"
              />
            </div>
          </div>
        </Section>

        {/* Contact */}
        <Section icon={Mail} title="Contact Information" subtitle="Shown in the footer and contact page">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field
              label="Contact Email"
              type="email"
              required
              value={form.contactEmail}
              onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
              placeholder="hello@plantora.com"
            />
            <Field
              label="Contact Phone"
              required
              value={form.contactPhone}
              onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
              placeholder="+91 98765 43210"
            />
            <div className="sm:col-span-2">
              <Field
                label="Address"
                required
                value={form.contactAddress}
                onChange={(e) => setForm({ ...form, contactAddress: e.target.value })}
                placeholder="Ahmedabad, Gujarat"
              />
            </div>
          </div>
        </Section>

        {/* Social Links */}
        <Section icon={Share2} title="Social Links" subtitle="Leave blank to hide an icon on the site">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field
              label="Instagram"
              value={form.socialInstagram}
              onChange={(e) => setForm({ ...form, socialInstagram: e.target.value })}
              placeholder="https://instagram.com/plantora"
            />
            <Field
              label="Facebook"
              value={form.socialFacebook}
              onChange={(e) => setForm({ ...form, socialFacebook: e.target.value })}
              placeholder="https://facebook.com/plantora"
            />
            <Field
              label="Twitter / X"
              value={form.socialTwitter}
              onChange={(e) => setForm({ ...form, socialTwitter: e.target.value })}
              placeholder="https://twitter.com/plantora"
            />
            <Field
              label="LinkedIn"
              value={form.socialLinkedin}
              onChange={(e) => setForm({ ...form, socialLinkedin: e.target.value })}
              placeholder="https://linkedin.com/company/plantora"
            />
          </div>
        </Section>

        {/* Business Hours */}
        <Section icon={Clock} title="Business Hours" subtitle="Shown in the footer / contact page">
          <div className="grid sm:grid-cols-3 gap-4">
            <Field
              label="Weekdays"
              value={form.businessHours.weekdays}
              onChange={(e) => setForm({ ...form, businessHours: { ...form.businessHours, weekdays: e.target.value } })}
              placeholder="9:00 AM - 6:00 PM"
            />
            <Field
              label="Saturday"
              value={form.businessHours.saturday}
              onChange={(e) => setForm({ ...form, businessHours: { ...form.businessHours, saturday: e.target.value } })}
              placeholder="10:00 AM - 4:00 PM"
            />
            <Field
              label="Sunday"
              value={form.businessHours.sunday}
              onChange={(e) => setForm({ ...form, businessHours: { ...form.businessHours, sunday: e.target.value } })}
              placeholder="Closed"
            />
          </div>
        </Section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 text-white font-medium px-6 py-3 rounded-lg disabled:opacity-50"
            style={{ backgroundColor: 'var(--pa-primary)' }}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}