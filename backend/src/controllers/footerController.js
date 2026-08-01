const Footer = require('../models/Footer');
const path = require('path');
const fs = require('fs');

// Uploads path — same logic as server.js
const isRender = process.env.RENDER_EXTERNAL_URL || process.env.NODE_ENV === 'production';
const uploadsPath = isRender
  ? '/tmp/uploads'
  : path.join(__dirname, '../../public/uploads'); // adjust if needed

// @desc    Get footer
// @route   GET /api/footer
const getFooter = async (req, res) => {
  try {
    let footer = await Footer.findOne({ isActive: true });

    if (!footer) {
      footer = await Footer.create({
        logoText: 'Plantora',
        logoImage: '',
        description: 'Bringing nature closer to home. Premium plants carefully packed and delivered to your door.',
        quickLinks: [
          { name: 'Home', url: '/', order: 0 },
          { name: 'Shop', url: '/shop', order: 1 },
          { name: 'About Us', url: '/about', order: 2 },
          { name: 'Contact Us', url: '/contact', order: 3 }
        ],
        serviceLinks: [
          { name: 'Indoor Plants', url: '/shop?type=indoor', order: 0 },
          { name: 'Air Purifying', url: '/shop?type=air-purifying', order: 1 },
          { name: 'Low Maintenance', url: '/shop?type=low-maintenance', order: 2 }
        ],
        customerCare: [
          { name: 'My Account', url: '/account', order: 0 },
          { name: 'Track Order', url: '/account?tab=orders', order: 1 }
        ],
        socialLinks: [
          { platform: 'instagram', url: 'https://instagram.com', icon: 'Instagram' },
          { platform: 'facebook', url: 'https://facebook.com', icon: 'Facebook' }
        ],
        copyrightText: 'All rights reserved.'
      });
    }

    res.json({ success: true, data: footer });
  } catch (error) {
    console.error('Get footer error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching footer' });
  }
};

// @desc    Update footer
// @route   PUT /api/footer
const updateFooter = async (req, res) => {
  try {
    const {
      logoText,
      logoImage,
      description,
      quickLinks,
      serviceLinks,
      customerCare,
      socialLinks,
      copyrightText
    } = req.body;

    let footer = await Footer.findOne({ isActive: true });
    if (!footer) footer = new Footer();

    if (logoText !== undefined) footer.logoText = logoText;
    if (logoImage !== undefined) footer.logoImage = logoImage;
    if (description !== undefined) footer.description = description;
    if (quickLinks !== undefined) footer.quickLinks = quickLinks;
    if (serviceLinks !== undefined) footer.serviceLinks = serviceLinks;
    if (customerCare !== undefined) footer.customerCare = customerCare;
    if (socialLinks !== undefined) footer.socialLinks = socialLinks;
    if (copyrightText !== undefined) footer.copyrightText = copyrightText;

    await footer.save();

    res.json({
      success: true,
      message: 'Footer updated successfully',
      data: footer
    });
  } catch (error) {
    console.error('Update footer error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating footer' });
  }
};

// @desc    Upload logo (express-fileupload)
// @route   POST /api/footer/logo
const uploadFooterLogo = async (req, res) => {
  try {
    console.log('📤 Logo upload request received');
    console.log('Files:', req.files ? Object.keys(req.files) : 'none');

    // express-fileupload se file aati hai
    if (!req.files || !req.files.logo) {
      return res.status(400).json({
        success: false,
        message: 'No logo file uploaded. Field name must be "logo"',
        debug: {
          hasFiles: !!req.files,
          keys: req.files ? Object.keys(req.files) : []
        }
      });
    }

    const logo = req.files.logo;

    // Validate type
    if (!logo.mimetype.startsWith('image/')) {
      return res.status(400).json({
        success: false,
        message: 'Only image files are allowed'
      });
    }

    // Validate size (2MB)
    if (logo.size > 2 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'Image must be under 2MB'
      });
    }

    // Ensure uploads dir exists
    if (!fs.existsSync(uploadsPath)) {
      fs.mkdirSync(uploadsPath, { recursive: true });
    }

    // Unique filename
    const ext = path.extname(logo.name) || '.png';
    const fileName = `logo-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const uploadPath = path.join(uploadsPath, fileName);

    console.log('📁 Saving logo to:', uploadPath);

    // Move file
    await logo.mv(uploadPath);

    // Verify
    if (!fs.existsSync(uploadPath)) {
      throw new Error('File saved but not found on disk');
    }

    // Update DB
    let footer = await Footer.findOne({ isActive: true });
    if (!footer) footer = new Footer();

    // Delete old logo (optional)
    if (footer.logoImage && footer.logoImage.startsWith('/uploads/')) {
      const oldFile = path.join(uploadsPath, path.basename(footer.logoImage));
      if (fs.existsSync(oldFile)) {
        try { fs.unlinkSync(oldFile); } catch (e) { console.log('Old logo delete failed:', e.message); }
      }
    }

    footer.logoImage = `/uploads/${fileName}`;
    await footer.save();

    console.log('✅ Logo uploaded:', footer.logoImage);

    res.json({
      success: true,
      message: 'Logo uploaded successfully',
      data: {
        logoImage: footer.logoImage,
        fullUrl: `https://my-site-backend-0661.onrender.com/uploads/${fileName}`
      }
    });
  } catch (error) {
    console.error('❌ Upload logo error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while uploading logo'
    });
  }
};

module.exports = {
  getFooter,
  updateFooter,
  uploadFooterLogo
};