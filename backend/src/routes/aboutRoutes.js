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

// ✅ FIX: CORRECT path for Windows
const uploadsDir = path.join(__dirname, '..', '..', 'public', 'uploads');

console.log('📂 AboutRoutes - __dirname:', __dirname);
console.log('📂 AboutRoutes - uploadsDir:', uploadsDir);
console.log('📂 AboutRoutes - Directory exists?', fs.existsSync(uploadsDir));

// Ensure directory exists
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Created uploads directory:', uploadsDir);
  }
  
  // Test if directory is writable
  fs.accessSync(uploadsDir, fs.constants.W_OK);
  console.log('✅ Directory is writable');
} catch (error) {
  console.error('❌ Directory error:', error.message);
  // Fallback to current working directory
  const fallbackDir = path.join(process.cwd(), 'temp_uploads');
  if (!fs.existsSync(fallbackDir)) {
    fs.mkdirSync(fallbackDir, { recursive: true });
  }
  console.log('⚠️ Using fallback directory:', fallbackDir);
}

// ✅ Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('📁 Multer saving to:', uploadsDir);
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

// ✅ FIXED: Image upload route with detailed logging
router.post('/upload', upload.single('image'), (req, res) => {
  try {
    console.log('=== IMAGE UPLOAD START ===');
    console.log('👤 User:', req.user ? req.user.email : 'Not authenticated');
    console.log('📁 Req.file:', req.file);
    console.log('📁 Req.body:', req.body);
    
    if (!req.file) {
      console.log('❌ No file in request');
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Verify file exists
    const filePath = path.join(uploadsDir, req.file.filename);
    console.log('📂 Expected path:', filePath);
    
    const exists = fs.existsSync(filePath);
    console.log('📂 File exists?', exists);
    
    // List files in directory
    try {
      const files = fs.readdirSync(uploadsDir);
      console.log('📂 Files in uploadsDir:', files);
    } catch (err) {
      console.log('❌ Cannot read uploads directory:', err.message);
    }

    if (!exists) {
      console.error('❌ File was not saved! Check permissions.');
      return res.status(500).json({
        success: false,
        message: 'File was not saved to disk',
        details: {
          expectedPath: filePath,
          directory: uploadsDir
        }
      });
    }

    // Get file stats
    const stats = fs.statSync(filePath);
    console.log('📂 File stats:', {
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime
    });

    // ✅ Return ONLY the relative path
    const imageUrl = `/uploads/${req.file.filename}`;
    
    console.log('✅ Image URL:', imageUrl);
    console.log('=== IMAGE UPLOAD SUCCESS ===');
    
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        imageUrl: imageUrl,
        filename: req.file.filename,
        size: stats.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Image upload failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
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