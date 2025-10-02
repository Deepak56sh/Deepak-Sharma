'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ArrowUp, ArrowDown, Save, X, ExternalLink, Link as LinkIcon, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminMenuManager() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    path: '',
    type: 'internal',
    url: '',
    order: 0,
    isActive: true
  });

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
    setAuthLoading(false);
  }, []);

  // Fetch menu items
  const fetchMenuItems = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/menu/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      const data = await response.json();
      
      if (data.success) {
        setMenuItems(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMenuItems();
    }
  }, [isAuthenticated]);

  // Redirect to login
  const redirectToLogin = () => {
    router.push('/admin/login');
  };

  // Handle login directly from here (temporary)
  const handleQuickLogin = async () => {
    try {
      const loginData = {
        email: 'admin@nexgen.com',
        password: 'admin123'
      };

      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('adminToken', data.data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.data.admin));
        setIsAuthenticated(true);
        alert('Login successful!');
      } else {
        alert('Login failed: ' + data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your connection.');
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Create new menu item
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchMenuItems();
        setShowForm(false);
        setFormData({
          name: '',
          path: '',
          type: 'internal',
          url: '',
          order: 0,
          isActive: true
        });
        alert('Menu item created successfully!');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Create error:', error);
      alert('Failed to create menu item');
    }
  };

  // Update menu item
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/menu/${editingItem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchMenuItems();
        setEditingItem(null);
        setShowForm(false);
        setFormData({
          name: '',
          path: '',
          type: 'internal',
          url: '',
          order: 0,
          isActive: true
        });
        alert('Menu item updated successfully!');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update menu item');
    }
  };

  // Delete menu item
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/menu/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchMenuItems();
        alert('Menu item deleted successfully!');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete menu item');
    }
  };

  // Reorder menu items
  const handleReorder = async (id, direction) => {
    const currentIndex = menuItems.findIndex(item => item._id === id);
    if ((direction === 'up' && currentIndex === 0) || 
        (direction === 'down' && currentIndex === menuItems.length - 1)) return;

    const newOrder = [...menuItems];
    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Swap orders
    [newOrder[currentIndex].order, newOrder[swapIndex].order] = 
    [newOrder[swapIndex].order, newOrder[currentIndex].order];
    
    // Sort by order
    newOrder.sort((a, b) => a.order - b.order);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/menu/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          menuOrder: newOrder.map(item => ({ id: item._id, order: item.order }))
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setMenuItems(newOrder);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Reorder error:', error);
      alert('Failed to reorder menu items');
    }
  };

  // Start editing
  const startEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      path: item.path || '',
      type: item.type,
      url: item.url || '',
      order: item.order,
      isActive: item.isActive
    });
    setShowForm(true);
  };

  // Cancel edit/create
  const cancelForm = () => {
    setEditingItem(null);
    setShowForm(false);
    setFormData({
      name: '',
      path: '',
      type: 'internal',
      url: '',
      order: 0,
      isActive: true
    });
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
    setMenuItems([]);
  };

  // Show login screen if not authenticated
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Checking authentication...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-slate-800 rounded-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-gray-400 mb-6">You need to login to access the admin panel</p>
          
          <div className="space-y-4">
            <button
              onClick={handleQuickLogin}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition-colors font-semibold"
            >
              Quick Login (admin@nexgen.com)
            </button>
            
            <button
              onClick={redirectToLogin}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg transition-colors"
            >
              Go to Login Page
            </button>
          </div>

          <div className="mt-6 p-4 bg-slate-700 rounded-lg">
            <p className="text-sm text-gray-400 mb-2">Demo Credentials:</p>
            <p className="text-sm text-white">Email: admin@nexgen.com</p>
            <p className="text-sm text-white">Password: admin123</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Menu Management</h1>
              <p className="text-gray-400">Manage your website navigation menu</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus size={20} />
                Add Menu Item
              </button>
              <button
                onClick={handleLogout}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Menu Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">
                  {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
                </h3>
                <button onClick={cancelForm} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={editingItem ? handleUpdate : handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    placeholder="Menu item name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="internal">Internal Link</option>
                    <option value="external">External URL</option>
                  </select>
                </div>

                {formData.type === 'internal' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Path</label>
                    <input
                      type="text"
                      name="path"
                      value={formData.path}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                      placeholder="/about"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">URL</label>
                    <input
                      type="url"
                      name="url"
                      value={formData.url}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                      placeholder="https://example.com"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Order</label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
                  />
                  <label className="text-sm font-medium text-gray-300">Active</label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Save size={18} />
                    {editingItem ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={cancelForm}
                    className="flex-1 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Menu Items List */}
        <div className="bg-slate-800 rounded-xl overflow-hidden">
          {menuItems.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No menu items found. Create your first menu item!
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {menuItems.map((item, index) => (
                <div key={item._id} className="p-4 hover:bg-slate-750 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleReorder(item._id, 'up')}
                          disabled={index === 0}
                          className="text-gray-400 hover:text-white disabled:opacity-30"
                        >
                          <ArrowUp size={16} />
                        </button>
                        <button
                          onClick={() => handleReorder(item._id, 'down')}
                          disabled={index === menuItems.length - 1}
                          className="text-gray-400 hover:text-white disabled:opacity-30"
                        >
                          <ArrowDown size={16} />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        {item.type === 'external' ? (
                          <ExternalLink size={18} className="text-blue-400" />
                        ) : (
                          <LinkIcon size={18} className="text-green-400" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">{item.name}</span>
                            {!item.isActive && (
                              <span className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded">Inactive</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-400">
                            {item.type === 'internal' ? item.path : item.url}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">Order: {item.order}</span>
                      <button
                        onClick={() => startEdit(item)}
                        className="p-2 text-blue-400 hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}