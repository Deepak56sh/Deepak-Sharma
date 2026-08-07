const express = require('express');
const router = express.Router();
const {
  getAllServices,
  getService,
  createService,
  updateService,
  deleteService,
  toggleServiceStatus,
  reorderServices,
  getServiceStats
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload'); // ← your Cloudinary multer

// Public
router.get('/', getAllServices);
router.get('/:id', getService);

// Admin
router.use(protect);
router.use(authorize('admin', 'super-admin'));

router.post('/', upload.single('image'), createService);          // ← Cloudinary
router.put('/:id', upload.single('image'), updateService);       // ← Cloudinary
router.delete('/:id', deleteService);
router.patch('/:id/toggle', toggleServiceStatus);
router.put('/reorder', reorderServices);
router.get('/stats/all', getServiceStats);

module.exports = router;