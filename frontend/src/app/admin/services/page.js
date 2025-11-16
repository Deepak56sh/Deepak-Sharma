// ============================================
// FILE: src/components/admin/ManageServices.js (FULLY RESPONSIVE)
// ============================================
'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Filter, Loader2, ArrowUpDown, Upload, X, Image as ImageIcon } from 'lucide-react';

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
  const [uploadingImage, setUploadingImage] = useState(false);

  // ✅ Get token function
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminToken');
    }
    return null;
  };

  useEffect(() => {
    fetchServices();
    fetchStats();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        console.error('No token found');
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api'}/services`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch services: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Services data:', data); // Debug log
      setServices(data.data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      alert('Failed to load services. Check console for details.');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api'}/services/admin/stats`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setStats(data.data || { total: 0, active: 0, inactive: 0 });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Set default stats
      setStats({ 
        total: services.length, 
        active: services.filter(s => s.isActive).length, 
        inactive: services.filter(s => !s.isActive).length 
      });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) return;
    
    try {
      const token = getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api'}/services/${id}`, {
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
        const errorData = await res.json();
        alert(errorData.message || 'Error deleting service');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting service. Check console for details.');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const token = getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api'}/services/${id}/toggle`, {
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
        const errorData = await res.json();
        alert(errorData.message || 'Error toggling service status');
      }
    } catch (error) {
      console.error('Toggle status error:', error);
      alert('Error toggling service status');
    }
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  // Upload image function
  const uploadImage = async (file) => {
    setUploadingImage(true);
    try {
      // For now, we'll create a mock upload since backend doesn't have actual upload
      // In production, you should upload to Cloudinary, AWS S3, or your server
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockUrl = URL.createObjectURL(file);
          resolve(mockUrl);
        }, 1000);
      });
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
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
          ? a.title?.localeCompare(b.title)
          : b.title?.localeCompare(a.title);
      }
      if (sortConfig.key === 'order') {
        return sortConfig.direction === 'asc' 
          ? (a.order || 0) - (b.order || 0)
          : (b.order || 0) - (a.order || 0);
      }
      if (sortConfig.key === 'category') {
        return sortConfig.direction === 'asc'
          ? a.category?.localeCompare(b.category)
          : b.category?.localeCompare(a.category);
      }
      return 0;
    });

  const SortableHeader = ({ children, sortKey }) => (
    <button
      onClick={() => handleSort(sortKey)}
      className="flex items-center gap-1 hover:text-white transition-colors text-left text-xs sm:text-sm"
    >
      {children}
      <ArrowUpDown className="w-3 h-3" />
    </button>
  );

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6 p-4 sm:p-5 lg:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">Manage Services</h1>
          <p className="text-gray-400 text-xs sm:text-sm">Add, edit, and organize your services</p>
        </div>
        <button
          onClick={() => {
            setEditingService(null);
            setShowModal(true);
          }}
          className="px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:shadow-lg transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap text-sm sm:text-base"
        >
          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
          Add New Service
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-3 sm:p-4 lg:p-6 hover:border-purple-500/40 transition-all">
          <p className="text-gray-400 text-xs sm:text-sm mb-1">Total Services</p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{stats?.total || 0}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-green-500/20 p-3 sm:p-4 lg:p-6 hover:border-green-500/40 transition-all">
          <p className="text-gray-400 text-xs sm:text-sm mb-1">Active Services</p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-400">{stats?.active || 0}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-red-500/20 p-3 sm:p-4 lg:p-6 hover:border-red-500/40 transition-all">
          <p className="text-gray-400 text-xs sm:text-sm mb-1">Inactive Services</p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-400">{stats?.inactive || 0}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 bg-slate-800/30 p-3 sm:p-4 rounded-xl border border-purple-500/10">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
          <input
            type="text"
            placeholder="Search services by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 sm:pl-9 lg:pl-10 pr-4 py-1.5 sm:py-2 lg:py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-all text-xs sm:text-sm lg:text-base"
          />
        </div>
        
        <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 lg:gap-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Filter className="text-gray-400 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 lg:py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-all min-w-[120px] sm:min-w-[140px] lg:min-w-[150px] text-xs sm:text-sm lg:text-base"
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
            className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 lg:py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-all min-w-[120px] sm:min-w-[140px] lg:min-w-[150px] text-xs sm:text-sm lg:text-base"
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
          <div className="flex justify-center items-center py-12 sm:py-16 lg:py-20">
            <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-purple-500 animate-spin" />
            <span className="ml-2 sm:ml-3 text-gray-400 text-xs sm:text-sm lg:text-base">Loading services...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-300">
                    <SortableHeader sortKey="title">Service</SortableHeader>
                  </th>
                  <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-300">
                    <SortableHeader sortKey="category">Category</SortableHeader>
                  </th>
                  <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-300">
                    <SortableHeader sortKey="order">Order</SortableHeader>
                  </th>
                  <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-right text-xs sm:text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/10">
                {filteredServices.map((service) => (
                  <tr key={service._id} className="hover:bg-slate-900/30 transition-colors group">
                    <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4">
                      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                        <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg overflow-hidden border border-purple-500/20 group-hover:border-purple-500/40 transition-all flex-shrink-0">
                          <img 
                            src={service.image} 
                            alt={service.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1556655848-f3a7049761e4?w=200&q=80';
                            }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-white font-semibold text-xs sm:text-sm lg:text-base group-hover:text-purple-300 transition-colors truncate">
                            {service.title}
                          </p>
                          <p className="text-gray-400 text-xs line-clamp-2">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4">
                      <span className="px-1.5 sm:px-2 lg:px-3 py-0.5 sm:py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-semibold border border-purple-500/30 whitespace-nowrap">
                        {service.category}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4">
                      <button
                        onClick={() => handleToggleStatus(service._id)}
                        className={`px-1.5 sm:px-2 lg:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all hover:scale-105 ${
                          service.isActive 
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                            : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        }`}
                      >
                        {service.isActive ? <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <EyeOff className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                        <span className="hidden xs:inline">
                          {service.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </button>
                    </td>
                    <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4">
                      <span className="text-gray-400 font-mono bg-slate-900/50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm">
                        {service.order || 0}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <button
                          onClick={() => {
                            setEditingService(service);
                            setShowModal(true);
                          }}
                          className="p-1 sm:p-1.5 lg:p-2 hover:bg-purple-500/20 rounded-lg text-purple-400 hover:text-purple-300 transition-all group/btn"
                          title="Edit Service"
                        >
                          <Edit className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 group-hover/btn:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={() => handleDelete(service._id)}
                          className="p-1 sm:p-1.5 lg:p-2 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-all group/btn"
                          title="Delete Service"
                        >
                          <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 group-hover/btn:scale-110 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredServices.length === 0 && (
              <div className="text-center py-8 sm:py-10 lg:py-12">
                <div className="text-gray-400 mb-1.5 sm:mb-2 text-xs sm:text-sm lg:text-base">
                  {services.length === 0 ? 'No services found' : 'No services match your filters'}
                </div>
                {services.length === 0 && (
                  <button
                    onClick={() => setShowModal(true)}
                    className="text-purple-400 hover:text-purple-300 font-semibold text-xs sm:text-sm lg:text-base"
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
        <div className="text-center text-gray-400 text-xs sm:text-sm">
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
          onImageUpload={uploadImage}
          uploadingImage={uploadingImage}
        />
      )}
    </div>
  );
}

// Service Modal Component with Image Upload
function ServiceModal({ service, onClose, onSuccess, onImageUpload, uploadingImage }) {
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
  const [imagePreview, setImagePreview] = useState(service?.image || '');

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.image.trim()) newErrors.image = 'Image URL is required';
    if (formData.description.length > 500) newErrors.description = 'Description must be less than 500 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSaving(true);
    setErrors({});

    try {
      const token = localStorage.getItem('adminToken');
      const url = service
        ? `${process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api'}/services/${service._id}`
        : `${process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api'}/services`;
      
      const method = service ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        features: formData.features.filter(f => f.trim() !== ''),
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t !== ''),
        metaTitle: formData.metaTitle || formData.title,
        metaDescription: formData.metaDescription || formData.description.substring(0, 160)
      };

      console.log('Sending payload:', payload); // Debug log

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      console.log('Response:', data); // Debug log

      if (res.ok) {
        alert(`Service ${service ? 'updated' : 'created'} successfully`);
        onSuccess();
      } else {
        alert(data.message || `Error ${service ? 'updating' : 'creating'} service`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert(`Network error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For now, we'll use a placeholder since we don't have actual upload
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setFormData({ ...formData, image: imageUrl });
        setImagePreview(imageUrl);
      };
      reader.readAsDataURL(file);
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

  const iconOptions = [
    'Code', 'Smartphone', 'Palette', 'Cloud', 'Brain', 
    'TrendingUp', 'Database', 'Lock', 'Globe', 'Zap'
  ];

  const colorOptions = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-teal-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500',
    'from-pink-500 to-rose-500',
    'from-emerald-500 to-teal-500'
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-3 lg:p-4 overflow-y-auto">
      <div className="bg-slate-900 rounded-lg sm:rounded-xl lg:rounded-2xl border border-purple-500/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-900 border-b border-purple-500/20 p-3 sm:p-4 lg:p-6 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
            {service ? 'Edit Service' : 'Add New Service'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 sm:p-1.5 lg:p-2 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6">
          {/* Image Upload Section */}
          <div>
            <label className="block text-gray-300 mb-1.5 sm:mb-2 font-medium text-xs sm:text-sm lg:text-base">Service Image</label>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start">
              {/* Image Preview */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-lg border-2 border-dashed border-purple-500/30 bg-slate-800/50 overflow-hidden">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Upload Controls */}
              <div className="flex-1 space-y-2 sm:space-y-3">
                <div>
                  <label className="block text-gray-400 text-xs sm:text-sm mb-1">Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-xs sm:text-sm text-gray-400 file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-purple-500/20 file:text-purple-400 hover:file:bg-purple-500/30"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-xs sm:text-sm mb-1">Or Enter Image URL</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => {
                      setFormData({ ...formData, image: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-800/50 border rounded-lg text-white focus:outline-none transition-all text-xs sm:text-sm ${
                      errors.image ? 'border-red-500' : 'border-purple-500/20 focus:border-purple-500'
                    }`}
                    placeholder="https://example.com/image.jpg"
                  />
                  {errors.image && <p className="text-red-400 text-xs mt-1">{errors.image}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            <div>
              <label className="block text-gray-300 mb-1.5 sm:mb-2 font-medium text-xs sm:text-sm lg:text-base">Service Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-800/50 border rounded-lg text-white focus:outline-none transition-all text-xs sm:text-sm ${
                  errors.title ? 'border-red-500' : 'border-purple-500/20 focus:border-purple-500'
                }`}
                placeholder="e.g., Web Development"
              />
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-gray-300 mb-1.5 sm:mb-2 font-medium text-xs sm:text-sm lg:text-base">Category *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-800/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 text-xs sm:text-sm"
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
            <label className="block text-gray-300 mb-1.5 sm:mb-2 font-medium text-xs sm:text-sm lg:text-base">Description *</label>
            <textarea
              required
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-800/50 border rounded-lg text-white focus:outline-none transition-all text-xs sm:text-sm ${
                errors.description ? 'border-red-500' : 'border-purple-500/20 focus:border-purple-500'
              }`}
              placeholder="Brief description of the service"
            />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
            <p className="text-gray-500 text-xs mt-1">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Icon and Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            <div>
              <label className="block text-gray-300 mb-1.5 sm:mb-2 font-medium text-xs sm:text-sm lg:text-base">Icon</label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-800/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 text-xs sm:text-sm"
              >
                {iconOptions.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-1.5 sm:mb-2 font-medium text-xs sm:text-sm lg:text-base">Color Gradient</label>
              <select
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-800/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 text-xs sm:text-sm"
              >
                {colorOptions.map(color => (
                  <option key={color} value={color}>{color.replace('from-', '').replace('-to-', ' to ')}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price and Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            <div>
              <label className="block text-gray-300 mb-1.5 sm:mb-2 font-medium text-xs sm:text-sm lg:text-base">Price</label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-800/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 text-xs sm:text-sm"
                placeholder="e.g., $500 - $5000"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1.5 sm:mb-2 font-medium text-xs sm:text-sm lg:text-base">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-800/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 text-xs sm:text-sm"
                placeholder="e.g., 2-4 weeks"
              />
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-gray-300 mb-1.5 sm:mb-2 font-medium text-xs sm:text-sm lg:text-base">Features</label>
            <div className="space-y-1.5 sm:space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-1.5 sm:gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-800/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 text-xs sm:text-sm"
                    placeholder={`Feature ${index + 1}`}
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="px-2 sm:px-3 py-1.5 sm:py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-xs sm:text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                Add Feature
              </button>
            </div>
          </div>

          {/* Tags and Order */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            <div>
              <label className="block text-gray-300 mb-1.5 sm:mb-2 font-medium text-xs sm:text-sm lg:text-base">Tags</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-800/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 text-xs sm:text-sm"
                placeholder="web, development, react (comma separated)"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1.5 sm:mb-2 font-medium text-xs sm:text-sm lg:text-base">Display Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-800/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 text-xs sm:text-sm"
                min="0"
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 sm:gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 bg-slate-800 border-purple-500/30 rounded focus:ring-purple-500 focus:ring-2"
            />
            <label htmlFor="isActive" className="text-gray-300 text-xs sm:text-sm lg:text-base">
              Active Service (Visible on website)
            </label>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 lg:pt-6 border-t border-purple-500/10">
            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="flex-1 px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm lg:text-base"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
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
              className="px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-3 bg-slate-800 rounded-lg text-gray-300 font-semibold hover:bg-slate-700 transition-all disabled:opacity-50 text-xs sm:text-sm lg:text-base"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}