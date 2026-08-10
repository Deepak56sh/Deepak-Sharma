const About = require('../models/About');

// @desc    Get about page data
// @route   GET /api/about
// @access  Public
exports.getAbout = async (req, res) => {
  try {
    let about = await About.findOne({ isActive: true });

    if (!about) {
      about = await About.create({
        title: 'About Us',
        subtitle: 'Growing with passion, harvesting with care',
        mainHeading: 'We Build Sustainable Farms',
        description1: 'We are a dedicated team of farmers and agronomists committed to sustainable, high-quality farming practices.',
        description2: 'With years of hands-on experience, we transform raw land into thriving, productive farms for our community.',
        teamImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
        stats: [
          { number: '500+', label: 'Acres Cultivated' },
          { number: '50+', label: 'Happy Clients' },
          { number: '15+', label: 'Awards Won' },
          { number: '99%', label: 'Satisfaction Rate' }
        ],
        values: [],
        awards: [],
        teamMembers: []
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
      teamImage,
      stats,
      values
    } = req.body;

    let about = await About.findOne({ isActive: true });

    if (!about) {
      about = await About.create(req.body);
    } else {
      about.title = title || about.title;
      about.subtitle = subtitle || about.subtitle;
      about.mainHeading = mainHeading || about.mainHeading;
      about.description1 = description1 || about.description1;
      about.description2 = description2 || about.description2;
      about.teamImage = teamImage || about.teamImage;
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
      return res.status(400).json({ success: false, message: 'Please provide number and label' });
    }

    const about = await About.findOne({ isActive: true });
    if (!about) return res.status(404).json({ success: false, message: 'About data not found' });

    about.stats.push({ number, label });
    await about.save();

    res.status(200).json({ success: true, message: 'Stat added successfully', data: about });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding stat', error: error.message });
  }
};

// @desc    Delete a stat
// @route   DELETE /api/about/stats/:id
// @access  Private (Admin)
exports.deleteStat = async (req, res) => {
  try {
    const about = await About.findOne({ isActive: true });
    if (!about) return res.status(404).json({ success: false, message: 'About data not found' });

    about.stats = about.stats.filter(stat => stat._id.toString() !== req.params.id);
    await about.save();

    res.status(200).json({ success: true, message: 'Stat deleted successfully', data: about });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting stat', error: error.message });
  }
};

// @desc    Add a new value
// @route   POST /api/about/values
// @access  Private (Admin)
exports.addValue = async (req, res) => {
  try {
    const { title, description, emoji } = req.body;

    if (!title || !description || !emoji) {
      return res.status(400).json({ success: false, message: 'Please provide title, description, and emoji' });
    }

    const about = await About.findOne({ isActive: true });
    if (!about) return res.status(404).json({ success: false, message: 'About data not found' });

    about.values.push({ title, description, emoji });
    await about.save();

    res.status(200).json({ success: true, message: 'Value added successfully', data: about });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding value', error: error.message });
  }
};

// @desc    Delete a value
// @route   DELETE /api/about/values/:id
// @access  Private (Admin)
exports.deleteValue = async (req, res) => {
  try {
    const about = await About.findOne({ isActive: true });
    if (!about) return res.status(404).json({ success: false, message: 'About data not found' });

    about.values = about.values.filter(value => value._id.toString() !== req.params.id);
    await about.save();

    res.status(200).json({ success: true, message: 'Value deleted successfully', data: about });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting value', error: error.message });
  }
};

// @desc    Add a new award
// @route   POST /api/about/awards
// @access  Private (Admin)
exports.addAward = async (req, res) => {
  try {
    const { image, title } = req.body;

    if (!image || !title) {
      return res.status(400).json({ success: false, message: 'Please provide image and award title' });
    }

    const about = await About.findOne({ isActive: true });
    if (!about) return res.status(404).json({ success: false, message: 'About data not found' });

    about.awards.push({ image, title });
    await about.save();

    res.status(200).json({ success: true, message: 'Award added successfully', data: about });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding award', error: error.message });
  }
};

// @desc    Delete an award
// @route   DELETE /api/about/awards/:id
// @access  Private (Admin)
exports.deleteAward = async (req, res) => {
  try {
    const about = await About.findOne({ isActive: true });
    if (!about) return res.status(404).json({ success: false, message: 'About data not found' });

    about.awards = about.awards.filter(award => award._id.toString() !== req.params.id);
    await about.save();

    res.status(200).json({ success: true, message: 'Award deleted successfully', data: about });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting award', error: error.message });
  }
};

// @desc    Add a new team member
// @route   POST /api/about/team
// @access  Private (Admin)
exports.addTeamMember = async (req, res) => {
  try {
    const { name, position, image } = req.body;

    if (!name || !position || !image) {
      return res.status(400).json({ success: false, message: 'Please provide name, position and image' });
    }

    const about = await About.findOne({ isActive: true });
    if (!about) return res.status(404).json({ success: false, message: 'About data not found' });

    about.teamMembers.push({ name, position, image });
    await about.save();

    res.status(200).json({ success: true, message: 'Team member added successfully', data: about });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding team member', error: error.message });
  }
};

// @desc    Delete a team member
// @route   DELETE /api/about/team/:id
// @access  Private (Admin)
exports.deleteTeamMember = async (req, res) => {
  try {
    const about = await About.findOne({ isActive: true });
    if (!about) return res.status(404).json({ success: false, message: 'About data not found' });

    about.teamMembers = about.teamMembers.filter(member => member._id.toString() !== req.params.id);
    await about.save();

    res.status(200).json({ success: true, message: 'Team member deleted successfully', data: about });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting team member', error: error.message });
  }
};