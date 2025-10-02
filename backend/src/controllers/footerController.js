const Footer = require('../models/Footer');

// @desc    Get footer data
// @route   GET /api/footer
// @access  Public
const getFooter = async (req, res) => {
  try {
    let footer = await Footer.findOne({ isActive: true });

    if (!footer) {
      // Create default footer if not exists
      footer = await Footer.create({
        logoText: 'NexGen',
        description: 'Transforming visions into digital reality with cutting-edge technology and stunning design.',
        quickLinks: [
          { name: 'Home', url: '/', order: 0 },
          { name: 'About', url: '/about', order: 1 },
          { name: 'Services', url: '/services', order: 2 },
          { name: 'Contact', url: '/contact', order: 3 }
        ],
        serviceLinks: [
          { name: 'Web Development', url: '/services#web', order: 0 },
          { name: 'Mobile Apps', url: '/services#mobile', order: 1 },
          { name: 'UI/UX Design', url: '/services#design', order: 2 },
          { name: 'Cloud Solutions', url: '/services#cloud', order: 3 }
        ],
        socialLinks: [
          { platform: 'github', url: 'https://github.com', icon: 'Github' },
          { platform: 'twitter', url: 'https://twitter.com', icon: 'Twitter' },
          { platform: 'linkedin', url: 'https://linkedin.com', icon: 'Linkedin' },
          { platform: 'email', url: 'mailto:contact@nexgen.com', icon: 'Mail' }
        ],
        copyrightText: 'Made with ❤️'
      });
    }

    res.json({
      success: true,
      data: footer
    });
  } catch (error) {
    console.error('Get footer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching footer'
    });
  }
};

// @desc    Update footer data
// @route   PUT /api/footer
// @access  Private
const updateFooter = async (req, res) => {
  try {
    const {
      logoText,
      description,
      quickLinks,
      serviceLinks,
      socialLinks,
      copyrightText
    } = req.body;

    let footer = await Footer.findOne({ isActive: true });

    if (!footer) {
      footer = new Footer();
    }

    // Update fields
    if (logoText !== undefined) footer.logoText = logoText;
    if (description !== undefined) footer.description = description;
    if (quickLinks !== undefined) footer.quickLinks = quickLinks;
    if (serviceLinks !== undefined) footer.serviceLinks = serviceLinks;
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
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating footer'
    });
  }
};

module.exports = {
  getFooter,
  updateFooter
};