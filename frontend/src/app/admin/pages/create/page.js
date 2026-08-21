'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Plus, Trash2, ArrowUp, ArrowDown, Layout, Type, Image as ImageIcon,
  GalleryHorizontal, MousePointerClick, LayoutTemplate, FileStack,
} from 'lucide-react';
import ImageUploader from '@/components/Imageuploader';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com';

const SECTION_META = {
  hero: { label: 'Hero Banner', icon: Layout, color: '#2f9e44' },
  text: { label: 'Text Block', icon: Type, color: '#3b82f6' },
  image: { label: 'Image', icon: ImageIcon, color: '#f59e0b' },
  gallery: { label: 'Gallery', icon: GalleryHorizontal, color: '#8b5cf6' },
  cta: { label: 'Call To Action', icon: MousePointerClick, color: '#ef4444' },
};
const SECTION_TYPES = Object.keys(SECTION_META);

const TEMPLATES = [
  {
    id: 'hero-text', name: 'Hero + Text', description: 'Bada banner heading ke saath, niche paragraph', icon: LayoutTemplate,
    sections: [
      { type: 'hero', data: { heading: '', subheading: '', backgroundImage: '' } },
      { type: 'text', data: { heading: '', body: '' } },
    ],
  },
  {
    id: 'gallery-showcase', name: 'Gallery Showcase', description: 'Hero + image gallery grid', icon: GalleryHorizontal,
    sections: [
      { type: 'hero', data: { heading: '', subheading: '', backgroundImage: '' } },
      { type: 'gallery', data: { images: [] } },
    ],
  },
  {
    id: 'landing-cta', name: 'Landing + Call To Action', description: 'Hero + text + neeche action button', icon: MousePointerClick,
    sections: [
      { type: 'hero', data: { heading: '', subheading: '', backgroundImage: '' } },
      { type: 'text', data: { heading: '', body: '' } },
      { type: 'cta', data: { heading: '', buttonText: '', buttonLink: '' } },
    ],
  },
  { id: 'blank', name: 'Blank Page', description: 'Khud se section add karo', icon: FileStack, sections: [] },
];

