const InstagramReel = require('../models/InstagramReel');

// GET /api/instagram — public, active only, sorted
const getReels = async (req, res) => {
  try {
    const reels = await InstagramReel.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: reels });
  } catch (error) {
    console.error('Get reels error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching reels' });
  }
};

// GET /api/instagram/all — admin, everything
const getAllReels = async (req, res) => {
  try {
    const reels = await InstagramReel.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: reels });
  } catch (error) {
    console.error('Get all reels error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching reels' });
  }
};

// POST /api/instagram — admin, create
const createReel = async (req, res) => {
  try {
    const { video, poster, title, link, order, isActive } = req.body;

    if (!video) {
      return res.status(400).json({ success: false, message: 'Video is required' });
    }

    const reel = await InstagramReel.create({
      video,
      poster: poster || '',
      title: title || '',
      link: link || '',
      order: order || 0,
      isActive: isActive !== false
    });

    res.status(201).json({ success: true, message: 'Reel added successfully', data: reel });
  } catch (error) {
    console.error('Create reel error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error while creating reel' });
  }
};

// PUT /api/instagram/:id — admin, update
const updateReel = async (req, res) => {
  try {
    const reel = await InstagramReel.findById(req.params.id);
    if (!reel) {
      return res.status(404).json({ success: false, message: 'Reel not found' });
    }

    const fields = ['video', 'poster', 'title', 'link', 'order', 'isActive'];
    fields.forEach((key) => {
      if (req.body[key] !== undefined) reel[key] = req.body[key];
    });

    await reel.save();
    res.json({ success: true, message: 'Reel updated successfully', data: reel });
  } catch (error) {
    console.error('Update reel error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating reel' });
  }
};

// DELETE /api/instagram/:id — admin
const deleteReel = async (req, res) => {
  try {
    const reel = await InstagramReel.findById(req.params.id);
    if (!reel) {
      return res.status(404).json({ success: false, message: 'Reel not found' });
    }
    await InstagramReel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Reel deleted successfully' });
  } catch (error) {
    console.error('Delete reel error:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting reel' });
  }
};

// POST /api/instagram/upload — admin, Cloudinary video (or poster image) upload
const uploadReelMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded. Field name must be "media"' });
    }

    const url = req.file.path || req.file.secure_url || req.file.url;
    const resourceType = req.file.resource_type || (req.file.mimetype?.startsWith('video') ? 'video' : 'image');

    res.json({
      success: true,
      message: 'Uploaded successfully',
      data: {
        url,
        mediaType: resourceType === 'video' ? 'video' : 'image'
      }
    });
  } catch (error) {
    console.error('Reel upload error:', error);
    res.status(500).json({ success: false, message: error.message || 'Upload failed' });
  }
};

module.exports = {
  getReels,
  getAllReels,
  createReel,
  updateReel,
  deleteReel,
  uploadReelMedia
};