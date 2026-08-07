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

  const query = {};

  if (category && category !== 'all') {
    query.category = category;
  }

  if (active !== undefined) {
    query.isActive = active === 'true';
  } else {
    query.isActive = true;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  if (featured === 'true') {
    query.order = { $lte: 6 };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const limitNum = parseInt(limit) > 100 ? 100 : parseInt(limit);

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

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    service = await Service.findById(id);
  } else {
    service = await Service.findOne({ slug: id });
  }

  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found'
    });
  }

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
    icon = 'Code',
    color = 'from-green-600 to-emerald-500',
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

  // Validation
  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, message: 'Service title is required' });
  }
  if (!description || !description.trim()) {
    return res.status(400).json({ success: false, message: 'Service description is required' });
  }

  // Cloudinary image (from multer)
  let imageUrl = '';
  if (req.file) {
    // CloudinaryStorage returns secure_url in req.file.path
    imageUrl = req.file.path || req.file.secure_url || req.file.url;
  } else if (req.body.image) {
    imageUrl = req.body.image;
  }

  if (!imageUrl) {
    return res.status(400).json({ success: false, message: 'Service image is required' });
  }

  const cleanTitle = title.trim().substring(0, 100);
  const cleanDescription = description.trim().substring(0, 500);

  // Features & Tags
  let cleanFeatures = [];
  if (Array.isArray(features)) {
    cleanFeatures = features
      .filter(f => f && typeof f === 'string' && f.trim())
      .map(f => f.trim().substring(0, 100))
      .slice(0, 10);
  } else if (typeof features === 'string') {
    try {
      const parsed = JSON.parse(features);
      cleanFeatures = Array.isArray(parsed) ? parsed.slice(0, 10) : [];
    } catch {
      cleanFeatures = features.split(',').map(f => f.trim()).filter(Boolean).slice(0, 10);
    }
  }

  let cleanTags = [];
  if (Array.isArray(tags)) {
    cleanTags = tags
      .filter(t => t && typeof t === 'string' && t.trim())
      .map(t => t.trim().substring(0, 50))
      .slice(0, 10);
  } else if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags);
      cleanTags = Array.isArray(parsed) ? parsed.slice(0, 10) : [];
    } catch {
      cleanTags = tags.split(',').map(t => t.trim()).filter(Boolean).slice(0, 10);
    }
  }

  // Duplicate check
  const existing = await Service.findOne({
    title: { $regex: new RegExp(`^${cleanTitle}$`, 'i') }
  });
  if (existing) {
    return res.status(400).json({ success: false, message: 'Service with this title already exists' });
  }

  const service = await Service.create({
    title: cleanTitle,
    description: cleanDescription,
    image: imageUrl,
    icon: icon.trim() || 'Code',
    color: color.trim() || 'from-green-600 to-emerald-500',
    features: cleanFeatures,
    category: category.trim() || 'Other',
    price: price.trim() || 'Contact for pricing',
    duration: duration.trim() || 'Varies',
    isActive: Boolean(isActive === 'true' || isActive === true),
    order: parseInt(order) || 0,
    metaTitle: metaTitle ? metaTitle.trim().substring(0, 100) : cleanTitle,
    metaDescription: metaDescription ? metaDescription.trim().substring(0, 160) : cleanDescription.substring(0, 160),
    tags: cleanTags,
    createdBy: req.admin?.id
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
    return res.status(404).json({ success: false, message: 'Service not found' });
  }

  const updateData = { ...req.body };

  // Cloudinary new image
  if (req.file) {
    updateData.image = req.file.path || req.file.secure_url || req.file.url;
  }

  // Title
  if (updateData.title !== undefined) {
    if (!updateData.title.trim()) {
      return res.status(400).json({ success: false, message: 'Title cannot be empty' });
    }
    const cleanTitle = updateData.title.trim().substring(0, 100);
    if (cleanTitle !== service.title) {
      const existing = await Service.findOne({
        title: { $regex: new RegExp(`^${cleanTitle}$`, 'i') },
        _id: { $ne: id }
      });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Service with this title already exists' });
      }
    }
    updateData.title = cleanTitle;
  }

  // Description
  if (updateData.description !== undefined) {
    if (!updateData.description.trim()) {
      return res.status(400).json({ success: false, message: 'Description cannot be empty' });
    }
    updateData.description = updateData.description.trim().substring(0, 500);
  }

  // Features
  if (updateData.features !== undefined) {
    let cleanFeatures = [];
    if (Array.isArray(updateData.features)) {
      cleanFeatures = updateData.features
        .filter(f => f && typeof f === 'string' && f.trim())
        .map(f => f.trim().substring(0, 100))
        .slice(0, 10);
    } else if (typeof updateData.features === 'string') {
      try {
        const parsed = JSON.parse(updateData.features);
        cleanFeatures = Array.isArray(parsed) ? parsed.slice(0, 10) : [];
      } catch {
        cleanFeatures = updateData.features.split(',').map(f => f.trim()).filter(Boolean).slice(0, 10);
      }
    }
    updateData.features = cleanFeatures;
  }

  // Tags
  if (updateData.tags !== undefined) {
    let cleanTags = [];
    if (Array.isArray(updateData.tags)) {
      cleanTags = updateData.tags
        .filter(t => t && typeof t === 'string' && t.trim())
        .map(t => t.trim().substring(0, 50))
        .slice(0, 10);
    } else if (typeof updateData.tags === 'string') {
      try {
        const parsed = JSON.parse(updateData.tags);
        cleanTags = Array.isArray(parsed) ? parsed.slice(0, 10) : [];
      } catch {
        cleanTags = updateData.tags.split(',').map(t => t.trim()).filter(Boolean).slice(0, 10);
      }
    }
    updateData.tags = cleanTags;
  }

  // Other fields
  if (updateData.isActive !== undefined) {
    updateData.isActive = Boolean(updateData.isActive === 'true' || updateData.isActive === true);
  }
  if (updateData.order !== undefined) {
    updateData.order = parseInt(updateData.order) || 0;
  }

  service = await Service.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  });

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
    return res.status(404).json({ success: false, message: 'Service not found' });
  }

  await Service.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Service deleted successfully',
    data: {}
  });
});

// @desc    Toggle active status
// @route   PATCH /api/services/:id/toggle
// @access  Private/Admin
exports.toggleServiceStatus = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    return res.status(404).json({ success: false, message: 'Service not found' });
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
    return res.status(400).json({ success: false, message: 'Services array is required' });
  }

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

// @desc    Get stats
// @route   GET /api/services/stats/all
// @access  Private/Admin
exports.getServiceStats = asyncHandler(async (req, res) => {
  const totalServices = await Service.countDocuments();
  const activeServices = await Service.countDocuments({ isActive: true });
  const inactiveServices = await Service.countDocuments({ isActive: false });

  const servicesByCategory = await Service.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        active: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } }
      }
    },
    { $sort: { count: -1 } }
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
});