const fieldClass =
  'w-full px-3 py-2.5 bg-slate-50 border border-[var(--pa-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--pa-primary)] focus:ring-2 focus:ring-[var(--pa-primary)]/10 transition';

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState('template');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [sections, setSections] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const pickTemplate = (tpl) => {
    setSelectedTemplate(tpl.id);
    setSections(JSON.parse(JSON.stringify(tpl.sections)));
    setStep('editor');
  };

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
        body: JSON.stringify({ title, slug, template: selectedTemplate, sections, status }),
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

  /* ---------------- STEP 1: Template selection ---------------- */
  if (step === 'template') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/admin/pages')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Template chuno</h1>
            <p className="text-slate-500 text-sm">Ek starting point select karo, baad mein customize kar sakte ho.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TEMPLATES.map((tpl) => {
            const Icon = tpl.icon;
            return (
              <button
                key={tpl.id}
                onClick={() => pickTemplate(tpl)}
                className="text-left p-5 bg-white rounded-2xl border border-[var(--pa-border)] hover:border-[var(--pa-primary)] hover:shadow-md transition group"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform"
                  style={{ background: 'var(--pa-primary-light,#eaf7ee)' }}
                >
                  <Icon className="w-5 h-5" style={{ color: 'var(--pa-primary,#2f9e44)' }} />
                </div>
                <div className="font-semibold text-slate-800 mb-1">{tpl.name}</div>
                <div className="text-xs text-slate-500 leading-relaxed">{tpl.description}</div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* ---------------- STEP 2: Editor ---------------- */
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <button onClick={() => setStep('template')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-2xl font-bold text-slate-800">Page details</h1>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}

      <div className="bg-white rounded-2xl border border-[var(--pa-border)] p-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Page Title *</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Plant Care Guide" className={fieldClass} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            URL / Slug — khali chhodo to title se auto-generate hoga
          </label>
          <div className="flex items-center gap-1">
            <span className="text-slate-400 text-sm">yoursite.com/</span>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="plant-care-guide" className={`${fieldClass} flex-1`} />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Sirf lowercase letters, numbers aur hyphen (-) chalega. Publish karne ke baad ye hi page ka live URL banega.
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-3">Sections</h2>

        <div className="space-y-4">
          {sections.map((section, index) => {
            const meta = SECTION_META[section.type];
            const Icon = meta.icon;
            return (
              <div key={index} className="bg-white rounded-2xl border border-[var(--pa-border)] overflow-hidden" style={{ borderLeft: `4px solid ${meta.color}` }}>
                <div className="flex items-center justify-between px-5 pt-4 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${meta.color}1a` }}>
                      <Icon className="w-3.5 h-3.5" style={{ color: meta.color }} />
                    </div>
                    <span className="font-semibold text-slate-800 text-sm">{meta.label}</span>
                  </div>
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

                <div className="px-5 pb-5 space-y-3">
                  {section.type === 'hero' && (
                    <>
                      <input placeholder="Heading" value={section.data.heading || ''} onChange={(e) => updateSectionField(index, 'heading', e.target.value)} className={fieldClass} />
                      <input placeholder="Subheading" value={section.data.subheading || ''} onChange={(e) => updateSectionField(index, 'subheading', e.target.value)} className={fieldClass} />
                      <ImageUploader label="Background Image" value={section.data.backgroundImage} onChange={(url) => updateSectionField(index, 'backgroundImage', url)} />
                    </>
                  )}
                  {section.type === 'cta' && (
                    <>
                      <input placeholder="Heading" value={section.data.heading || ''} onChange={(e) => updateSectionField(index, 'heading', e.target.value)} className={fieldClass} />
                      <input placeholder="Button Text" value={section.data.buttonText || ''} onChange={(e) => updateSectionField(index, 'buttonText', e.target.value)} className={fieldClass} />
                      <input placeholder="Button Link (e.g. /contact)" value={section.data.buttonLink || ''} onChange={(e) => updateSectionField(index, 'buttonLink', e.target.value)} className={fieldClass} />
                    </>
                  )}
                  {section.type === 'text' && (
                    <>
                      <input placeholder="Heading (optional)" value={section.data.heading || ''} onChange={(e) => updateSectionField(index, 'heading', e.target.value)} className={fieldClass} />
                      <textarea placeholder="Paragraph text" value={section.data.body || ''} onChange={(e) => updateSectionField(index, 'body', e.target.value)} rows={4} className={fieldClass} />
                    </>
                  )}
                  {section.type === 'image' && (
                    <>
                      <ImageUploader label="Image" value={section.data.imageUrl} onChange={(url) => updateSectionField(index, 'imageUrl', url)} />
                      <input placeholder="Caption (optional)" value={section.data.caption || ''} onChange={(e) => updateSectionField(index, 'caption', e.target.value)} className={fieldClass} />
                    </>
                  )}
                  {section.type === 'gallery' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-2">Gallery Images</label>
                      <div className="flex flex-wrap gap-3 mb-3">
                        {(section.data.images || []).map((img, gi) => (
                          <div key={gi} className="relative">
                            <img src={img} alt="" className="w-24 h-24 object-cover rounded-lg border border-[var(--pa-border)]" />
                            <button onClick={() => removeGalleryImage(index, gi)} className="absolute -top-2 -right-2 bg-white border border-[var(--pa-border)] rounded-full p-1 shadow hover:bg-red-50">
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
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {SECTION_TYPES.map((type) => {
            const meta = SECTION_META[type];
            const Icon = meta.icon;
            return (
              <button
                key={type}
                onClick={() => addSection(type)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-[var(--pa-border)] rounded-lg hover:bg-slate-50 text-slate-600 transition"
              >
                <Icon className="w-3.5 h-3.5" style={{ color: meta.color }} />
                {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3 pb-8">
        <button disabled={saving} onClick={() => savePage('draft')} className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition disabled:opacity-50">
          Save as Draft
        </button>
        <button disabled={saving} onClick={() => savePage('active')} className="px-5 py-2.5 rounded-xl text-white font-semibold text-sm shadow-md hover:opacity-90 transition disabled:opacity-50" style={{ background: 'var(--pa-primary,#2f9e44)' }}>
          {saving ? 'Saving...' : 'Publish (Active)'}
        </button>
      </div>
    </div>
  );
}