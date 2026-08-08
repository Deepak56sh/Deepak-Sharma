// app/admin/header/page.js
'use client';
import { useState, useEffect } from 'react';
import { Save, Upload, X, Trash2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://my-site-backend-0661.onrender.com';

export default function AdminHeaderPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [header, setHeader] = useState({
    logoText: 'Plantora',
    logoImage: '',
    topBarText: 'Free Shipping on orders above ₹999'
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const getToken = () =>
    typeof window !== 'undefined' ? localStorage.getItem('adminToken') || localStorage.getItem('token') : '';

  useEffect(() => {
    fetchHeader();
  }, []);

  const fetchHeader = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/header`);
      const data = await res.json();
      if (data.success && data.data) {
        setHeader(data.data);
        if (data.data.logoImage) {
          const imgUrl = data.data.logoImage.startsWith('http')
            ? data.data.logoImage
            : `${BASE_URL}${data.data.logoImage}`;
          setLogoPreview(imgUrl);
        }
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to load header data' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHeader(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = async () => {
    if (!confirm('Remove logo?')) return;
    
    try {
      const res = await fetch(`${API_URL}/header/logo`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      
      const data = await res.json();
      if (data.success) {
        setLogoPreview('');
        setLogoFile(null);
        setHeader(prev => ({ ...prev, logoImage: '' }));
        setMessage({ type: 'success', text: 'Logo removed successfully' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to remove logo' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('logoText', header.logoText);
      formData.append('topBarText', header.topBarText);
      
      if (logoFile) {
        formData.append('logoImage', logoFile);
      }

      const res = await fetch(`${API_URL}/header`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        },
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Header updated successfully!' });
        setHeader(data.data);
        if (data.data.logoImage) {
          const imgUrl = data.data.logoImage.startsWith('http')
            ? data.data.logoImage
            : `${BASE_URL}${data.data.logoImage}`;
          setLogoPreview(imgUrl);
        }
        setLogoFile(null);
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update header' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server error occurred' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2f9e44]" />
      </div>
    );
  }

  return (
    <div className="plant-admin p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1f2937]">Header Settings</h1>
          <p className="text-sm text-[#6b7280] mt-1">Manage logo and top bar text</p>
        </div>
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

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#e8ece9] p-6 space-y-6">
        {/* Logo Section */}
        <div className="border-b border-[#e8ece9] pb-6">
          <h2 className="text-lg font-semibold text-[#1f2937] mb-4">Logo Settings</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Logo Text */}
            <div>
              <label className="block text-sm font-medium text-[#1f2937] mb-1.5">
                Logo Text
              </label>
              <input
                name="logoText"
                value={header.logoText || ''}
                onChange={handleChange}
                placeholder="Plantora"
                className="w-full px-4 py-2.5 border border-[#e8ece9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2f9e44]/30"
              />
              <p className="text-xs text-[#6b7280] mt-1">Shown when no logo image is uploaded</p>
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-[#1f2937] mb-1.5">
                Logo Image
              </label>
              <div className="flex items-center gap-3">
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-[#e8ece9] rounded-xl hover:border-[#2f9e44] transition-colors">
                    <Upload className="w-4 h-4 text-[#6b7280]" />
                    <span className="text-sm text-[#6b7280]">
                      {logoFile ? logoFile.name : 'Upload Logo'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </div>
                </label>
                {logoPreview && (
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove logo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {/* Logo Preview */}
              {logoPreview && (
                <div className="mt-3 p-3 bg-[#f6f8f7] rounded-xl flex items-center gap-4">
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="h-12 w-auto object-contain"
                    onError={(e) => {
                      e.target.src = '';
                      e.target.alt = 'Invalid image';
                    }}
                  />
                  <div className="text-sm">
                    <p className="text-[#1f2937] font-medium">
                      {logoFile ? logoFile.name : 'Current Logo'}
                    </p>
                    <p className="text-[#6b7280] text-xs">
                      {logoFile ? `${(logoFile.size / 1024).toFixed(1)} KB` : 'Click upload to change'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top Bar Text */}
        <div>
          <h2 className="text-lg font-semibold text-[#1f2937] mb-4">Top Bar Settings</h2>
          <div>
            <label className="block text-sm font-medium text-[#1f2937] mb-1.5">
              Top Bar Text
            </label>
            <input
              name="topBarText"
              value={header.topBarText || ''}
              onChange={handleChange}
              placeholder="Free Shipping on orders above ₹999"
              className="w-full px-4 py-2.5 border border-[#e8ece9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2f9e44]/30"
            />
            <p className="text-xs text-[#6b7280] mt-1">Shown at the top of the page</p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t border-[#e8ece9]">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2f9e44] hover:bg-[#237a35] text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}