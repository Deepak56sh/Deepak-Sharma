'use client';
import { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

// ⚠️ ASSUMED ROUTE — badal do agar aapke backend me alag hai:
//   PUT /api/customer/change-password  body: { currentPassword, newPassword } -> { success, message }

export default function ChangePasswordTab() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (form.newPassword.length < 6) {
      setStatus({ type: 'error', message: 'New password must be at least 6 characters.' });
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setStatus({ type: 'error', message: 'New password and confirm password do not match.' });
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/customer/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', message: 'Password updated successfully.' });
        setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setStatus({ type: 'error', message: data.message || 'Failed to update password.' });
      }
    } catch (err) {
      console.error('Change password error:', err);
      setStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { key: 'currentPassword', label: 'Current Password', showKey: 'current' },
    { key: 'newPassword', label: 'New Password', showKey: 'next' },
    { key: 'confirmPassword', label: 'Confirm New Password', showKey: 'confirm' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#e8ece9] p-6 max-w-md">
      <div className="flex items-center gap-2 mb-5">
        <Lock className="w-5 h-5 text-[#2f9e44]" />
        <h3 className="font-bold text-[#14261d]">Change Password</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(({ key, label, showKey }) => (
          <div key={key}>
            <label className="text-sm text-[#6b7280] mb-1.5 block">{label}</label>
            <div className="relative">
              <input
                required
                type={show[showKey] ? 'text' : 'password'}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full px-3 py-2.5 pr-10 bg-[#f6f8f7] border border-[#e8ece9] rounded-lg text-sm focus:outline-none focus:border-[#2f9e44] focus:ring-1 focus:ring-[#2f9e44]"
              />
              <button
                type="button"
                onClick={() => setShow({ ...show, [showKey]: !show[showKey] })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {show[showKey] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}

        {status && (
          <div className={`flex items-start gap-2 text-sm px-3 py-2.5 rounded-lg ${
            status.type === 'success' ? 'bg-[#eaf7ee] text-[#2f9e44]' : 'bg-red-50 text-red-600'
          }`}>
            {status.type === 'success' ? <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
            <span>{status.message}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full py-2.5 rounded-lg bg-[#2f9e44] text-white text-sm font-medium hover:bg-[#1f7a34] transition-colors disabled:opacity-50"
        >
          {saving ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}