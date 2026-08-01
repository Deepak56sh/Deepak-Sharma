const Footer = require('../models/Footer');
const path = require('path');
const fs = require('fs');

// GET /api/footer
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
          { name: 'Care Guide', url: '/care-guide', order: 2 },
          { name: 'About Us', url: '/about', order: 3 },
          { name: 'Contact Us', url: '/contact', order: 4 }
        ],
        serviceLinks: [
          { name: 'Indoor Plants', url: '/shop?type=indoor', order: 0 },
          { name: 'Air Purifying', url: '/shop?type=air-purifying', order: 1 },
          { name: 'Low Maintenance', url: '/shop?type=low-maintenance', order: 2 },
          { name: 'Succulents', url: '/shop?type=succulents', order: 3 },
          { name: 'Large Plants', url: '/shop?type=large', order: 4 },
          { name: 'Accessories', url: '/shop?type=accessories', order: 5 }
        ],
        customerCare: [
          { name: 'My Account', url: '/account', order: 0 },
          { name: 'Track Order', url: '/account?tab=orders', order: 1 },
          { name: 'Returns & Refunds', url: '/returns', order: 2 },
          { name: 'Shipping Policy', url: '/shipping', order: 3 },
          { name: 'Terms & Conditions', url: '/terms', order: 4 },
          { name: 'Privacy Policy', url: '/privacy', order: 5 }
        ],
        socialLinks: [
          { platform: 'instagram', url: 'https://instagram.com', icon: 'Instagram' },
          { platform: 'facebook', url: 'https://facebook.com', icon: 'Facebook' },
          { platform: 'twitter', url: 'https://twitter.com', icon: 'Twitter' },
          { platform: 'youtube', url: 'https://youtube.com', icon: 'Youtube' }
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

// PUT /api/footer  (JSON update — links, text, etc.)
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
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error while updating footer' });
  }
};

// POST /api/footer/logo  (image upload — multer se file aayegi)
const uploadFooterLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No logo file uploaded' });
    }

    let footer = await Footer.findOne({ isActive: true });
    if (!footer) footer = new Footer();

    // Delete old logo if exists
    if (footer.logoImage && footer.logoImage.startsWith('/uploads/')) {
      const oldPath = path.join(__dirname, '..', footer.logoImage);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    footer.logoImage = `/uploads/${req.file.filename}`;
    await footer.save();

    res.json({
      success: true,
      message: 'Logo uploaded successfully',
      data: { logoImage: footer.logoImage }
    });
  } catch (error) {
    console.error('Upload logo error:', error);
    res.status(500).json({ success: false, message: 'Server error while uploading logo' });
  }
};

module.exports = {
  getFooter,
  updateFooter,
  uploadFooterLogo
};