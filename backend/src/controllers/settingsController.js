const asyncHandler = require('express-async-handler');
const Settings = require('../models/Settings');

// @desc    Get settings
// @route   GET /api/settings
// @access  Public
exports.getSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.getSettings(); // using the static method from model

  res.status(200).json({
    success: true,
    data: settings
  });
});

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Admin
exports.updateSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create(req.body);
  } else {
    settings = await Settings.findByIdAndUpdate(
      settings._id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
  }

  res.status(200).json({
    success: true,
    message: 'Settings updated successfully',
    data: settings
  });
});