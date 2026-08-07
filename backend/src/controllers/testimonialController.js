const Testimonial = require('../models/Testimonial');

// GET /api/testimonials — public, active only, sorted
const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: testimonials });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching testimonials' });
  }
};

// GET /api/testimonials/all — admin, everything
const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: testimonials });
  } catch (error) {
    console.error('Get all testimonials error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching testimonials' });
  }
};

// POST /api/testimonials — admin, create
const createTestimonial = async (req, res) => {
  try {
    const { name, role, avatar, rating, text, order, isActive } = req.body;

    if (!name || !text) {
      return res.status(400).json({ success: false, message: 'Name and testimonial text are required' });
    }

    const testimonial = await Testimonial.create({
      name,
      role: role || '',
      avatar: avatar || '',
      rating: rating || 5,
      text,
      order: order || 0,
      isActive: isActive !== false
    });

    res.status(201).json({ success: true, message: 'Testimonial added successfully', data: testimonial });
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error while creating testimonial' });
  }
};

// PUT /api/testimonials/:id — admin, update
const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    const fields = ['name', 'role', 'avatar', 'rating', 'text', 'order', 'isActive'];
    fields.forEach((key) => {
      if (req.body[key] !== undefined) testimonial[key] = req.body[key];
    });

    await testimonial.save();
    res.json({ success: true, message: 'Testimonial updated successfully', data: testimonial });
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating testimonial' });
  }
};

// DELETE /api/testimonials/:id — admin
const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting testimonial' });
  }
};

// POST /api/testimonials/upload — admin, Cloudinary avatar image upload
const uploadTestimonialAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded. Field name must be "avatar"' });
    }

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: { url: req.file.path }
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ success: false, message: error.message || 'Upload failed' });
  }
};

module.exports = {
  getTestimonials,
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  uploadTestimonialAvatar
};