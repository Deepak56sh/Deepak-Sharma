const asyncHandler = require('express-async-handler');
const Settings = require('../models/Settings');

// @desc    Get settings
// @route   GET /api/settings
// @access  Public
exports.getSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.getSettings();

  res.status(200).json({
    success: true,
    data: settings
  });
});

// @desc    Update settings (text fields)
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

// @desc    Upload / change site logo
// @route   POST /api/settings/upload-logo
// @access  Private/Admin
exports.uploadSiteLogo = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No logo file uploaded'
    });
  }

  let settings = await Settings.getSettings();
  settings.siteLogo = req.file.path;
  await settings.save();

  res.status(200).json({
    success: true,
    message: 'Logo uploaded successfully',
    data: settings
  });
});

// @desc    Upload / change favicon
// @route   POST /api/settings/upload-favicon
// @access  Private/Admin
exports.uploadSiteFavicon = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No favicon file uploaded'
    });
  }

  let settings = await Settings.getSettings();
  settings.siteFavicon = req.file.path;
  await settings.save();

  res.status(200).json({
    success: true,
    message: 'Favicon uploaded successfully',
    data: settings
  });
});