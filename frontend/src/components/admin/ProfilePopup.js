'use client';
import { useState, useEffect, useCallback } from 'react';
import { X, Upload, User, Camera, Loader2, RefreshCw } from 'lucide-react';

export default function ProfilePopup({ isOpen, onClose, adminUser, onUpdate }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profilePicture: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [debugInfo, setDebugInfo] = useState(null);

  // ✅ Get API URL
  const getApiUrl = useCallback(() => {
    return process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';
  }, []);

  // ✅ Get Base URL for static files
  const getBaseUrl = useCallback(() => {
    return process.env.NEXT_PUBLIC_BACKEND_URL || 'https://my-site-backend-0661.onrender.com';
  }, []);

  // ✅ Get full image URL - COMPLETELY FIXED
  const getFullImageUrl = useCallback((imagePath) => {
    if (!imagePath || imagePath.trim() === '') {
      console.log('🔄 No image path provided');
      return '';
    }

    console.log('📁 Original path:', imagePath);

    // If already full URL
    if (imagePath.startsWith('http')) {
      console.log('✅ Already full URL');
      return imagePath;
    }

    // If it's a base64 data URL
    if (imagePath.startsWith('data:image')) {
      console.log('✅ Base64 data URL');
      return imagePath;
    }

    const BASE_URL = getBaseUrl();
    console.log('🌍 Base URL:', BASE_URL);

    let finalUrl = '';
    
    // Case 1: Path starts with /uploads/
    if (imagePath.startsWith('/uploads/')) {
      finalUrl = BASE_URL + imagePath;
    }
    // Case 2: Path starts with uploads/ (without leading slash)
    else if (imagePath.startsWith('uploads/')) {
      finalUrl = BASE_URL + '/' + imagePath;
    }
    // Case 3: Just a filename
    else if (!imagePath.includes('/') && imagePath.includes('.')) {
      finalUrl = BASE_URL + '/uploads/' + imagePath;
    }
    // Case 4: Has /uploads in middle
    else if (imagePath.includes('/uploads/')) {
      const parts = imagePath.split('/uploads/');
      finalUrl = BASE_URL + '/uploads/' + parts[1];
    }
    // Case 5: Default - add /uploads/ prefix
    else {
      // Remove leading slash if present
      const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
      finalUrl = BASE_URL + '/uploads/' + cleanPath;
    }

    console.log('🔗 Final URL:', finalUrl);
    return finalUrl;
  }, [getBaseUrl]);

  // ✅ Test image URL
  const testImageUrl = async (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ url, status: 'success' });
      img.onerror = () => resolve({ url, status: 'error' });
      img.src = url;
    });
  };

  // ✅ Initialize form data
  useEffect(() => {
    if (adminUser && isOpen) {
      console.log('👤 Admin user data:', adminUser);
      
      const newFormData = {
        name: adminUser.name || '',
        email: adminUser.email || '',
        profilePicture: adminUser.profilePicture || ''
      };
      
      setFormData(newFormData);
      
      // Set preview image
      if (newFormData.profilePicture) {
        const fullUrl = getFullImageUrl(newFormData.profilePicture);
        console.log('🖼️ Initial preview URL:', fullUrl);
        setPreviewImage(fullUrl);
        
        // Test the URL
        testImageUrl(fullUrl).then(result => {
          console.log('🧪 Initial image test:', result);
          if (result.status === 'error') {
            console.log('⚠️ Initial image failed to load, trying alternatives...');
            
            // Try alternative URLs
            const alternatives = [
              `https://my-site-backend-0661.onrender.com${newFormData.profilePicture}`,
              `https://my-site-backend-0661.onrender.com/uploads/${newFormData.profilePicture.split('/').pop()}`,
              `${getBaseUrl()}${newFormData.profilePicture}`
            ];
            
            // Test all alternatives
            Promise.all(alternatives.map(testImageUrl)).then(results => {
              const workingUrl = results.find(r => r.status === 'success');
              if (workingUrl) {
                console.log('✅ Found working URL:', workingUrl.url);
                setPreviewImage(workingUrl.url);
              }
            });
          }
        });
      }
    }
  }, [adminUser, isOpen, getFullImageUrl, getBaseUrl]);

  // ✅ Image upload function - COMPLETELY FIXED
  const uploadImage = async (file) => {
    setUploadingImage(true);
    setMessage({ type: '', text: '' });
    setDebugInfo(null);

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      console.log('📤 Uploading profile image:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      const formDataToSend = new FormData();
      formDataToSend.append('image', file);

      const uploadUrl = `${getApiUrl()}/auth/upload-profile-image`;
      console.log('🔗 Upload URL:', uploadUrl);

      const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend
      });

      console.log('📡 Response status:', res.status);
      console.log('📡 Response headers:', Object.fromEntries(res.headers.entries()));
      
      const result = await res.json();
      console.log('📡 Response data:', result);

      if (!res.ok) {
        throw new Error(result.message || `Upload failed with status ${res.status}`);
      }

      if (!result.success) {
        throw new Error(result.message || 'Upload failed');
      }

      // ✅ Handle response data
      let imageUrl = '';
      
      if (result.data) {
        // Try different possible response formats
        imageUrl = result.data.imageUrl || result.data.fullUrl || result.data.url || result.data.profilePicture;
        
        if (result.data.fileName) {
          // If server returns just filename, construct full path
          imageUrl = `/uploads/${result.data.fileName}`;
        }
      }

      if (!imageUrl) {
        // If no URL in response, use the one from message
        if (result.message && result.message.includes('/uploads/')) {
          const match = result.message.match(/\/uploads\/[^\s]+/);
          if (match) {
            imageUrl = match[0];
          }
        }
      }

      if (!imageUrl) {
        throw new Error('No image URL returned from server');
      }

      console.log('✅ Received image URL:', imageUrl);
      
      // Store debug info
      setDebugInfo({
        originalResponse: result,
        extractedUrl: imageUrl,
        timestamp: new Date().toISOString()
      });

      return imageUrl;

    } catch (error) {
      console.error('❌ Image upload error:', error);
      setDebugInfo({
        error: error.message,
        timestamp: new Date().toISOString()
      });
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('🖼️ Profile image selected:', file.name);
    e.target.value = '';

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select a valid image file (JPEG, PNG, WebP, GIF)' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size should be less than 5MB' });
      return;
    }

    try {
      // Create immediate preview from local file
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);

      // Upload image to server
      const imageUrl = await uploadImage(file);
      console.log('✅ Server returned image URL:', imageUrl);

      // Get full URL for display
      const fullImageUrl = getFullImageUrl(imageUrl);
      console.log('✅ Full image URL for display:', fullImageUrl);

      // Update form data
      setFormData(prev => ({
        ...prev,
        profilePicture: imageUrl
      }));

      // Update preview with actual server URL
      setPreviewImage(fullImageUrl);

      // Test if the image loads
      const testResult = await testImageUrl(fullImageUrl);
      console.log('🧪 Image load test:', testResult);

      if (testResult.status === 'success') {
        setMessage({
          type: 'success',
          text: '✅ Profile image uploaded successfully!'
        });
      } else {
        setMessage({
          type: 'warning',
          text: '⚠️ Image uploaded but may not load immediately. Try refreshing.'
        });
      }

    } catch (error) {
      console.error('❌ Image processing error:', error);
      setMessage({
        type: 'error',
        text: `❌ Upload failed: ${error.message}`
      });
      // Reset preview on error
      const currentPreview = getFullImageUrl(formData.profilePicture);
      setPreviewImage(currentPreview);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Please login again');
      }

      console.log('📤 Sending profile update:', formData);
      
      const res = await fetch(`${getApiUrl()}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          profilePicture: formData.profilePicture
        })
      });

      const result = await res.json();
      console.log('📊 Profile update result:', result);

      if (result.success) {
        // Get updated user data
        const updatedUser = result.data || {
          ...adminUser,
          ...formData
        };
        
        console.log('✅ Updated user data:', updatedUser);
        
        // Update localStorage
        localStorage.setItem('adminUser', JSON.stringify(updatedUser));
        
        // Update parent component
        onUpdate(updatedUser);
        
        setMessage({
          type: 'success',
          text: '✅ Profile updated successfully!'
        });
        
        // Force refresh preview
        if (updatedUser.profilePicture) {
          const refreshedUrl = getFullImageUrl(updatedUser.profilePicture) + '?t=' + Date.now();
          console.log('🔄 Refreshed preview URL:', refreshedUrl);
          setPreviewImage(refreshedUrl);
        }
        
        // Close popup after success
        setTimeout(() => {
          onClose();
        }, 1500);
        
      } else {
        throw new Error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        type: 'error',
        text: `❌ Failed to update profile: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Refresh image manually
  const refreshImage = () => {
    if (formData.profilePicture) {
      const refreshedUrl = getFullImageUrl(formData.profilePicture) + '?t=' + Date.now();
      console.log('🔄 Manually refreshing image:', refreshedUrl);
      setPreviewImage(refreshedUrl);
      setMessage({
        type: 'info',
        text: '🔄 Refreshing image...'
      });
      
      // Test if it loads
      setTimeout(() => {
        testImageUrl(refreshedUrl).then(result => {
          if (result.status === 'success') {
            setMessage({
              type: 'success',
              text: '✅ Image refreshed successfully!'
            });
          }
        });
      }, 500);
    }
  };

  // ✅ Debug function
  const runDebug = () => {
    console.log('🔍 Running debug...');
    
    const debugData = {
      formData,
      previewImage,
      adminUser,
      baseUrl: getBaseUrl(),
      apiUrl: getApiUrl(),
      localStorage: {
        adminUser: localStorage.getItem('adminUser'),
        token: localStorage.getItem('adminToken') ? 'Present' : 'Missing'
      }
    };
    
    console.log('📊 Debug data:', debugData);
    
    // Test all possible URLs
    if (formData.profilePicture) {
      const testUrls = [
        formData.profilePicture,
        getFullImageUrl(formData.profilePicture),
        `${getBaseUrl()}${formData.profilePicture}`,
        `https://my-site-backend-0661.onrender.com${formData.profilePicture}`,
        `${getBaseUrl()}/uploads/${formData.profilePicture.split('/').pop()}`,
        formData.profilePicture.startsWith('/uploads/') 
          ? `${getBaseUrl()}${formData.profilePicture}`
          : `${getBaseUrl()}/uploads/${formData.profilePicture}`
      ];
      
      console.log('🧪 Testing URLs:', testUrls);
      
      Promise.all(testUrls.map(testImageUrl)).then(results => {
        console.log('📈 Test results:', results);
        
        const workingUrls = results.filter(r => r.status === 'success');
        if (workingUrls.length > 0) {
          setMessage({
            type: 'info',
            text: `Found ${workingUrls.length} working URL(s)`
          });
          // Use first working URL
          setPreviewImage(workingUrls[0].url);
        }
      });
    }
    
    setDebugInfo(debugData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl w-full max-w-md border border-purple-500/20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Update Profile</h2>
          <div className="flex gap-2">
            <button
              onClick={refreshImage}
              className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-slate-600 transition-colors"
              title="Refresh image"
            >
              <RefreshCw className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-slate-600 transition-colors"
              disabled={loading}
              title="Close"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Message Display */}
          {message.text && (
            <div className={`p-3 rounded-lg text-sm ${
              message.type === 'success'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : message.type === 'error'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            }`}>
              <div className="flex items-center justify-between">
                <span>{message.text}</span>
                {message.type === 'info' && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
              </div>
            </div>
          )}

          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center overflow-hidden border-4 border-slate-700">
                {previewImage ? (
                  <img 
                    src={previewImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('❌ Profile image failed to load:', e.target.src);
                      
                      // Try fallback URL
                      const fallbackUrl = `https://my-site-backend-0661.onrender.com${formData.profilePicture}`;
                      if (fallbackUrl !== e.target.src) {
                        console.log('🔄 Trying fallback URL:', fallbackUrl);
                        e.target.src = fallbackUrl;
                      } else {
                        e.target.onerror = null;
                        e.target.src = '';
                        setPreviewImage('');
                      }
                    }}
                    onLoad={() => console.log('✅ Profile image loaded successfully')}
                  />
                ) : (
                  <User className="w-10 h-10 text-white" />
                )}
                
                {uploadingImage && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>
              
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-600 transition-colors disabled:opacity-50 shadow-lg">
                {uploadingImage ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <Camera className="w-4 h-4 text-white" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={uploadingImage || loading}
                />
              </label>
            </div>
            
            <p className="text-gray-400 text-sm text-center mb-2">
              {uploadingImage ? 'Uploading...' : 'Click camera icon to upload profile picture'}
            </p>
            
            {/* Debug and Info Section */}
            <div className="w-full space-y-2">
              {formData.profilePicture && (
                <>
                  <div className="p-2 bg-slate-900/50 rounded text-xs font-mono max-w-full overflow-hidden">
                    <div className="text-gray-500 text-[10px] mb-1">Stored Path:</div>
                    <div className="text-purple-400 text-[10px] truncate" title={formData.profilePicture}>
                      {formData.profilePicture}
                    </div>
                  </div>
                  
                  <div className="p-2 bg-slate-900/50 rounded text-xs font-mono max-w-full overflow-hidden">
                    <div className="text-gray-500 text-[10px] mb-1">Preview URL:</div>
                    <div className="text-blue-400 text-[10px] truncate" title={previewImage}>
                      {previewImage || 'No preview'}
                    </div>
                  </div>
                </>
              )}
              
              <button
                type="button"
                onClick={runDebug}
                className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-gray-400 text-xs rounded transition-colors flex items-center justify-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Run Debug
              </button>
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="Enter your name"
              required
              disabled={loading}
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 bg-slate-700 text-gray-300 rounded-lg font-medium hover:bg-slate-600 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : 'Update Profile'}
            </button>
          </div>
        </form>
        
        {/* Debug Info Modal */}
        {debugInfo && (
          <div className="p-4 border-t border-slate-700">
            <div className="text-xs text-gray-500 mb-2">Debug Info:</div>
            <pre className="text-xs bg-slate-900 p-2 rounded max-h-32 overflow-y-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
            <button
              onClick={() => setDebugInfo(null)}
              className="mt-2 text-xs text-gray-500 hover:text-gray-300"
            >
              Hide debug
            </button>
          </div>
        )}
      </div>
    </div>
  );
}