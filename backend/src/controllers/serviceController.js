const Service = require('../models/Service');
const asyncHandler = require('express-async-handler');
const path = require('path');
const fs = require('fs');

// @desc    Get all services (Public)
// @route   GET /api/services
// @access  Public
exports.getAllServices = asyncHandler(async (req, res) => {
  const { 
    category, 
    active, 
    search, 
    limit = 50, 
    page = 1,
    featured 
  } = req.query;
  
  // Build query object
  const query = {};
  
  // Filter by category
  if (category && category !== 'all') {
    query.category = category;
  }
  
  // Filter by active status (for public, default to active only)
  if (active !== undefined) {
    query.isActive = active === 'true';
  } else {
    // Default: only show active services for public
    query.isActive = true;
  }
  
  // Search in title, description, and tags
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }
  
  // Filter featured services
  if (featured === 'true') {
    query.order = { $lte: 6 }; // Assuming first 6 are featured
  }
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const limitNum = parseInt(limit) > 100 ? 100 : parseInt(limit); // Prevent too large limits
  
  // Get services with pagination
  const services = await Service.find(query)
    .sort({ order: 1, createdAt: -1 })
    .limit(limitNum)
    .skip(skip)
    .select('-__v'); // Exclude version key
  
  const total = await Service.countDocuments(query);
  
  res.status(200).json({
    success: true,
    count: services.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limitNum),
    data: services
  });
});

// @desc    Get single service by ID or slug
// @route   GET /api/services/:id
// @access  Public
exports.getService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  let service;
  
  // Check if it's a valid MongoDB ObjectId
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    service = await Service.findById(id);
  } else {
    // Treat as slug
    service = await Service.findOne({ slug: id });
  }
  
  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found'
    });
  }
  
  // If service is inactive and user is not admin, don't show it
  if (!service.isActive && !req.admin) {
    return res.status(404).json({
      success: false,
      message: 'Service not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: service
  });
});

// @desc    Create new service
// @route   POST /api/services
// @access  Private/Admin
exports.createService = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    image,
    icon,
    color,
    features = [],
    category,
    price,
    duration,
    isActive = true,
    order = 0,
    metaTitle,
    metaDescription,
    tags = []
  } = req.body;
  
  // Validate required fields
  if (!title || !description || !image) {
    return res.status(400).json({
      success: false,
      message: 'Title, description, and image are required'
    });
  }
  
  // Check if service with similar title exists
  const existingService = await Service.findOne({ 
    title: { $regex: new RegExp(`^${title}$`, 'i') } 
  });
  
  if (existingService) {
    return res.status(400).json({
      success: false,
      message: 'Service with this title already exists'
    });
  }
  
  // Create service
  const service = await Service.create({
    title,
    description: description.substring(0, 500), // Ensure length limit
    image,
    icon: icon || 'Code',
    color: color || 'from-purple-500 to-pink-500',
    features: Array.isArray(features) ? features.filter(f => f.trim()) : [],
    category: category || 'Other',
    price: price || 'Contact for pricing',
    duration: duration || 'Varies',
    isActive,
    order: parseInt(order) || 0,
    metaTitle: metaTitle || title,
    metaDescription: metaDescription || description.substring(0, 160),
    tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(t => t) : [],
    createdBy: req.admin.id
  });
  
  res.status(201).json({
    success: true,
    message: 'Service created successfully',
    data: service
  });
});

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private/Admin
exports.updateService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  let service = await Service.findById(id);
  
  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found'
    });
  }
  
  // Check if title is being changed and if new title already exists
  if (req.body.title && req.body.title !== service.title) {
    const existingService = await Service.findOne({ 
      title: { $regex: new RegExp(`^${req.body.title}$`, 'i') },
      _id: { $ne: id }
    });
    
    if (existingService) {
      return res.status(400).json({
        success: false,
        message: 'Service with this title already exists'
      });
    }
  }
  
  // Prepare update data
  const updateData = { ...req.body };
  
  // Process arrays properly
  if (updateData.features && typeof updateData.features === 'string') {
    updateData.features = updateData.features.split(',').map(f => f.trim()).filter(f => f);
  }
  
  if (updateData.tags && typeof updateData.tags === 'string') {
    updateData.tags = updateData.tags.split(',').map(t => t.trim()).filter(t => t);
  }
  
  // Ensure order is number
  if (updateData.order) {
    updateData.order = parseInt(updateData.order);
  }
  
  service = await Service.findByIdAndUpdate(
    id,
    updateData,
    {
      new: true,
      runValidators: true
    }
  );
  
  res.status(200).json({
    success: true,
    message: 'Service updated successfully',
    data: service
  });
});

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private/Admin
exports.deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  
  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found'
    });
  }
  
  await Service.findByIdAndDelete(req.params.id);
  
  res.status(200).json({
    success: true,
    message: 'Service deleted successfully',
    data: {}
  });
});

// @desc    Toggle service active status
// @route   PATCH /api/services/:id/toggle
// @access  Private/Admin
exports.toggleServiceStatus = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  
  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found'
    });
  }
  
  service.isActive = !service.isActive;
  await service.save();
  
  res.status(200).json({
    success: true,
    message: `Service ${service.isActive ? 'activated' : 'deactivated'} successfully`,
    data: service
  });
});

// @desc    Reorder services
// @route   PUT /api/services/reorder
// @access  Private/Admin
exports.reorderServices = asyncHandler(async (req, res) => {
  const { services } = req.body;
  
  if (!Array.isArray(services)) {
    return res.status(400).json({
      success: false,
      message: 'Services array is required'
    });
  }
  
  try {
    // Update all services in bulk
    const bulkOps = services.map(item => ({
      updateOne: {
        filter: { _id: item.id },
        update: { order: item.order }
      }
    }));
    
    await Service.bulkWrite(bulkOps);
    
    res.status(200).json({
      success: true,
      message: 'Services reordered successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error reordering services'
    });
  }
});

// @desc    Get service statistics
// @route   GET /api/services/stats
// @access  Public/Private
exports.getServiceStats = asyncHandler(async (req, res) => {
  try {
    const totalServices = await Service.countDocuments();
    const activeServices = await Service.countDocuments({ isActive: true });
    const inactiveServices = await Service.countDocuments({ isActive: false });
    
    const servicesByCategory = await Service.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          active: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    // Get recent services
    const recentServices = await Service.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title createdAt isActive');
    
    res.status(200).json({
      success: true,
      data: {
        total: totalServices,
        active: activeServices,
        inactive: inactiveServices,
        byCategory: servicesByCategory,
        recent: recentServices
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching service statistics'
    });
  }
});

// @desc    Upload service image
// @route   POST /api/services/upload
// @access  Private/Admin
exports.uploadServiceImage = asyncHandler(async (req, res) => {
  // This is a placeholder for image upload functionality
  // You'll need to integrate with Multer, Cloudinary, or AWS S3
  
  if (!req.body.imageUrl) {
    return res.status(400).json({
      success: false,
      message: 'Image URL is required'
    });
  }
  
  // For now, we'll just return the provided URL
  // In production, you should handle actual file uploads
  res.status(200).json({
    success: true,
    message: 'Image URL processed successfully',
    data: {
      imageUrl: req.body.imageUrl
    }
  });
});