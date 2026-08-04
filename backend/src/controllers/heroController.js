const Hero = require('../models/Hero');

const defaultSlides = [
  {
    mediaType: 'image',
    media: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=1600&q=80',
    poster: '',
    title: 'Bring Nature',
    subtitle: 'Into Your Home',
    description: 'Premium indoor plants, stylish planters and expert care tips to create a greener living.',
    primaryBtn: 'Shop Plants',
    primaryBtnLink: '/shop',
    secondaryBtn: 'Explore Collections',
    secondaryBtnLink: '/shop',
    order: 0,
    isActive: true
  },
  {
    mediaType: 'video',
    media: 'https://cdn.coverr.co/videos/coverr-watering-a-plant-2652/1080p.mp4',
    poster: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1600&q=80',
    title: 'Fresh Plants',
    subtitle: 'Delivered Free',
    description: 'Handpicked healthy plants with free shipping on orders above ₹999 across India.',
    primaryBtn: 'Shop Now',
    primaryBtnLink: '/shop',
    secondaryBtn: 'View Best Sellers',
    secondaryBtnLink: '/shop',
    order: 1,
    isActive: true
  }
];

// GET /api/hero
exports.getHero = async (req, res) => {
  try {
    let hero = await Hero.findOne({ isActive: true });

    if (!hero) {
      hero = await Hero.create({
        badge: 'Free Shipping on orders above ₹999',
        slides: defaultSlides
      });
    }

    // Sort slides by order
    const data = hero.toObject();
    data.slides = (data.slides || [])
      .filter((s) => s.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching hero data',
      error: error.message
    });
  }
};

// PUT /api/hero  — full update (badge + slides array)
exports.updateHero = async (req, res) => {
  try {
    const { badge, slides } = req.body;

    let hero = await Hero.findOne({ isActive: true });

    if (!hero) {
      hero = await Hero.create({
        badge: badge || 'Free Shipping on orders above ₹999',
        slides: slides || defaultSlides
      });
    } else {
      if (badge !== undefined) hero.badge = badge;
      if (slides !== undefined) hero.slides = slides;
      await hero.save();
    }

    res.status(200).json({
      success: true,
      message: 'Hero section updated successfully',
      data: hero
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating hero data',
      error: error.message
    });
  }
};

// POST /api/hero/upload  — image or video via Cloudinary (multer middleware)
exports.uploadHeroMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Field name must be "media"'
      });
    }

    // multer-storage-cloudinary → req.file.path = secure_url
    const url = req.file.path || req.file.secure_url || req.file.url;
    const resourceType = req.file.resource_type || (req.file.mimetype?.startsWith('video') ? 'video' : 'image');

    res.status(200).json({
      success: true,
      message: 'Media uploaded successfully',
      data: {
        url,
        mediaUrl: url,
        mediaType: resourceType === 'video' ? 'video' : 'image',
        publicId: req.file.filename || req.file.public_id,
        format: req.file.format
      }
    });
  } catch (error) {
    console.error('Hero upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Upload failed'
    });
  }
};