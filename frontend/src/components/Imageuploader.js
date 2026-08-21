'use client';

import { useState } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com';

// value = current image URL (string), onChange(url) = jab naya image upload ho jaye to call hoga
export default function ImageUploader({ value, onChange, label = 'Image' }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${API_URL}/api/pages/upload`, {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();

      if (json.success) {
        onChange(json.url);
      } else {
        setError(json.message || 'Upload nahi ho paya');
      }
    } catch (err) {
      setError('Upload karte waqt error aaya');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>

      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt="uploaded"
            className="w-40 h-40 object-cover rounded-lg border border-[var(--pa-border)]"
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 bg-white border border-[var(--pa-border)] rounded-full p-1 shadow hover:bg-red-50"
          >
            <X className="w-3.5 h-3.5 text-red-500" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-[var(--pa-border)] rounded-lg cursor-pointer hover:bg-slate-50">
          {uploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          ) : (
            <>
              <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
              <span className="text-xs text-slate-400">Upload image</span>
            </>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
        </label>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}