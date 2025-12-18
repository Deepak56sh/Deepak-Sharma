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

// ✅ CRITICAL FIX: Use SAME detection as server.js
const isRender = process.env.RENDER_EXTERNAL_URL || process.env.NODE_ENV === 'production';

let uploadsDir;

if (isRender) {
  // Render.com uses /tmp/uploads (SAME as server.js)
  uploadsDir = '/tmp/uploads';
  console.log('🚀 Running on Render.com - Using /tmp/uploads');
} else {
  // Local development
  uploadsDir = path.join(__dirname, '..', '..', 'public', 'uploads');
  console.log('💻 Running locally');
}

console.log('📂 Uploads directory:', uploadsDir);
console.log('📂 Directory exists?', fs.existsSync(uploadsDir));

// Ensure directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory:', uploadsDir);
}

// ✅ Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('📁 Multer saving to:', uploadsDir);
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = 'about-' + uniqueSuffix + ext;
    console.log('📝 Generated filename:', filename);
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  console.log('🔍 File type check:', file.mimetype);
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
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
    console.log('📁 File received:', req.file ? req.file.filename : 'No file');
    console.log('📁 Is Render environment?', isRender);
    console.log('📁 Uploads directory:', uploadsDir);
    
    if (!req.file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Verify file exists
    const filePath = path.join(uploadsDir, req.file.filename);
    const exists = fs.existsSync(filePath);
    
    console.log('📂 File path:', filePath);
    console.log('📂 File exists?', exists);
    
    // List all files in uploads directory for debugging
    try {
      const files = fs.readdirSync(uploadsDir);
      console.log('📂 All files in uploads directory:', files);
      console.log('📂 Total files:', files.length);
    } catch (err) {
      console.log('⚠️ Cannot list uploads directory:', err.message);
    }

    if (!exists) {
      console.error('❌ ERROR: File was not saved!');
      
      // Additional debugging
      console.log('🔍 Checking parent directory:', path.dirname(filePath));
      console.log('🔍 Parent exists?', fs.existsSync(path.dirname(filePath)));
      
      return res.status(500).json({
        success: false,
        message: 'File was not saved to disk',
        debug: {
          uploadsDir: uploadsDir,
          filename: req.file.filename,
          isRender: isRender,
          filePath: filePath,
          directoryExists: fs.existsSync(uploadsDir),
          env: {
            NODE_ENV: process.env.NODE_ENV,
            RENDER: process.env.RENDER,
            RENDER_EXTERNAL_URL: process.env.RENDER_EXTERNAL_URL
          }
        }
      });
    }

    // Get file stats
    const stats = fs.statSync(filePath);
    console.log('✅ File saved successfully:', {
      size: stats.size,
      path: filePath,
      created: stats.birthtime
    });

    // ✅ Return image URL
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
        mimetype: req.file.mimetype,
        path: filePath,
        url: `https://${req.get('host')}${imageUrl}`
      }
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    console.error('❌ Error stack:', error.stack);
    
    res.status(500).json({
      success: false,
      message: 'Image upload failed',
      error: error.message,
      isRender: isRender,
      uploadsDir: uploadsDir
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