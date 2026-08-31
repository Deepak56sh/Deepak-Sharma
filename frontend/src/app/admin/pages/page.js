'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Layers, Pencil, FileText, Search, ExternalLink, Plus, Trash2, Loader2, Sparkles,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com';

const staticPages = [
  { id: 's-1', name: 'About Us', slug: 'about', path: '/about', adminPath: '/admin/pages/about', status: 'published', updatedAt: '2026-08-01', isDynamic: false },
  { id: 's-2', name: 'Contact Us', slug: 'contact', path: '/contact', adminPath: '/admin/pages/contact', status: 'published', updatedAt: '2026-08-01', isDynamic: false },
  { id: 's-3', name: 'services', slug: 'services', path: '/services', adminPath: '/admin/pages/services', status: 'published', updatedAt: '2026-08-01', isDynamic: false },
  { id: 's-4', name: 'contact-messages', slug: 'contact-messages', path: '/contact-messages', adminPath: '/admin/pages/contact-messages', status: 'published', updatedAt: '2026-08-12', isDynamic: false },
];

export default function PagesPage() {
  const [search, setSearch] = useState('');
  const [dynamicPages, setDynamicPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDynamicPages();
  }, []);

  const fetchDynamicPages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/pages`);
      const json = await res.json();
      if (json.success) {
        const mapped = json.data.map((p) => ({
          id: p._id,
          name: p.title,
          slug: p.slug,
          path: `/${p.slug}`,
          adminPath: `/admin/pages/edit/${p._id}`,
          status: p.status === 'active' ? 'published' : 'draft',
          updatedAt: new Date(p.updatedAt).toISOString().slice(0, 10),
          isDynamic: true,
          _rawId: p._id,
        }));
        setDynamicPages(mapped);
      }
    } catch (err) {
      console.error('Custom pages fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (page) => {
    const confirmed = window.confirm(`"${page.name}" ko delete karna hai? Ye live site se turant hat jayega.`);
    if (!confirmed) return;
    try {
      const res = await fetch(`${API_URL}/api/pages/${page._rawId}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setDynamicPages((prev) => prev.filter((p) => p.id !== page.id));
      } else {
        alert(json.message || 'Delete nahi ho paya');
      }
    } catch (err) {
      alert('Server se connect nahi ho paya');
    }
  };

  const allPages = [...staticPages, ...dynamicPages];
  const filtered = allPages.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.slug.toLowerCase().includes(search.toLowerCase())
  );
  const publishedCount = allPages.filter((p) => p.status === 'published').length;

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8" style={{ background: 'linear-gradient(135deg,var(--pa-primary,#2f9e44) 0%,#14261d 100%)' }}>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Content
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Pages</h1>
            <p className="text-white/70 text-sm">{allPages.length} pages total · {publishedCount} published</p>
          </div>
          <Link
            href="/admin/pages/create"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#14261d] text-sm font-semibold hover:bg-white/90 transition shadow-lg w-fit"
          >
            <Plus className="w-4 h-4" /> Create New Page
          </Link>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-[var(--pa-border)] overflow-hidden">
        <div className="p-4 border-b border-[var(--pa-border)]">
          <div className="relative max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pages..."
              className="pl-9 pr-3 py-2 bg-slate-50 border border-[var(--pa-border)] rounded-lg text-sm w-full focus:outline-none focus:border-[var(--pa-primary)]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-slate-400 border-b border-[var(--pa-border)]">
                <th className="px-4 py-3 font-medium">Page</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Updated</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 mx-auto animate-spin" />
                  </td>
                </tr>
              )}

              {!loading && filtered.map((page) => (
                <tr key={page.id} className="border-b border-[var(--pa-border)] last:border-0 hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'var(--pa-primary-light,#eaf7ee)' }}
                      >
                        <FileText className="w-4 h-4" style={{ color: 'var(--pa-primary,#2f9e44)' }} />
                      </div>
                      <span className="font-medium text-slate-800">{page.name}</span>
                      {page.isDynamic && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
                          CUSTOM
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">/{page.slug}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      page.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${page.status === 'published' ? 'bg-green-500' : 'bg-amber-500'}`} />
                      {page.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{page.updatedAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={page.path} target="_blank" className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800" title="View live page">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <Link href={page.adminPath} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      {page.isDynamic && (
                        <button onClick={() => handleDelete(page)} className="p-2 hover:bg-red-50 rounded-lg text-slate-500 hover:text-red-600" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                    <Layers className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p>No pages found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}