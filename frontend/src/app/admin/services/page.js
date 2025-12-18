'use client';
import { useState, useEffect } from 'react';
import { 
  Save, Plus, Trash2, Image as ImageIcon, Loader2, 
  X, Check, Upload, Edit, Eye 
} from 'lucide-react';

export default function ManageServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    icon: 'Code',
    color: 'from-purple-500 to-pink-500',
    features: [''],
    category: 'Other',
    price: 'Contact for pricing',
    duration: 'Varies',
    tags: [''],
    order: 0,
    isActive: true
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const getApiUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';
  };

  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminToken');
    }
    return null;
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch(`${getApiUrl()}/services`);
      const data = await res.json();
      if (data.success) {
        setServices(data.data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setMessage({ type: 'error', text: 'Failed to load services' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    if (formData.features.length < 10) {
      setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
    }
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const handleTagChange = (index, value) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData(prev => ({ ...prev, tags: newTags }));
  };

  const addTag = () => {
    if (formData.tags.length < 10) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, ''] }));
    }
  };

  const removeTag = (index) => {
    const newTags = formData.tags.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, tags: newTags }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      return 'Title is required';
    }
    if (!formData.description.trim()) {
      return 'Description is required';
    }
    if (!formData.image.trim()) {
      return 'Image URL is required';
    }
    if (formData.title.length > 100) {
      return 'Title must be less than 100 characters';
    }
    if (formData.description.length > 500) {
      return 'Description must be less than 500 characters';
    }
    if (formData.features.length > 10) {
      return 'Maximum 10 features allowed';
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setMessage({ type: 'error', text: validationError });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = getToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Clean features and tags
      const cleanFormData = {
        ...formData,
        features: formData.features.filter(f => f.trim()).map(f => f.trim().substring(0, 100)),
        tags: formData.tags.filter(t => t.trim()).map(t => t.trim().substring(0, 50)),
        order: parseInt(formData.order) || 0
      };

      const url = editingService 
        ? `${getApiUrl()}/services/${editingService._id}`
        : `${getApiUrl()}/services`;

      const method = editingService ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cleanFormData)
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setMessage({
          type: 'success',
          text: editingService ? 'Service updated successfully!' : 'Service created successfully!'
        });
        
        resetForm();
        fetchServices();
        
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 3000);
      } else {
        throw new Error(result.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Save error:', error);
      setMessage({
        type: 'error',
        text: `❌ ${error.message}`
      });
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      icon: 'Code',
      color: 'from-purple-500 to-pink-500',
      features: [''],
      category: 'Other',
      price: 'Contact for pricing',
      duration: 'Varies',
      tags: [''],
      order: 0,
      isActive: true
    });
    setEditingService(null);
    setIsCreating(false);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setIsCreating(true);
    setFormData({
      title: service.title || '',
      description: service.description || '',
      image: service.image || '',
      icon: service.icon || 'Code',
      color: service.color || 'from-purple-500 to-pink-500',
      features: service.features?.length ? service.features : [''],
      category: service.category || 'Other',
      price: service.price || 'Contact for pricing',
      duration: service.duration || 'Varies',
      tags: service.tags?.length ? service.tags : [''],
      order: service.order || 0,
      isActive: service.isActive !== undefined ? service.isActive : true
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const token = getToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const res = await fetch(`${getApiUrl()}/services/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setMessage({ type: 'success', text: 'Service deleted successfully!' });
        fetchServices();
      } else {
        throw new Error(result.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setMessage({ type: 'error', text: `❌ ${error.message}` });
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const res = await fetch(`${getApiUrl()}/services/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await res.json();

      if (res.ok && result.success) {
        fetchServices();
      } else {
        throw new Error(result.message || 'Toggle failed');
      }
    } catch (error) {
      console.error('Toggle error:', error);
      setMessage({ type: 'error', text: `❌ ${error.message}` });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        <span className="ml-3 text-gray-400">Loading services...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Manage Services</h1>
          <p className="text-gray-400 text-sm">Create and manage your services portfolio</p>
        </div>
        <div className="flex gap-3">
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create New Service
            </button>
          )}
          {isCreating && (
            <button
              onClick={resetForm}
              className="px-6 py-3 bg-gray-700 rounded-lg text-white font-semibold hover:bg-gray-600 transition-all flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`p-4 rounded-lg ${message.type === 'success'
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
          {message.text}
        </div>
      )}

      {/* Create/Edit Form */}
      {isCreating && (
        <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            {editingService ? 'Edit Service' : 'Create New Service'}
          </h2>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  maxLength={100}
                  className="w-full px-4 py-3 bg-slate-700 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="Web Development"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {formData.title.length}/100 characters
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
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
              <label className="block text-gray-300 mb-2 font-medium">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                maxLength={500}
                rows="4"
                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 resize-vertical"
                placeholder="Describe your service in detail..."
              />
              <div className="text-xs text-gray-500 mt-1">
                {formData.description.length}/500 characters
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Image URL <span className="text-red-400">*</span>
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="https://example.com/image.jpg"
              />
              {formData.image && (
                <div className="mt-3 p-2 bg-slate-900 rounded-lg">
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x150/1f2937/9ca3af?text=Invalid+Image';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Features */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-gray-300 font-medium">
                  Features (Max 10)
                </label>
                <button
                  type="button"
                  onClick={addFeature}
                  disabled={formData.features.length >= 10}
                  className="px-3 py-1 text-xs bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors disabled:opacity-50"
                >
                  + Add Feature
                </button>
              </div>
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    maxLength={100}
                    className="flex-1 px-3 py-2 bg-slate-700 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    placeholder={`Feature ${index + 1}`}
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Price & Duration */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Price</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="Contact for pricing"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="2-4 weeks"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-gray-300 font-medium">
                  Tags (Max 10)
                </label>
                <button
                  type="button"
                  onClick={addTag}
                  disabled={formData.tags.length >= 10}
                  className="px-3 py-1 text-xs bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors disabled:opacity-50"
                >
                  + Add Tag
                </button>
              </div>
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                    maxLength={50}
                    className="flex-1 px-3 py-2 bg-slate-700 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    placeholder={`Tag ${index + 1}`}
                  />
                  {formData.tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Advanced Settings */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Icon</label>
                <select
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Code">Code</option>
                  <option value="Smartphone">Smartphone</option>
                  <option value="Palette">Palette</option>
                  <option value="Cloud">Cloud</option>
                  <option value="Brain">Brain</option>
                  <option value="TrendingUp">TrendingUp</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">Color Gradient</label>
                <select
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="from-purple-500 to-pink-500">Purple to Pink</option>
                  <option value="from-blue-500 to-cyan-500">Blue to Cyan</option>
                  <option value="from-green-500 to-emerald-500">Green to Emerald</option>
                  <option value="from-orange-500 to-red-500">Orange to Red</option>
                  <option value="from-indigo-500 to-purple-500">Indigo to Purple</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">Display Order</label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-3 bg-slate-700 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="w-4 h-4 text-purple-500 bg-slate-700 border-purple-500/20 rounded focus:ring-purple-500"
              />
              <label htmlFor="isActive" className="text-gray-300">
                Active Service (Visible on website)
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : editingService ? (
                  <Save className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {saving ? 'Saving...' : editingService ? 'Update Service' : 'Create Service'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Services List */}
      <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">All Services</h2>
          <div className="text-gray-400 text-sm">
            Total: {services.length} services
          </div>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-800/50 rounded-full flex items-center justify-center">
              <Plus className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-gray-400 text-lg mb-4">No services found</p>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
              Create your first service to showcase your offerings
            </p>
            <button
              onClick={() => setIsCreating(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:shadow-lg transition-all"
            >
              Create First Service
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {services.map((service) => (
              <div 
                key={service._id} 
                className={`p-4 rounded-lg border ${service.isActive 
                  ? 'bg-slate-700/30 border-purple-500/20' 
                  : 'bg-slate-800/30 border-gray-700'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img 
                        src={service.image} 
                        alt={service.title} 
                        className="w-16 h-16 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/64/1f2937/9ca3af?text=No+Img';
                        }}
                      />
                      <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-800 ${service.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-white">
                          {service.title}
                        </h3>
                        <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded">
                          {service.category}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {service.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {service.tags?.slice(0, 3).map((tag, i) => (
                          <span key={i} className="px-2 py-1 text-xs bg-slate-700/50 text-gray-400 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => toggleStatus(service._id, service.isActive)}
                      className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                        service.isActive 
                          ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                          : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                      }`}
                    >
                      {service.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDelete(service._id)}
                      className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}