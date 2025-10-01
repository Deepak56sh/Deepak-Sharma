// ============================================
// FILE: src/app/admin/services/page.js
// ============================================
'use client';
import { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

export default function ServicesManagement() {
  const [services, setServices] = useState([
    {
      id: 1,
      title: 'Web Development',
      description: 'Build responsive, high-performance websites that engage and convert your audience with modern technologies.',
      features: ['React & Next.js', 'Responsive Design', 'SEO Optimized', 'Fast Performance'],
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80'
    },
    {
      id: 2,
      title: 'Mobile Apps',
      description: 'Native and cross-platform mobile solutions for iOS and Android that deliver seamless experiences.',
      features: ['iOS & Android', 'Cross-Platform', 'Native Performance', 'App Store Ready'],
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&q=80'
    }
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const handleEdit = (service) => {
    setEditingService({ ...service });
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const handleSave = () => {
    if (editingService.id) {
      setServices(services.map(s => s.id === editingService.id ? editingService : s));
    } else {
      setServices([...services, { ...editingService, id: Date.now() }]);
    }
    setIsEditing(false);
    setEditingService(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Services Management</h1>
          <p className="text-gray-400">Manage your service offerings</p>
        </div>
        <button
          onClick={() => {
            setEditingService({ title: '', description: '', features: [''], image: '' });
            setIsEditing(true);
          }}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-slate-800 rounded-2xl border border-purple-500/20 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingService.id ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-slate-600"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Service Title</label>
                <input
                  type="text"
                  value={editingService.title}
                  onChange={(e) => setEditingService({...editingService, title: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="e.g., Web Development"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">Description</label>
                <textarea
                  value={editingService.description}
                  onChange={(e) => setEditingService({...editingService, description: e.target.value})}
                  rows="4"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 resize-none"
                  placeholder="Describe the service..."
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">Image URL</label>
                <input
                  type="text"
                  value={editingService.image}
                  onChange={(e) => setEditingService({...editingService, image: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">Features (comma separated)</label>
                <input
                  type="text"
                  value={editingService.features?.join(', ') || ''}
                  onChange={(e) => setEditingService({...editingService, features: e.target.value.split(',').map(f => f.trim())})}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="Feature 1, Feature 2, Feature 3"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:shadow-lg transition-all"
                >
                  Save Service
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-slate-700 rounded-lg text-white hover:bg-slate-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-slate-800/50 rounded-xl border border-purple-500/20 overflow-hidden">
            <img src={service.image} alt={service.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
              <p className="text-gray-400 mb-4">{service.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {service.features.map((feature, i) => (
                  <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                    {feature}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="flex-1 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="flex-1 px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
