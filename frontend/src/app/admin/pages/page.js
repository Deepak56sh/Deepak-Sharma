'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Apne actual backend URL se replace/confirm kar lena (Render pe deployed hai)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

export default function AdminPagesList() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/pages`);
      const json = await res.json();
      if (json.success) setPages(json.data);
    } catch (err) {
      console.error('Pages fetch karne mein error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/pages/${id}/status`, { method: 'PATCH' });
      const json = await res.json();
      if (json.success) {
        setPages((prev) => prev.map((p) => (p._id === id ? json.data : p)));
      }
    } catch (err) {
      console.error('Status change karne mein error:', err);
    }
  };

  const deletePage = async (id, title) => {
    const confirmed = window.confirm(`"${title}" ko permanently delete karna hai?`);
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_URL}/api/pages/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setPages((prev) => prev.filter((p) => p._id !== id));
      } else {
        alert(json.message || 'Delete nahi ho paya');
      }
    } catch (err) {
      console.error('Delete karne mein error:', err);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Custom Pages</h1>
        <button
          onClick={() => router.push('/admin/page/create')}
          style={{
            background: '#16a34a',
            color: '#fff',
            padding: '10px 18px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          + Create New Page
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : pages.length === 0 ? (
        <p style={{ color: '#666' }}>Abhi koi page nahi bana. "Create New Page" pe click karo.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
              <th style={{ padding: '10px' }}>Title</th>
              <th style={{ padding: '10px' }}>URL</th>
              <th style={{ padding: '10px' }}>Status</th>
              <th style={{ padding: '10px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '10px', fontWeight: 500 }}>{page.title}</td>
                <td style={{ padding: '10px', color: '#555' }}>
                  /{page.slug}
                  {page.status === 'active' && (
                    <a
                      href={`/${page.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ marginLeft: '8px', fontSize: '12px', color: '#2563eb' }}
                    >
                      Live dekho ↗
                    </a>
                  )}
                </td>
                <td style={{ padding: '10px' }}>
                  <button
                    onClick={() => toggleStatus(page._id)}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: page.status === 'active' ? '#dcfce7' : '#fef3c7',
                      color: page.status === 'active' ? '#15803d' : '#92400e',
                    }}
                  >
                    {page.status === 'active' ? 'Active' : 'Draft'}
                  </button>
                </td>
                <td style={{ padding: '10px' }}>
                  <Link
                    href={`/admin/page/edit/${page._id}`}
                    style={{ marginRight: '12px', color: '#2563eb', fontSize: '14px' }}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deletePage(page._id, page.title)}
                    style={{
                      border: 'none',
                      background: 'none',
                      color: '#dc2626',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}