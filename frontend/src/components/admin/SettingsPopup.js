'use client';
import { useState } from 'react';
import { X, Lock, Mail, Eye, EyeOff } from 'lucide-react';

export default function SettingsPopup({ isOpen, onClose, adminUser, onChangePassword }) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    newEmail: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setLoading(false);
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      setLoading(false);
      return;
    }

    try {
      const result = await onChangePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        newEmail: formData.newEmail,
      });

      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '', newEmail: '' });
        setTimeout(() => onClose(), 2000);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update settings' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white border border-[var(--pa-border)] rounded-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-[var(--pa-border)]">
          <h2 className="text-xl font-semibold text-slate-800">Account Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-2">
              <Lock className="w-4 h-4" />
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-slate-50 border border-[var(--pa-border)] rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--pa-primary)]/20 focus:border-[var(--pa-primary)] pr-10"
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-2">
              <Lock className="w-4 h-4" />
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-slate-50 border border-[var(--pa-border)] rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--pa-primary)]/20 focus:border-[var(--pa-primary)] pr-10"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-2">
              <Lock className="w-4 h-4" />
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-slate-50 border border-[var(--pa-border)] rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--pa-primary)]/20 focus:border-[var(--pa-primary)] pr-10"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-2">
              <Mail className="w-4 h-4" />
              New Email (Optional)
            </label>
            <input
              type="email"
              name="newEmail"
              value={formData.newEmail}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-slate-50 border border-[var(--pa-border)] rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--pa-primary)]/20 focus:border-[var(--pa-primary)]"
              placeholder="Enter new email address"
            />
          </div>

          {message.text && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm ${
                message.type === 'success'
                  ? 'bg-[var(--pa-primary-light)] text-[var(--pa-primary)] border border-[var(--pa-primary)]/20'
                  : 'bg-rose-50 text-rose-500 border border-rose-200'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-[var(--pa-primary)] hover:bg-[var(--pa-primary-dark)] text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
