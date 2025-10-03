// ============================================
// FILE: controllers/serviceController.js
// ============================================
const Service = require('../models/Service');
const asyncHandler = require('express-async-handler');

// @desc    Get all services (Public)
// @route   GET /api/services
// @access  Public
exports.getAllServices = asyncHandler(async (req, res) => {
  const { category, active, search, limit = 50, page = 1 } = req.query;
  
  const query = {};
  
  // Filter by category
  if (category) {
    query.category = category;
  }
  
  // Filter by active status
  if (active !== undefined) {
    query.isActive = active === 'true';
  }
  
  // Search in title and description
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }
  
  const skip = (page - 1) * limit;
  
  const services = await Service.find(query)
    .sort({ order: 1, createdAt: -1 })
    .limit(parseInt(limit))
    .skip(skip);
  
  const total = await Service.countDocuments(query);
  
  res.status(200).json({
    success: true,
    count: services.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    data: services
  });
});

// @desc    Get single service by ID or slug
// @route   GET /api/services/:id
// @access  Public
exports.getService = asyncHandler(async (req, res) => {
  let service;
  
  // Check if it's a MongoDB ObjectId or slug
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    service = await Service.findById(req.params.id);
  } else {
    service = await Service.findOne({ slug: req.params.id });
  }
  
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
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
    features,
    category,
    price,
    duration,
    isActive,
    order,
    metaTitle,
    metaDescription,
    tags
  } = req.body;
  
  // Check if service with same title exists
  const serviceExists = await Service.findOne({ 
    title: { $regex: new RegExp(`^${title}$`, 'i') } 
  });
  
  if (serviceExists) {
    res.status(400);
    throw new Error('Service with this title already exists');
  }
  
  const service = await Service.create({
    title,
    description,
    image,
    icon,
    color,
    features: features || [],
    category,
    price,
    duration,
    isActive: isActive !== undefined ? isActive : true,
    order: order || 0,
    metaTitle: metaTitle || title,
    metaDescription: metaDescription || description,
    tags: tags || []
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
  let service = await Service.findById(req.params.id);
  
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }
  
  // Check if title is being changed and if new title already exists
  if (req.body.title && req.body.title !== service.title) {
    const titleExists = await Service.findOne({ 
      title: { $regex: new RegExp(`^${req.body.title}$`, 'i') },
      _id: { $ne: req.params.id }
    });
    
    if (titleExists) {
      res.status(400);
      throw new Error('Service with this title already exists');
    }
  }
  
  service = await Service.findByIdAndUpdate(
    req.params.id,
    req.body,
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
    res.status(404);
    throw new Error('Service not found');
  }
  
  await service.deleteOne();
  
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
    res.status(404);
    throw new Error('Service not found');
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
  const { services } = req.body; // Array of { id, order }
  
  if (!Array.isArray(services)) {
    res.status(400);
    throw new Error('Services must be an array');
  }
  
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
});

// @desc    Get service statistics
// @route   GET /api/services/stats
// @access  Private/Admin
exports.getServiceStats = asyncHandler(async (req, res) => {
  const totalServices = await Service.countDocuments();
  const activeServices = await Service.countDocuments({ isActive: true });
  const inactiveServices = await Service.countDocuments({ isActive: false });
  
  const servicesByCategory = await Service.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
  
  res.status(200).json({
    success: true,
    data: {
      total: totalServices,
      active: activeServices,
      inactive: inactiveServices,
      byCategory: servicesByCategory
    }
  });
});