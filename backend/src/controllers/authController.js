const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const cloudinary = require('../config/cloudinary'); // ✅ use your existing Cloudinary config

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register new admin
// @route   POST /api/auth/register
// @access  Public
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Admin already exists with this email' });
    }

    const admin = await Admin.create({ name, email, password });
    const token = generateToken(admin._id);

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: {
        token,
        admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!admin.isActive) {
      return res.status(401).json({ success: false, message: 'Account is deactivated. Please contact administrator.' });
    }

    const isPasswordMatch = await admin.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken(admin._id);

    res.json({
      success: true,
      message: 'Login successful! 🎉',
      data: {
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          profilePicture: admin.profilePicture,
          lastLogin: admin.lastLogin,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @desc    Get current admin
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }
    res.json({
      success: true,
      data: {
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          profilePicture: admin.profilePicture,
          isActive: admin.isActive,
          lastLogin: admin.lastLogin,
          createdAt: admin.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Logout admin
// @route   POST /api/auth/logout
// @access  Private
const logoutAdmin = async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

// @desc    Update admin profile (name/email/profilePicture)
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, email, profilePicture } = req.body;

    const updatedUser = await Admin.findByIdAndUpdate(
      req.admin.id,
      { name, email, profilePicture },
      { new: true, runValidators: true }
    );

    res.json({ success: true, message: 'Profile updated successfully', data: updatedUser });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message });
  }
};

// @desc    Change password / email
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, newEmail } = req.body;
    const user = await Admin.findById(req.admin.id).select('+password');

    if (currentPassword && newPassword) {
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      }
      user.password = newPassword;
    }

    if (newEmail) {
      user.email = newEmail;
    }

    await user.save();
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Failed to update settings', error: error.message });
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ success: false, message: 'Please upload an image' });
    }

    const image = req.files.image;

    if (!image.mimetype.startsWith('image')) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    if (image.size > 5 * 1024 * 1024) {
      return res.status(400).json({ success: false, message: 'Image size must be less than 5MB' });
    }

    // express-fileupload gives either a tempFilePath (if useTempFiles:true in server config)
    // or an in-memory buffer (image.data). Handle both so this works regardless of your config.
    const uploadSource = image.tempFilePath
      ? image.tempFilePath
      : `data:${image.mimetype};base64,${image.data.toString('base64')}`;

    const result = await cloudinary.uploader.upload(uploadSource, {
      folder: 'admin-profiles',
      public_id: `profile-${req.admin.id}-${Date.now()}`,
      overwrite: true,
      transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
    });

    await Admin.findByIdAndUpdate(req.admin.id, { profilePicture: result.secure_url }, { new: true });

    console.log('✅ Profile image uploaded to Cloudinary:', result.secure_url);

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: result.secure_url,
        imageUrl: result.secure_url, // ProfilePopup.js isi key ko read karta hai
      },
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload image', error: error.message });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getMe,
  logoutAdmin,
  updateProfile,
  changePassword,
  uploadProfileImage,
};