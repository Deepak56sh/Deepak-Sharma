'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  Pencil,
  Eye,
  FileText,
  Search,
  ExternalLink
} from 'lucide-react';

// ✅ Yahan apne pages list karo
// Jo bhi page folder me banaye ho, unka entry yahan add karo
const staticPages = [
  {
    id: '1',
    name: 'About Us',
    slug: 'about',
    path: '/about',
    adminPath: '/admin/pages/about',   // admin edit page (agar banaya ho)
    status: 'published',
    updatedAt: '2026-08-01'
  },
  {
    id: '2',
    name: 'Contact Us',
    slug: 'contact',
    path: '/contact',
    adminPath: '/admin/pages/contact',
    status: 'published',
    updatedAt: '2026-08-01'
  },
  {
    id: '3',
    name: 'services',
    slug: 'services',
    path: '/services',
    adminPath: '/admin/pages/services',
    status: 'published',
    updatedAt: '2026-08-01'
  },
  // 👇 Apne 3 extra pages yahan add karo, example:
  // {
  //   id: '4',
  //   name: 'Shipping Policy',
  //   slug: 'shipping',
  //   path: '/shipping',
  //   adminPath: '/admin/pages/shipping',
  //   status: 'published',
  //   updatedAt: '2026-08-02'
  // },
];

export default function PagesPage() {
  const [search, setSearch] = useState('');
  const [pages] = useState(staticPages);

  const filtered = pages.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Pages</h1>
          <p className="text-slate-500 text-sm">
            Manage static pages like About, Contact, Care Guide and more.
          </p>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-[var(--pa-border)]">
        {/* Search */}
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

        {/* List */}
        <table className="w-full text-sm">
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
            {filtered.map((page) => (
              <tr
                key={page.id}
                className="border-b border-[var(--pa-border)] last:border-0 hover:bg-slate-50/50"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[var(--pa-primary-light)] flex items-center justify-center flex-shrink-0">
                      <FileText
                        className="w-4 h-4"
                        style={{ color: 'var(--pa-primary)' }}
                      />
                    </div>
                    <span className="font-medium text-slate-800">{page.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500 font-mono text-xs">
                  /{page.slug}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                      page.status === 'published'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {page.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">{page.updatedAt}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {/* Live page view */}
                    <Link
                      href={page.path}
                      target="_blank"
                      className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800"
                      title="View live page"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>

                    {/* Admin edit (agar sub-page banaya ho) */}
                    <Link
                      href={page.adminPath}
                      className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
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
  );
}