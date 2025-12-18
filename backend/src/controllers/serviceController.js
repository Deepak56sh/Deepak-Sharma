const Service = require('../models/Service');
const asyncHandler = require('express-async-handler');

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
    query.order = { $lte: 6 };
  }
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const limitNum = parseInt(limit) > 100 ? 100 : parseInt(limit);
  
  // Get services with pagination
  const services = await Service.find(query)
    .sort({ order: 1, createdAt: -1 })
    .limit(limitNum)
    .skip(skip)
    .select('-__v');
  
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
    icon = 'Code',
    color = 'from-purple-500 to-pink-500',
    features = [],
    category = 'Other',
    price = 'Contact for pricing',
    duration = 'Varies',
    isActive = true,
    order = 0,
    metaTitle,
    metaDescription,
    tags = []
  } = req.body;
  
  // ✅ FIX: Validate and sanitize input data
  if (!title || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Service title is required'
    });
  }
  
  if (!description || !description.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Service description is required'
    });
  }
  
  if (!image || !image.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Service image URL is required'
    });
  }
  
  // Trim and limit all fields
  const cleanTitle = title.trim().substring(0, 100);
  const cleanDescription = description.trim().substring(0, 500); // Increased to 500 chars
  const cleanImage = image.trim();
  
  // Process features
  let cleanFeatures = [];
  if (Array.isArray(features)) {
    cleanFeatures = features
      .filter(f => f && typeof f === 'string' && f.trim().length > 0)
      .map(f => f.trim().substring(0, 100))
      .slice(0, 10); // Max 10 features
  }
  
  // Process tags
  let cleanTags = [];
  if (Array.isArray(tags)) {
    cleanTags = tags
      .filter(t => t && typeof t === 'string' && t.trim().length > 0)
      .map(t => t.trim().substring(0, 50))
      .slice(0, 10);
  }
  
  // Check for duplicate title
  const existingService = await Service.findOne({ 
    title: { $regex: new RegExp(`^${cleanTitle}$`, 'i') } 
  });
  
  if (existingService) {
    return res.status(400).json({
      success: false,
      message: 'Service with this title already exists'
    });
  }
  
  // Create service
  const service = await Service.create({
    title: cleanTitle,
    description: cleanDescription,
    image: cleanImage,
    icon: icon.trim() || 'Code',
    color: color.trim() || 'from-purple-500 to-pink-500',
    features: cleanFeatures,
    category: category.trim() || 'Other',
    price: price.trim() || 'Contact for pricing',
    duration: duration.trim() || 'Varies',
    isActive: Boolean(isActive),
    order: parseInt(order) || 0,
    metaTitle: metaTitle ? metaTitle.trim().substring(0, 100) : cleanTitle.substring(0, 100),
    metaDescription: metaDescription ? metaDescription.trim().substring(0, 160) : cleanDescription.substring(0, 160),
    tags: cleanTags,
    createdBy: req.admin?.id || 'admin'
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
  
  // Prepare update data with sanitization
  const updateData = { ...req.body };
  
  // Sanitize title
  if (updateData.title !== undefined) {
    if (!updateData.title || !updateData.title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Service title cannot be empty'
      });
    }
    
    const cleanTitle = updateData.title.trim().substring(0, 100);
    
    // Check if new title already exists (excluding current service)
    if (cleanTitle !== service.title) {
      const existingService = await Service.findOne({ 
        title: { $regex: new RegExp(`^${cleanTitle}$`, 'i') },
        _id: { $ne: id }
      });
      
      if (existingService) {
        return res.status(400).json({
          success: false,
          message: 'Service with this title already exists'
        });
      }
    }
    
    updateData.title = cleanTitle;
  }
  
  // Sanitize description
  if (updateData.description !== undefined) {
    if (!updateData.description || !updateData.description.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Description cannot be empty'
      });
    }
    
    updateData.description = updateData.description.trim().substring(0, 500);
  }
  
  // Sanitize features
  if (updateData.features !== undefined) {
    let cleanFeatures = [];
    if (Array.isArray(updateData.features)) {
      cleanFeatures = updateData.features
        .filter(f => f && typeof f === 'string' && f.trim().length > 0)
        .map(f => f.trim().substring(0, 100))
        .slice(0, 10);
    }
    updateData.features = cleanFeatures;
  }
  
  // Sanitize tags
  if (updateData.tags !== undefined) {
    let cleanTags = [];
    if (Array.isArray(updateData.tags)) {
      cleanTags = updateData.tags
        .filter(t => t && typeof t === 'string' && t.trim().length > 0)
        .map(t => t.trim().substring(0, 50))
        .slice(0, 10);
    }
    updateData.tags = cleanTags;
  }
  
  // Sanitize other fields
  if (updateData.image !== undefined) {
    updateData.image = updateData.image ? updateData.image.trim() : service.image;
  }
  
  if (updateData.icon !== undefined) {
    updateData.icon = updateData.icon ? updateData.icon.trim() : 'Code';
  }
  
  if (updateData.color !== undefined) {
    updateData.color = updateData.color ? updateData.color.trim() : 'from-purple-500 to-pink-500';
  }
  
  if (updateData.category !== undefined) {
    updateData.category = updateData.category ? updateData.category.trim() : 'Other';
  }
  
  if (updateData.price !== undefined) {
    updateData.price = updateData.price ? updateData.price.trim() : 'Contact for pricing';
  }
  
  if (updateData.duration !== undefined) {
    updateData.duration = updateData.duration ? updateData.duration.trim() : 'Varies';
  }
  
  if (updateData.order !== undefined) {
    updateData.order = parseInt(updateData.order) || 0;
  }
  
  if (updateData.isActive !== undefined) {
    updateData.isActive = Boolean(updateData.isActive);
  }
  
  // Update service
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
// @route   GET /api/services/stats/all
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