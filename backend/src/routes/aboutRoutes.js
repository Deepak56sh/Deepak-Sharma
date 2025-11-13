const express = require('express');
const router = express.Router();
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
const upload = require('../utils/multerConfig'); // Make sure you have this

// Public routes
router.get('/', getAbout);

// Admin routes - Protected
router.use(protect);
router.use(authorize('admin', 'super-admin'));

// Main update route
router.put('/', updateAbout);

// Image upload route
router.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        imageUrl: imageUrl
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Image upload failed'
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