'use client';
import { useState, useEffect } from 'react';
import { Loader2, Save, Upload, Trash2, Plus, Award, Users } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

export default function AboutPageAdmin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Award form state
  const [awardForm, setAwardForm] = useState({ title: '' });
  const [awardImageFile, setAwardImageFile] = useState(null);
  const [awardPreview, setAwardPreview] = useState('');
  const [addingAward, setAddingAward] = useState(false);

  // Team member form state
  const [memberForm, setMemberForm] = useState({ name: '', position: '' });
  const [memberImageFile, setMemberImageFile] = useState(null);
  const [memberPreview, setMemberPreview] = useState('');
  const [addingMember, setAddingMember] = useState(false);

  const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/about`, { cache: 'no-cache' })
      .then((r) => r.json())
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  // Generic image uploader — returns the Cloudinary URL
  const uploadImage = async (file) => {
    const token = getToken();
    const fd = new FormData();
    fd.append('image', file);
    const res = await fetch(`${API_BASE_URL}/about/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    const result = await res.json();
    if (!result.success) throw new Error(result.message || 'Upload failed');
    return result.data.imageUrl;
  };

  // ===== Main team/hero image =====
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      setData((prev) => ({ ...prev, teamImage: imageUrl }));
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/about`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!result.success) alert(result.message || 'Failed to save');
      else setData(result.data);
    } catch (err) {
      alert('Failed to save — check API connection.');
    } finally {
      setSaving(false);
    }
  };

  const updateStat = (i, field, value) => {
    const stats = [...(data.stats || [])];
    stats[i] = { ...stats[i], [field]: value };
    setData({ ...data, stats });
  };

  const updateValue = (i, field, value) => {
    const values = [...(data.values || [])];
    values[i] = { ...values[i], [field]: value };
    setData({ ...data, values });
  };

  // ===== Awards =====
  const handleAwardImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAwardImageFile(file);
      setAwardPreview(URL.createObjectURL(file));
    }
  };

  const handleAddAward = async () => {
    if (!awardForm.title.trim()) {
      alert('Award title is required (e.g. "Best Organic Farm 2024")');
      return;
    }
    if (!awardImageFile) {
      alert('Award image is required');
      return;
    }
    setAddingAward(true);
    try {
      const imageUrl = await uploadImage(awardImageFile);
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/about/awards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: awardForm.title, image: imageUrl }),
      });
      const result = await res.json();
      if (result.success) {
        setData(result.data);
        setAwardForm({ title: '' });
        setAwardImageFile(null);
        setAwardPreview('');
      } else {
        alert(result.message || 'Failed to add award');
      }
    } catch (err) {
      alert('Failed to add award');
    } finally {
      setAddingAward(false);
    }
  };

  const handleDeleteAward = async (id) => {
    if (!confirm('Delete this award?')) return;
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/about/awards/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (result.success) setData(result.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ===== Team Members =====
  const handleMemberImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMemberImageFile(file);
      setMemberPreview(URL.createObjectURL(file));
    }
  };

  const handleAddMember = async () => {
    if (!memberForm.name.trim() || !memberForm.position.trim()) {
      alert('Name and position are required');
      return;
    }
    if (!memberImageFile) {
      alert('Member photo is required');
      return;
    }
    setAddingMember(true);
    try {
      const imageUrl = await uploadImage(memberImageFile);
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/about/team`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: memberForm.name, position: memberForm.position, image: imageUrl }),
      });
      const result = await res.json();
      if (result.success) {
        setData(result.data);
        setMemberForm({ name: '', position: '' });
        setMemberImageFile(null);
        setMemberPreview('');
      } else {
        alert(result.message || 'Failed to add team member');
      }
    } catch (err) {
      alert('Failed to add team member');
    } finally {
      setAddingMember(false);
    }
  };

  const handleDeleteMember = async (id) => {
    if (!confirm('Remove this team member?')) return;
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/about/team/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (result.success) setData(result.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-16 text-center text-slate-400 flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Loading...</div>;
  }

  if (!data) {
    return <div className="p-16 text-center text-slate-400">Could not load About page data — check your /api/about endpoint.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">About Page</h1>
          <p className="text-slate-500 text-sm">Edit the content shown on your public /about page.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 text-white font-medium px-4 py-2.5 rounded-lg disabled:opacity-50"
          style={{ backgroundColor: 'var(--pa-primary)' }}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
        </button>
      </div>

      {/* ===== Main content ===== */}
      <div className="bg-white rounded-xl border border-[var(--pa-border)] p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-600 text-sm mb-2">Title</label>
            <input value={data.title || ''} onChange={(e) => setData({ ...data, title: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-[var(--pa-border)] rounded-lg focus:outline-none focus:border-[var(--pa-primary)]" />
          </div>
          <div>
            <label className="block text-slate-600 text-sm mb-2">Subtitle</label>
            <input value={data.subtitle || ''} onChange={(e) => setData({ ...data, subtitle: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-[var(--pa-border)] rounded-lg focus:outline-none focus:border-[var(--pa-primary)]" />
          </div>
        </div>

        <div>
          <label className="block text-slate-600 text-sm mb-2">Main Heading</label>
          <input value={data.mainHeading || ''} onChange={(e) => setData({ ...data, mainHeading: e.target.value })}
            className="w-full p-3 bg-slate-50 border border-[var(--pa-border)] rounded-lg focus:outline-none focus:border-[var(--pa-primary)]" />
        </div>

        <div>
          <label className="block text-slate-600 text-sm mb-2">Description 1</label>
          <textarea rows={3} value={data.description1 || ''} onChange={(e) => setData({ ...data, description1: e.target.value })}
            className="w-full p-3 bg-slate-50 border border-[var(--pa-border)] rounded-lg focus:outline-none focus:border-[var(--pa-primary)] resize-none" />
        </div>
        <div>
          <label className="block text-slate-600 text-sm mb-2">Description 2</label>
          <textarea rows={3} value={data.description2 || ''} onChange={(e) => setData({ ...data, description2: e.target.value })}
            className="w-full p-3 bg-slate-50 border border-[var(--pa-border)] rounded-lg focus:outline-none focus:border-[var(--pa-primary)] resize-none" />
        </div>

        <div>
          <label className="block text-slate-600 text-sm mb-2">Team Image</label>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
              {data.teamImage && <img src={data.teamImage} alt="" className="w-full h-full object-cover" />}
            </div>
            <label className="px-4 py-2 rounded-lg border border-[var(--pa-border)] text-sm text-slate-600 cursor-pointer hover:border-[var(--pa-primary)] flex items-center gap-2">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Upload Image
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
            </label>
          </div>
        </div>

        {/* Stats */}
        <div>
          <label className="block text-slate-600 text-sm mb-2">Stats</label>
          <div className="grid sm:grid-cols-2 gap-3">
            {(data.stats || []).map((stat, i) => (
              <div key={i} className="flex gap-2">
                <input value={stat.number} onChange={(e) => updateStat(i, 'number', e.target.value)} placeholder="500+"
                  className="w-24 p-2.5 bg-slate-50 border border-[var(--pa-border)] rounded-lg text-sm" />
                <input value={stat.label} onChange={(e) => updateStat(i, 'label', e.target.value)} placeholder="Label"
                  className="flex-1 p-2.5 bg-slate-50 border border-[var(--pa-border)] rounded-lg text-sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div>
          <label className="block text-slate-600 text-sm mb-2">Core Values</label>
          <div className="space-y-3">
            {(data.values || []).map((v, i) => (
              <div key={i} className="grid sm:grid-cols-[60px_1fr_2fr] gap-2 p-3 bg-slate-50 rounded-lg">
                <input value={v.emoji} onChange={(e) => updateValue(i, 'emoji', e.target.value)} placeholder="🌾"
                  className="p-2 bg-white border border-[var(--pa-border)] rounded-lg text-center" />
                <input value={v.title} onChange={(e) => updateValue(i, 'title', e.target.value)} placeholder="Title"
                  className="p-2 bg-white border border-[var(--pa-border)] rounded-lg text-sm" />
                <input value={v.description} onChange={(e) => updateValue(i, 'description', e.target.value)} placeholder="Description"
                  className="p-2 bg-white border border-[var(--pa-border)] rounded-lg text-sm" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Awards (NEW) ===== */}
      <div className="bg-white rounded-xl border border-[var(--pa-border)] p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5" style={{ color: 'var(--pa-primary)' }} />
          <h2 className="text-lg font-semibold text-slate-800">Awards</h2>
        </div>

        {/* Add award form */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end p-4 bg-slate-50 rounded-lg">
          <div className="flex-1 w-full">
            <label className="block text-slate-600 text-xs mb-1.5">Award Title (what was it for)</label>
            <input
              value={awardForm.title}
              onChange={(e) => setAwardForm({ title: e.target.value })}
              placeholder="Best Organic Farm 2024"
              className="w-full p-2.5 bg-white border border-[var(--pa-border)] rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-slate-600 text-xs mb-1.5">Award Image</label>
            <div className="flex items-center gap-2">
              <label className="px-3 py-2.5 rounded-lg border border-[var(--pa-border)] text-sm text-slate-600 cursor-pointer hover:border-[var(--pa-primary)] flex items-center gap-2 bg-white">
                <Upload className="w-4 h-4" />
                {awardImageFile ? awardImageFile.name.slice(0, 12) + '…' : 'Choose'}
                <input type="file" accept="image/*" className="hidden" onChange={handleAwardImageChange} />
              </label>
              {awardPreview && <img src={awardPreview} className="w-10 h-10 object-cover rounded-lg" />}
            </div>
          </div>
          <button
            onClick={handleAddAward}
            disabled={addingAward}
            className="flex items-center gap-1.5 text-white text-sm font-medium px-4 py-2.5 rounded-lg disabled:opacity-50 whitespace-nowrap"
            style={{ backgroundColor: 'var(--pa-primary)' }}
          >
            {addingAward ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add Award
          </button>
        </div>

        {/* Awards list */}
        {(data.awards || []).length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.awards.map((award) => (
              <div key={award._id} className="flex items-center gap-3 p-3 border border-[var(--pa-border)] rounded-lg">
                <img src={award.image} alt="" className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
                <p className="flex-1 text-sm text-slate-700 leading-snug">{award.title}</p>
                <button onClick={() => handleDeleteAward(award._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg flex-shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== Team Members (NEW) ===== */}
      <div className="bg-white rounded-xl border border-[var(--pa-border)] p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" style={{ color: 'var(--pa-primary)' }} />
          <h2 className="text-lg font-semibold text-slate-800">Team Members</h2>
        </div>

        {/* Add member form */}
        <div className="grid sm:grid-cols-[1fr_1fr_auto_auto] gap-3 items-end p-4 bg-slate-50 rounded-lg">
          <div>
            <label className="block text-slate-600 text-xs mb-1.5">Name</label>
            <input
              value={memberForm.name}
              onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
              placeholder="Ramesh Patel"
              className="w-full p-2.5 bg-white border border-[var(--pa-border)] rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-slate-600 text-xs mb-1.5">Position</label>
            <input
              value={memberForm.position}
              onChange={(e) => setMemberForm({ ...memberForm, position: e.target.value })}
              placeholder="Farm Manager"
              className="w-full p-2.5 bg-white border border-[var(--pa-border)] rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-slate-600 text-xs mb-1.5">Photo</label>
            <div className="flex items-center gap-2">
              <label className="px-3 py-2.5 rounded-lg border border-[var(--pa-border)] text-sm text-slate-600 cursor-pointer hover:border-[var(--pa-primary)] flex items-center gap-2 bg-white">
                <Upload className="w-4 h-4" />
                {memberImageFile ? 'Selected' : 'Choose'}
                <input type="file" accept="image/*" className="hidden" onChange={handleMemberImageChange} />
              </label>
              {memberPreview && <img src={memberPreview} className="w-10 h-10 object-cover rounded-full" />}
            </div>
          </div>
          <button
            onClick={handleAddMember}
            disabled={addingMember}
            className="flex items-center gap-1.5 text-white text-sm font-medium px-4 py-2.5 rounded-lg disabled:opacity-50 whitespace-nowrap"
            style={{ backgroundColor: 'var(--pa-primary)' }}
          >
            {addingMember ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add
          </button>
        </div>

        {/* Members list */}
        {(data.teamMembers || []).length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.teamMembers.map((member) => (
              <div key={member._id} className="flex items-center gap-3 p-3 border border-[var(--pa-border)] rounded-lg">
                <img src={member.image} alt="" className="w-14 h-14 object-cover rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">{member.name}</p>
                  <p className="text-xs text-slate-500">{member.position}</p>
                </div>
                <button onClick={() => handleDeleteMember(member._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg flex-shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}