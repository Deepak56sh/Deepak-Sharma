'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com';
const SECTION_TYPES = ['hero', 'text', 'image', 'gallery', 'cta'];

export default function EditPage() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState('draft');
  const [sections, setSections] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/pages/${id}`);
        const json = await res.json();
        if (json.success) {
          setTitle(json.data.title);
          setSlug(json.data.slug);
          setStatus(json.data.status);
          setSections(json.data.sections || []);
        } else {
          setError('Page load nahi hua');
        }
      } catch (err) {
        setError('Server se connect nahi ho paya');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const addSection = (type) => {
    const defaults = {
      hero: { heading: '', subheading: '' },
      text: { heading: '', body: '' },
      image: { imageUrl: '', caption: '' },
      gallery: { images: [] },
      cta: { heading: '', buttonText: '', buttonLink: '' },
    };
    setSections((prev) => [...prev, { type, data: defaults[type] }]);
  };

  const updateSectionField = (index, field, value) => {
    setSections((prev) =>
      prev.map((s, i) => (i === index ? { ...s, data: { ...s.data, [field]: value } } : s))
    );
  };

  const removeSection = (index) => setSections((prev) => prev.filter((_, i) => i !== index));

  const moveSection = (index, direction) => {
    setSections((prev) => {
      const newArr = [...prev];
      const target = index + direction;
      if (target < 0 || target >= newArr.length) return prev;
      [newArr[index], newArr[target]] = [newArr[target], newArr[index]];
      return newArr;
    });
  };

  const saveChanges = async (newStatus) => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/pages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, slug, sections, status: newStatus || status }),
      });
      const json = await res.json();
      if (json.success) {
        router.push('/admin/page');
      } else {
        setError(json.message || 'Save nahi ho paya');
      }
    } catch (err) {
      setError('Server se connect nahi ho paya');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '24px' }}>Loading...</div>;

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px' }}>Page edit karo</h1>

      {error && (
        <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px', borderRadius: '8px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '12px' }}>
        <label style={labelStyle}>Page Title *</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>URL / Slug</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ color: '#888' }}>yoursite.com/</span>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
        </div>
      </div>

      <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>Sections</h2>

      {sections.map((section, index) => (
        <div key={index} style={{ border: '1px solid #e5e7eb', borderRadius: '10px', padding: '14px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontWeight: 700, textTransform: 'capitalize' }}>{section.type} section</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => moveSection(index, -1)} style={btnGhost}>↑</button>
              <button onClick={() => moveSection(index, 1)} style={btnGhost}>↓</button>
              <button onClick={() => removeSection(index)} style={{ ...btnGhost, color: '#dc2626' }}>Remove</button>
            </div>
          </div>

          {(section.type === 'hero' || section.type === 'cta') && (
            <>
              <input
                placeholder="Heading"
                value={section.data.heading || ''}
                onChange={(e) => updateSectionField(index, 'heading', e.target.value)}
                style={inputStyle}
              />
              {section.type === 'hero' && (
                <input
                  placeholder="Subheading"
                  value={section.data.subheading || ''}
                  onChange={(e) => updateSectionField(index, 'subheading', e.target.value)}
                  style={inputStyle}
                />
              )}
              {section.type === 'cta' && (
                <>
                  <input
                    placeholder="Button Text"
                    value={section.data.buttonText || ''}
                    onChange={(e) => updateSectionField(index, 'buttonText', e.target.value)}
                    style={inputStyle}
                  />
                  <input
                    placeholder="Button Link"
                    value={section.data.buttonLink || ''}
                    onChange={(e) => updateSectionField(index, 'buttonLink', e.target.value)}
                    style={inputStyle}
                  />
                </>
              )}
            </>
          )}

          {section.type === 'text' && (
            <>
              <input
                placeholder="Heading (optional)"
                value={section.data.heading || ''}
                onChange={(e) => updateSectionField(index, 'heading', e.target.value)}
                style={inputStyle}
              />
              <textarea
                placeholder="Paragraph text"
                value={section.data.body || ''}
                onChange={(e) => updateSectionField(index, 'body', e.target.value)}
                rows={4}
                style={inputStyle}
              />
            </>
          )}

          {section.type === 'image' && (
            <>
              <input
                placeholder="Image URL"
                value={section.data.imageUrl || ''}
                onChange={(e) => updateSectionField(index, 'imageUrl', e.target.value)}
                style={inputStyle}
              />
              <input
                placeholder="Caption (optional)"
                value={section.data.caption || ''}
                onChange={(e) => updateSectionField(index, 'caption', e.target.value)}
                style={inputStyle}
              />
            </>
          )}

          {section.type === 'gallery' && (
            <textarea
              placeholder="Image URLs, ek line mein ek"
              value={(section.data.images || []).join('\n')}
              onChange={(e) =>
                updateSectionField(index, 'images', e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))
              }
              rows={3}
              style={inputStyle}
            />
          )}
        </div>
      ))}

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {SECTION_TYPES.map((type) => (
          <button key={type} onClick={() => addSection(type)} style={btnGhost}>
            + {type}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button disabled={saving} onClick={() => saveChanges('draft')} style={btnSecondary}>
          Save as Draft
        </button>
        <button disabled={saving} onClick={() => saveChanges('active')} style={btnPrimary}>
          Publish (Active)
        </button>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' };
const inputStyle = { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '8px' };
const btnGhost = { padding: '6px 12px', fontSize: '13px', border: '1px solid #ddd', borderRadius: '6px', background: '#fff', cursor: 'pointer' };
const btnPrimary = { padding: '12px 22px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' };
const btnSecondary = { padding: '12px 22px', background: '#f3f4f6', color: '#333', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' };