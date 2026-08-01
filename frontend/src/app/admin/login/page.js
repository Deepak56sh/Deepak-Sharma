'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, Sprout, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const token = localStorage.getItem('adminToken');
    if (token) {
      router.replace('/admin');
      return;
    }

    const nav = document.querySelector('nav');
    const footer = document.querySelector('footer');
    if (nav) nav.style.display = 'none';
    if (footer) footer.style.display = 'none';

    return () => {
      const nav = document.querySelector('nav');
      const footer = document.querySelector('footer');
      if (nav) nav.style.display = '';
      if (footer) footer.style.display = '';
    };
  }, [router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://my-site-backend-0661.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('adminToken', data.data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.data.admin));
        router.replace('/admin');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f8f7] px-6 py-12 relative">
      <style jsx global>{`
        nav, footer {
          display: none !important;
        }
      `}</style>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2f9e44]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#2f9e44]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#14261d] rounded-2xl mb-4">
            <Sprout className="w-8 h-8 text-[#2f9e44]" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Plant Store</h1>
          <p className="text-slate-500">Login to your admin panel</p>
        </div>

        <div className="bg-white rounded-2xl border border-[var(--pa-border)] p-8 shadow-sm">
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-3 text-rose-500">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-slate-600 mb-2 font-medium text-sm">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@plantstore.com"
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-[var(--pa-border)] rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2f9e44] focus:ring-2 focus:ring-[#2f9e44]/20 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-slate-600 mb-2 font-medium text-sm">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-[var(--pa-border)] rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2f9e44] focus:ring-2 focus:ring-[#2f9e44]/20 transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#2f9e44] rounded-lg text-white font-semibold hover:bg-[#237a35] transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging in...
                </span>
              ) : (
                'Login to Dashboard'
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-slate-500 hover:text-slate-800 transition-colors text-sm inline-flex items-center gap-2">
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
