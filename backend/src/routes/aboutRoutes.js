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

// ✅ CORRECT: Use __dirname to get absolute path
const uploadsDir = path.join(__dirname, '..', '..', 'public', 'uploads');

// Ensure directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory:', uploadsDir);
}

// ✅ Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('📁 Multer destination:', uploadsDir);
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
  console.log('🔍 File type check:', file.mimetype);
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
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// ===== PUBLIC ROUTES =====
router.get('/', getAbout);

// ===== PROTECTED ROUTES =====
router.use(protect);
router.use(authorize('admin', 'super-admin'));

// ✅ FIXED: Image upload route
router.post('/upload', upload.single('image'), (req, res) => {
  try {
    console.log('=== IMAGE UPLOAD START ===');
    console.log('👤 User:', req.user ? req.user.email : 'Not authenticated');
    console.log('📁 File:', req.file);
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Verify file exists
    const filePath = path.join(uploadsDir, req.file.filename);
    const exists = fs.existsSync(filePath);
    console.log('📂 File saved:', exists);
    console.log('📂 Full path:', filePath);

    // ✅ Return ONLY the relative path
    const imageUrl = `/uploads/${req.file.filename}`;
    
    console.log('✅ Image URL:', imageUrl);
    console.log('=== IMAGE UPLOAD SUCCESS ===');
    
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        imageUrl: imageUrl,  // /uploads/about-123.jpg
        filename: req.file.filename
      }
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Image upload failed',
      error: error.message
    });
  }
});

// Other routes
router.put('/', updateAbout);
router.post('/stats', addStat);
router.delete('/stats/:id', deleteStat);
router.post('/values', addValue);
router.delete('/values/:id', deleteValue);

module.exports = router;