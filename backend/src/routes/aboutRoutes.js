const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Import controllers
const {
  getAbout,
  updateAbout,
  addStat,
  deleteStat,
  addValue,
  deleteValue
} = require('../controllers/aboutController');

const { protect, authorize } = require('../middleware/auth');

const uploadsDir = path.join(__dirname, '../../public/uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Uploads directory created:', uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('📁 Saving to directory:', uploadsDir);
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = 'about-' + uniqueSuffix + path.extname(file.originalname);
    console.log('📝 Generated filename:', filename);
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  console.log('🔍 Checking file type:', file.mimetype);
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// ===== PUBLIC ROUTES =====
router.get('/', getAbout);

// ===== PROTECTED ROUTES (Need Authentication) =====
router.use(protect);
router.use(authorize('admin', 'super-admin'));

// ✅ FIXED: Upload route with authentication and detailed logging
router.post('/upload', upload.single('image'), (req, res) => {
  try {
    console.log('=== UPLOAD REQUEST START ===');
    console.log('📤 Headers:', req.headers);
    console.log('👤 User:', req.user ? req.user.email : 'Not authenticated');
    console.log('📁 File received:', req.file);
    console.log('📍 Upload directory:', uploadsDir);
    
    if (!req.file) {
      console.log('❌ No file in request');
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Check if file actually exists
    const filePath = path.join(uploadsDir, req.file.filename);
    const fileExists = fs.existsSync(filePath);
    console.log('📂 File exists on disk:', fileExists);
    console.log('📂 Full file path:', filePath);

    // ✅ Return relative URL that matches server.js static path
    const imageUrl = `/uploads/${req.file.filename}`;
    const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
    const fullImageUrl = `${baseUrl}${imageUrl}`;
    
    console.log('✅ Image URL:', imageUrl);
    console.log('✅ Full Image URL:', fullImageUrl);
    console.log('=== UPLOAD REQUEST END ===');
    
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        imageUrl: imageUrl,           // Relative: /uploads/about-123.png
        fullImageUrl: fullImageUrl,   // Full: https://domain.com/uploads/about-123.png
        filename: req.file.filename
      }
    });
  } catch (error) {
    console.error('❌ Image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Image upload failed',
      error: error.message
    });
  }
});

// Main update route
router.put('/', updateAbout);

// Stats routes
router.post('/stats', addStat);
router.delete('/stats/:id', deleteStat);

// Values routes
router.post('/values', addValue);
router.delete('/values/:id', deleteValue);

module.exports = router;