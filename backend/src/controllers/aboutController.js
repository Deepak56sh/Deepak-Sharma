// controllers/aboutController.js
const About = require('../models/About');
const fs = require('fs');
const path = require('path');

// @desc    Get about page data
// @route   GET /api/about
// @access  Public
exports.getAbout = async (req, res) => {
  try {
    let about = await About.findOne({ isActive: true });
    
    // If no data exists, create default data
    if (!about) {
      about = await About.create({
        title: 'About Us',
        subtitle: 'Crafting digital experiences that inspire and innovate',
        mainHeading: 'We Build Digital Dreams',
        description1: 'We\'re a passionate team of designers, developers, and innovators dedicated to pushing the boundaries of what\'s possible in the digital realm.',
        description2: 'With years of experience and countless successful projects, we transform complex challenges into elegant solutions that drive real results for our clients.',
        heroImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
        teamImage: '',
        additionalImages: [],
        stats: [
          { number: '500+', label: 'Projects Completed' },
          { number: '50+', label: 'Happy Clients' },
          { number: '15+', label: 'Awards Won' },
          { number: '99%', label: 'Satisfaction Rate' }
        ],
        values: [
          {
            title: 'Innovation First',
            description: 'We constantly push boundaries and explore new technologies to deliver cutting-edge solutions.',
            emoji: '🚀'
          },
          {
            title: 'Client Success',
            description: 'Your success is our success. We are committed to exceeding expectations on every project.',
            emoji: '🎯'
          },
          {
            title: 'Quality Driven',
            description: 'We never compromise on quality, ensuring every detail is perfect before delivery.',
            emoji: '⭐'
          }
        ]
      });
    }

    res.status(200).json({
      success: true,
      data: about
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching about data',
      error: error.message
    });
  }
};

// @desc    Update about page data
// @route   PUT /api/about
// @access  Private (Admin)
exports.updateAbout = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      mainHeading,
      description1,
      description2,
      heroImage,
      teamImage,
      additionalImages,
      stats,
      values
    } = req.body;

    let about = await About.findOne({ isActive: true });

    if (!about) {
      // Create new if doesn't exist
      about = await About.create(req.body);
    } else {
      // Update existing
      about.title = title || about.title;
      about.subtitle = subtitle || about.subtitle;
      about.mainHeading = mainHeading || about.mainHeading;
      about.description1 = description1 || about.description1;
      about.description2 = description2 || about.description2;
      about.heroImage = heroImage || about.heroImage;
      about.teamImage = teamImage || about.teamImage;
      about.additionalImages = additionalImages || about.additionalImages;
      about.stats = stats || about.stats;
      about.values = values || about.values;

      await about.save();
    }

    res.status(200).json({
      success: true,
      message: 'About page updated successfully',
      data: about
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating about data',
      error: error.message
    });
  }
};

// @desc    Add a new stat
// @route   POST /api/about/stats
// @access  Private (Admin)
exports.addStat = async (req, res) => {
  try {
    const { number, label } = req.body;

    if (!number || !label) {
      return res.status(400).json({
        success: false,
        message: 'Please provide number and label'
      });
    }

    const about = await About.findOne({ isActive: true });

    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'About data not found'
      });
    }

    about.stats.push({ number, label });
    await about.save();

    res.status(200).json({
      success: true,
      message: 'Stat added successfully',
      data: about
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding stat',
      error: error.message
    });
  }
};

// @desc    Delete a stat
// @route   DELETE /api/about/stats/:id
// @access  Private (Admin)
exports.deleteStat = async (req, res) => {
  try {
    const about = await About.findOne({ isActive: true });

    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'About data not found'
      });
    }

    about.stats = about.stats.filter(
      stat => stat._id.toString() !== req.params.id
    );
    
    await about.save();

    res.status(200).json({
      success: true,
      message: 'Stat deleted successfully',
      data: about
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting stat',
      error: error.message
    });
  }
};

// @desc    Add a new value
// @route   POST /api/about/values
// @access  Private (Admin)
exports.addValue = async (req, res) => {
  try {
    const { title, description, emoji } = req.body;

    if (!title || !description || !emoji) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and emoji'
      });
    }

    const about = await About.findOne({ isActive: true });

    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'About data not found'
      });
    }

    about.values.push({ title, description, emoji });
    await about.save();

    res.status(200).json({
      success: true,
      message: 'Value added successfully',
      data: about
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding value',
      error: error.message
    });
  }
};

// @desc    Delete a value
// @route   DELETE /api/about/values/:id
// @access  Private (Admin)
exports.deleteValue = async (req, res) => {
  try {
    const about = await About.findOne({ isActive: true });

    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'About data not found'
      });
    }

    about.values = about.values.filter(
      value => value._id.toString() !== req.params.id
    );
    
    await about.save();

    res.status(200).json({
      success: true,
      message: 'Value deleted successfully',
      data: about
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting value',
      error: error.message
    });
  }
};

// @desc    Add additional image
// @route   POST /api/about/additional-images
// @access  Private (Admin)
exports.addAdditionalImage = async (req, res) => {
  try {
    const { url, caption, altText } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'Please provide image URL'
      });
    }

    const about = await About.findOne({ isActive: true });

    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'About data not found'
      });
    }

    about.additionalImages.push({
      url,
      caption: caption || '',
      altText: altText || ''
    });

    await about.save();

    res.status(200).json({
      success: true,
      message: 'Additional image added successfully',
      data: about
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding additional image',
      error: error.message
    });
  }
};

// @desc    Delete additional image
// @route   DELETE /api/about/additional-images/:index
// @access  Private (Admin)
exports.deleteAdditionalImage = async (req, res) => {
  try {
    const about = await About.findOne({ isActive: true });

    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'About data not found'
      });
    }

    const index = parseInt(req.params.index);
    
    if (index < 0 || index >= about.additionalImages.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image index'
      });
    }

    about.additionalImages.splice(index, 1);
    await about.save();

    res.status(200).json({
      success: true,
      message: 'Additional image deleted successfully',
      data: about
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting additional image',
      error: error.message
    });
  }
};