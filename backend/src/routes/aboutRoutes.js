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
  deleteValue,
  addAdditionalImage,
  deleteAdditionalImage
} = require('../controllers/aboutController');

const { protect, authorize } = require('../middleware/auth');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'about-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
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

// Public routes
router.get('/', getAbout);

// Protected Admin routes
router.use(protect);
router.use(authorize('admin', 'super-admin'));

// Main update route
router.put('/', updateAbout);

// Image upload route - Fixed upload.single usage
router.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Return the image URL that can be used in the frontend
    const imageUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        imageUrl: imageUrl,
        filename: req.file.filename
      }
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Image upload failed',
      error: error.message
    });
  }
});

// Additional images routes
router.post('/additional-images', addAdditionalImage);
router.delete('/additional-images/:index', deleteAdditionalImage);

// Stats routes
router.post('/stats', addStat);
router.delete('/stats/:id', deleteStat);

// Values routes
router.post('/values', addValue);
router.delete('/values/:id', deleteValue);

module.exports = router;