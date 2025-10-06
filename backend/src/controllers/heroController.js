// controllers/heroController.js
const Hero = require('../models/Hero');

// @desc    Get hero section data
// @route   GET /api/hero
// @access  Public
exports.getHero = async (req, res) => {
  try {
    let hero = await Hero.findOne({ isActive: true });
    
    // If no data exists, create default data
    if (!hero) {
      hero = await Hero.create({
        badge: 'Welcome to the Future',
        mainTitle: 'Digital Innovation',
        subTitle: 'Starts Here',
        description: 'Transform your vision into reality with cutting-edge technology and stunning design that captivates your audience',
        primaryButton: 'Explore Services',
        secondaryButton: 'Get in Touch'
      });
    }

    res.status(200).json({
      success: true,
      data: hero
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching hero data',
      error: error.message
    });
  }
};

// @desc    Update hero section data
// @route   PUT /api/hero
// @access  Private (Admin)
exports.updateHero = async (req, res) => {
  try {
    const {
      badge,
      mainTitle,
      subTitle,
      description,
      primaryButton,
      secondaryButton
    } = req.body;

    let hero = await Hero.findOne({ isActive: true });

    if (!hero) {
      // Create new if doesn't exist
      hero = await Hero.create(req.body);
    } else {
      // Update existing
      hero.badge = badge || hero.badge;
      hero.mainTitle = mainTitle || hero.mainTitle;
      hero.subTitle = subTitle || hero.subTitle;
      hero.description = description || hero.description;
      hero.primaryButton = primaryButton || hero.primaryButton;
      hero.secondaryButton = secondaryButton || hero.secondaryButton;

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