'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import ImageUploader from '@/components/Imageuploader';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com';
const SECTION_TYPES = ['hero', 'text', 'image', 'gallery', 'cta'];

const fieldClass =
  'w-full px-3 py-2.5 bg-slate-50 border border-[var(--pa-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--pa-primary)]';

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
      hero: { heading: '', subheading: '', backgroundImage: '' },
      text: { heading: '', body: '' },
      image: { imageUrl: '', caption: '' },
      gallery: { images: [] },
      cta: { heading: '', buttonText: '', buttonLink: '' },
    };
    setSections((prev) => [...prev, { type, data: defaults[type] }]);
  };

  const updateSectionField = (index, field, value) => {
    setSections((prev) => prev.map((s, i) => (i === index ? { ...s, data: { ...s.data, [field]: value } } : s)));
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

  const addGalleryImage = (index, url) => {
    setSections((prev) =>
      prev.map((s, i) => (i === index ? { ...s, data: { ...s.data, images: [...(s.data.images || []), url] } } : s))
    );
  };

  const removeGalleryImage = (index, imgIndex) => {
    setSections((prev) =>
      prev.map((s, i) =>
        i === index ? { ...s, data: { ...s.data, images: s.data.images.filter((_, gi) => gi !== imgIndex) } } : s
      )
    );
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/admin/page')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-2xl font-bold text-slate-800">Page edit karo</h1>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}

      <div className="bg-white rounded-xl border border-[var(--pa-border)] p-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Page Title *</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={fieldClass} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">URL / Slug</label>
          <div className="flex items-center gap-1">
            <span className="text-slate-400 text-sm">yoursite.com/</span>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} className={`${fieldClass} flex-1`} />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-3">Sections</h2>

        <div className="space-y-4">
          {sections.map((section, index) => (
            <div key={index} className="bg-white rounded-xl border border-[var(--pa-border)] p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-slate-800 capitalize">{section.type} section</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => moveSection(index, -1)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400">
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => moveSection(index, 1)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => removeSection(index)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {section.type === 'hero' && (
                  <>
                    <input
                      placeholder="Heading"
                      value={section.data.heading || ''}
                      onChange={(e) => updateSectionField(index, 'heading', e.target.value)}
                      className={fieldClass}
                    />
                    <input
                      placeholder="Subheading"
                      value={section.data.subheading || ''}
                      onChange={(e) => updateSectionField(index, 'subheading', e.target.value)}
                      className={fieldClass}
                    />
                    <ImageUploader
                      label="Background Image"
                      value={section.data.backgroundImage}
                      onChange={(url) => updateSectionField(index, 'backgroundImage', url)}
                    />
                  </>
                )}

                {section.type === 'cta' && (
                  <>
                    <input
                      placeholder="Heading"
                      value={section.data.heading || ''}
                      onChange={(e) => updateSectionField(index, 'heading', e.target.value)}
                      className={fieldClass}
                    />
                    <input
                      placeholder="Button Text"
                      value={section.data.buttonText || ''}
                      onChange={(e) => updateSectionField(index, 'buttonText', e.target.value)}
                      className={fieldClass}
                    />
                    <input
                      placeholder="Button Link"
                      value={section.data.buttonLink || ''}
                      onChange={(e) => updateSectionField(index, 'buttonLink', e.target.value)}
                      className={fieldClass}
                    />
                  </>
                )}

                {section.type === 'text' && (
                  <>
                    <input
                      placeholder="Heading (optional)"
                      value={section.data.heading || ''}
                      onChange={(e) => updateSectionField(index, 'heading', e.target.value)}
                      className={fieldClass}
                    />
                    <textarea
                      placeholder="Paragraph text"
                      value={section.data.body || ''}
                      onChange={(e) => updateSectionField(index, 'body', e.target.value)}
                      rows={4}
                      className={fieldClass}
                    />
                  </>
                )}

                {section.type === 'image' && (
                  <>
                    <ImageUploader
                      label="Image"
                      value={section.data.imageUrl}
                      onChange={(url) => updateSectionField(index, 'imageUrl', url)}
                    />
                    <input
                      placeholder="Caption (optional)"
                      value={section.data.caption || ''}
                      onChange={(e) => updateSectionField(index, 'caption', e.target.value)}
                      className={fieldClass}
                    />
                  </>
                )}

                {section.type === 'gallery' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-2">Gallery Images</label>
                    <div className="flex flex-wrap gap-3 mb-3">
                      {(section.data.images || []).map((img, gi) => (
                        <div key={gi} className="relative">
                          <img src={img} alt="" className="w-24 h-24 object-cover rounded-lg border border-[var(--pa-border)]" />
                          <button
                            onClick={() => removeGalleryImage(index, gi)}
                            className="absolute -top-2 -right-2 bg-white border border-[var(--pa-border)] rounded-full p-1 shadow hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3 text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <ImageUploader label="Add image to gallery" value="" onChange={(url) => addGalleryImage(index, url)} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {SECTION_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => addSection(type)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-[var(--pa-border)] rounded-lg hover:bg-slate-50 text-slate-600"
            >
              <Plus className="w-3.5 h-3.5" /> {type}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pb-8">
        <button
          disabled={saving}
          onClick={() => saveChanges('draft')}
          className="px-5 py-2.5 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm"
        >
          Save as Draft
        </button>
        <button
          disabled={saving}
          onClick={() => saveChanges('active')}
          className="px-5 py-2.5 rounded-lg text-white font-semibold text-sm"
          style={{ background: 'var(--pa-primary)' }}
        >
          Publish (Active)
        </button>
      </div>
    </div>
  );
}