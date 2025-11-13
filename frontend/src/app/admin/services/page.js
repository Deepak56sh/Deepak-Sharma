'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Filter, Loader2, ArrowUpDown } from 'lucide-react';

export default function ManageServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [sortConfig, setSortConfig] = useState({ key: 'order', direction: 'asc' });

  useEffect(() => {
    fetchServices();
    fetchStats();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!res.ok) throw new Error('Failed to fetch services');
      
      const data = await res.json();
      setServices(data.data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      alert('Failed to load services');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/stats/all`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!res.ok) throw new Error('Failed to fetch stats');
      
      const data = await res.json();
      setStats(data.data || { total: 0, active: 0, inactive: 0 });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({ total: 0, active: 0, inactive: 0 });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (res.ok) {
        alert('Service deleted successfully');
        fetchServices();
        fetchStats();
      } else {
        const error = await res.json();
        alert(error.message || 'Error deleting service');
      }
    } catch (error) {
      alert('Error deleting service');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/${id}/toggle`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (res.ok) {
        fetchServices();
        fetchStats();
      } else {
        const error = await res.json();
        alert(error.message || 'Error toggling service status');
      }
    } catch (error) {
      alert('Error toggling service status');
    }
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  // Filter and sort services
  const filteredServices = services
    .filter(service => {
      const matchesSearch = service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || service.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'active' && service.isActive) ||
                           (filterStatus === 'inactive' && !service.isActive);
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      if (sortConfig.key === 'title') {
        return sortConfig.direction === 'asc' 
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      if (sortConfig.key === 'order') {
        return sortConfig.direction === 'asc' 
          ? (a.order || 0) - (b.order || 0)
          : (b.order || 0) - (a.order || 0);
      }
      if (sortConfig.key === 'category') {
        return sortConfig.direction === 'asc'
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category);
      }
      return 0;
    });

  const SortableHeader = ({ children, sortKey }) => (
    <button
      onClick={() => handleSort(sortKey)}
      className="flex items-center gap-1 hover:text-white transition-colors"
    >
      {children}
      <ArrowUpDown className="w-3 h-3" />
    </button>
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Manage Services</h1>
          <p className="text-gray-400">Add, edit, and organize your services</p>
        </div>
        <button
          onClick={() => {
            setEditingService(null);
            setShowModal(true);
          }}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Add New Service
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-6 hover:border-purple-500/40 transition-all">
          <p className="text-gray-400 text-sm mb-1">Total Services</p>
          <p className="text-3xl font-bold text-white">{stats?.total || 0}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-green-500/20 p-6 hover:border-green-500/40 transition-all">
          <p className="text-gray-400 text-sm mb-1">Active Services</p>
          <p className="text-3xl font-bold text-green-400">{stats?.active || 0}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-red-500/20 p-6 hover:border-red-500/40 transition-all">
          <p className="text-gray-400 text-sm mb-1">Inactive Services</p>
          <p className="text-3xl font-bold text-red-400">{stats?.inactive || 0}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-slate-800/30 p-4 rounded-xl border border-purple-500/10">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search services by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-all"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-all min-w-[150px]"
            >
              <option value="all">All Categories</option>
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Cloud">Cloud</option>
              <option value="AI">AI</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-all min-w-[150px]"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            <span className="ml-3 text-gray-400">Loading services...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    <SortableHeader sortKey="title">Service</SortableHeader>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    <SortableHeader sortKey="category">Category</SortableHeader>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    <SortableHeader sortKey="order">Order</SortableHeader>
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/10">
                {filteredServices.map((service) => (
                  <tr key={service._id} className="hover:bg-slate-900/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={service.image} 
                          alt={service.title}
                          className="w-12 h-12 rounded-lg object-cover border border-purple-500/20 group-hover:border-purple-500/40 transition-all"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1556655848-f3a7049761e4?w=200&q=80';
                          }}
                        />
                        <div>
                          <p className="text-white font-semibold group-hover:text-purple-300 transition-colors">
                            {service.title}
                          </p>
                          <p className="text-gray-400 text-sm line-clamp-2 max-w-xs">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-semibold border border-purple-500/30">
                        {service.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(service._id)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all hover:scale-105 ${
                          service.isActive 
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                            : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        }`}
                      >
                        {service.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {service.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400 font-mono bg-slate-900/50 px-2 py-1 rounded">
                        {service.order || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingService(service);
                            setShowModal(true);
                          }}
                          className="p-2 hover:bg-purple-500/20 rounded-lg text-purple-400 hover:text-purple-300 transition-all group/btn"
                          title="Edit Service"
                        >
                          <Edit className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={() => handleDelete(service._id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-all group/btn"
                          title="Delete Service"
                        >
                          <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredServices.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">
                  {services.length === 0 ? 'No services found' : 'No services match your filters'}
                </div>
                {services.length === 0 && (
                  <button
                    onClick={() => setShowModal(true)}
                    className="text-purple-400 hover:text-purple-300 font-semibold"
                  >
                    Create your first service
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Summary */}
      {!loading && filteredServices.length > 0 && (
        <div className="text-center text-gray-400 text-sm">
          Showing {filteredServices.length} of {services.length} services
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ServiceModal
          service={editingService}
          onClose={() => {
            setShowModal(false);
            setEditingService(null);
          }}
          onSuccess={() => {
            fetchServices();
            fetchStats();
            setShowModal(false);
            setEditingService(null);
          }}
        />
      )}
    </div>
  );
}

// Service Modal Component (Same as before, but with improved error handling)
function ServiceModal({ service, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: service?.title || '',
    description: service?.description || '',
    image: service?.image || '',
    icon: service?.icon || 'Code',
    color: service?.color || 'from-purple-500 to-pink-500',
    category: service?.category || 'Development',
    price: service?.price || 'Contact for pricing',
    duration: service?.duration || 'Varies',
    isActive: service?.isActive ?? true,
    order: service?.order || 0,
    features: service?.features || [''],
    tags: service?.tags?.join(', ') || '',
    metaTitle: service?.metaTitle || '',
    metaDescription: service?.metaDescription || ''
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.image.trim()) newErrors.image = 'Image URL is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSaving(true);
    setErrors({});

    try {
      const token = localStorage.getItem('token');
      const url = service
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/services/${service._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/services`;
      
      const method = service ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        features: formData.features.filter(f => f.trim() !== ''),
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t !== ''),
        metaTitle: formData.metaTitle || formData.title,
        metaDescription: formData.metaDescription || formData.description.substring(0, 160)
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Service ${service ? 'updated' : 'created'} successfully`);
        onSuccess();
      } else {
        alert(data.message || `Error ${service ? 'updating' : 'creating'} service`);
      }
    } catch (error) {
      alert(`Network error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-900 rounded-2xl border border-purple-500/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-900 border-b border-purple-500/20 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {service ? 'Edit Service' : 'Add New Service'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white transition-all"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Service Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-white focus:outline-none transition-all ${
                  errors.title ? 'border-red-500' : 'border-purple-500/20 focus:border-purple-500'
                }`}
                placeholder="e.g., Web Development"
              />
              {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">Category *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Cloud">Cloud</option>
                <option value="AI">AI</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Description *</label>
            <textarea
              required
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-white focus:outline-none transition-all ${
                errors.description ? 'border-red-500' : 'border-purple-500/20 focus:border-purple-500'
              }`}
              placeholder="Brief description of the service"
            />
            {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
            <p className="text-gray-500 text-sm mt-1">{formData.description.length}/500 characters</p>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Image URL *</label>
            <input
              type="url"
              required
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-white focus:outline-none transition-all ${
                errors.image ? 'border-red-500' : 'border-purple-500/20 focus:border-purple-500'
              }`}
              placeholder="https://example.com/image.jpg"
            />
            {errors.image && <p className="text-red-400 text-sm mt-1">{errors.image}</p>}
          </div>

          {/* Rest of the form remains the same as your original modal */}
          {/* ... (Icon, Color, Price, Duration, Features, Tags, Order, Status sections) */}

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t border-purple-500/10">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {service ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                service ? 'Update Service' : 'Create Service'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-6 py-3 bg-slate-800 rounded-lg text-gray-300 font-semibold hover:bg-slate-700 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}