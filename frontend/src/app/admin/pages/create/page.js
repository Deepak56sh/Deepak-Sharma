'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

// Ready-made templates -> WordPress jaisa "select karke shuru karo" experience
const TEMPLATES = [
  {
    id: 'hero-text',
    name: 'Hero + Text',
    description: 'Bada banner heading ke saath, niche paragraph',
    sections: [
      { type: 'hero', data: { heading: 'Your Heading Here', subheading: 'Short description here' } },
      { type: 'text', data: { heading: '', body: 'Write your content here...' } },
    ],
  },
  {
    id: 'gallery-showcase',
    name: 'Gallery Showcase',
    description: 'Hero + image gallery grid',
    sections: [
      { type: 'hero', data: { heading: 'Gallery', subheading: '' } },
      { type: 'gallery', data: { images: [] } },
    ],
  },
  {
    id: 'landing-cta',
    name: 'Landing + Call To Action',
    description: 'Hero + text + neeche action button',
    sections: [
      { type: 'hero', data: { heading: 'Welcome', subheading: '' } },
      { type: 'text', data: { heading: '', body: '' } },
      { type: 'cta', data: { heading: 'Ready to get started?', buttonText: 'Contact Us', buttonLink: '/contact' } },
    ],
  },
  {
    id: 'blank',
    name: 'Blank Page',
    description: 'Khud se section add karo',
    sections: [],
  },
];

const SECTION_TYPES = ['hero', 'text', 'image', 'gallery', 'cta'];

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState('template'); // 'template' | 'editor'
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [sections, setSections] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const pickTemplate = (tpl) => {
    setSelectedTemplate(tpl.id);
    setSections(JSON.parse(JSON.stringify(tpl.sections))); // deep copy
    setStep('editor');
  };

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

  const removeSection = (index) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  };

  const moveSection = (index, direction) => {
    setSections((prev) => {
      const newArr = [...prev];
      const target = index + direction;
      if (target < 0 || target >= newArr.length) return prev;
      [newArr[index], newArr[target]] = [newArr[target], newArr[index]];
      return newArr;
    });
  };

  const savePage = async (status) => {
    if (!title.trim()) {
      setError('Title dalna zaroori hai');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          template: selectedTemplate,
          sections,
          status,
        }),
      });
      const json = await res.json();
      if (json.success) {
        router.push('/admin/pages');
      } else {
        setError(json.message || 'Save nahi ho paya');
      }
    } catch (err) {
      setError('Server se connect nahi ho paya');
    } finally {
      setSaving(false);
    }
  };

  // ---------------- STEP 1: Template selection ----------------
  if (step === 'template') {
    return (
      <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px' }}>
          Template chuno
        </h1>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => pickTemplate(tpl)}
              style={{
                textAlign: 'left',
                padding: '18px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                cursor: 'pointer',
                background: '#fff',
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: '4px' }}>{tpl.name}</div>
              <div style={{ fontSize: '13px', color: '#666' }}>{tpl.description}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ---------------- STEP 2: Editor ----------------
  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <button
        onClick={() => setStep('template')}
        style={{ marginBottom: '16px', background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer' }}
      >
        ← Template badlo
      </button>

      <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px' }}>Page details</h1>

      {error && (
        <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px', borderRadius: '8px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
          Page Title *
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. About Us"
          style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
          URL / Slug (khali chhodo to title se auto-generate hoga)
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ color: '#888' }}>yoursite.com/</span>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="about-us"
            style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
          />
        </div>
      </div>

      <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>Sections</h2>

      {sections.map((section, index) => (
        <div
          key={index}
          style={{ border: '1px solid #e5e7eb', borderRadius: '10px', padding: '14px', marginBottom: '12px' }}
        >
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
                    placeholder="Button Link (e.g. /contact)"
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
                updateSectionField(
                  index,
                  'images',
                  e.target.value.split('\n').map((s) => s.trim()).filter(Boolean)
                )
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
        <button disabled={saving} onClick={() => savePage('draft')} style={btnSecondary}>
          Save as Draft
        </button>
        <button disabled={saving} onClick={() => savePage('active')} style={btnPrimary}>
          Publish (Active)
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  marginBottom: '8px',
};

const btnGhost = {
  padding: '6px 12px',
  fontSize: '13px',
  border: '1px solid #ddd',
  borderRadius: '6px',
  background: '#fff',
  cursor: 'pointer',
};

const btnPrimary = {
  padding: '12px 22px',
  background: '#16a34a',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 700,
  cursor: 'pointer',
};

const btnSecondary = {
  padding: '12px 22px',
  background: '#f3f4f6',
  color: '#333',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 700,
  cursor: 'pointer',
};