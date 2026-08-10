const Service = require('../models/Service');
const asyncHandler = require('express-async-handler');

// @desc    Get all services (Public)
// @route   GET /api/services
// @access  Public
exports.getAllServices = asyncHandler(async (req, res) => {
  const { category, active, search, limit = 50, page = 1 } = req.query;

  const query = {};

  if (category && category !== 'all') {
    query.category = category;
  }

  if (active === 'all') {
    // admin: no filter, show everything
  } else if (active !== undefined) {
    query.isActive = active === 'true';
  } else {
    query.isActive = true;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const limitNum = parseInt(limit) > 100 ? 100 : parseInt(limit);

  const services = await Service.find(query)
    .sort({ createdAt: -1 })
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
    category = 'Other',
    price = 'Contact for pricing',
    duration = 'Varies',
    isActive = true
  } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Service title is required'
    });
  }

  if (!description || !description.trim() || description === '<p><br></p>') {
    return res.status(400).json({
      success: false,
      message: 'Service description is required'
    });
  }

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Service image is required'
    });
  }

  // multer-storage-cloudinary already uploaded the file —
  // req.file.path holds the Cloudinary secure_url
  const imageUrl = req.file.path;

  const cleanTitle = title.trim().substring(0, 100);
  const cleanDescription = description.trim().substring(0, 5000);

  const existingService = await Service.findOne({
    title: { $regex: new RegExp(`^${cleanTitle}$`, 'i') }
  });

  if (existingService) {
    return res.status(400).json({
      success: false,
      message: 'Service with this title already exists'
    });
  }

  const service = await Service.create({
    title: cleanTitle,
    description: cleanDescription,
    image: imageUrl,
    category: category.trim() || 'Other',
    price: price.trim() || 'Contact for pricing',
    duration: duration.trim() || 'Varies',
    isActive: isActive === 'true' || isActive === true,
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

  const updateData = { ...req.body };

  if (updateData.title !== undefined) {
    if (!updateData.title || !updateData.title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Service title cannot be empty'
      });
    }

    const cleanTitle = updateData.title.trim().substring(0, 100);

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

  if (updateData.description !== undefined) {
    if (!updateData.description || !updateData.description.trim() || updateData.description === '<p><br></p>') {
      return res.status(400).json({
        success: false,
        message: 'Description cannot be empty'
      });
    }
    updateData.description = updateData.description.trim().substring(0, 5000);
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

  if (updateData.isActive !== undefined) {
    updateData.isActive = updateData.isActive === 'true' || updateData.isActive === true;
  }

  // New image uploaded? multer-storage-cloudinary gives the URL in req.file.path
  if (req.file) {
    updateData.image = req.file.path;
  } else {
    delete updateData.image; // keep old image if not replaced
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