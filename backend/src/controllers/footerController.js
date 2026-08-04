const Footer = require('../models/Footer');

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

// @desc    Upload logo (Cloudinary via multer — same pattern as plant image upload)
// @route   POST /api/footer/logo
const uploadFooterLogo = async (req, res) => {
  try {
    console.log('📤 Logo upload request received');

    // ✅ FIX: multer-storage-cloudinary gives us req.file (singular), not req.files
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No logo file uploaded. Field name must be "logo"'
      });
    }

    // ✅ FIX: req.file.path is already the full Cloudinary URL after upload
    const logoUrl = req.file.path;

    // Update DB
    let footer = await Footer.findOne({ isActive: true });
    if (!footer) footer = new Footer();

    footer.logoImage = logoUrl;
    await footer.save();

    console.log('✅ Logo uploaded to Cloudinary:', footer.logoImage);

    res.json({
      success: true,
      message: 'Logo uploaded successfully',
      data: {
        logoImage: footer.logoImage,
        fullUrl: footer.logoImage
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