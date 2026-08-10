const express = require('express');
const router = express.Router();
const {
  getAllServices,
  getService,
  createService,
  updateService,
  deleteService,
  toggleServiceStatus
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload'); // Cloudinary multer

// Public
router.get('/', getAllServices);
router.get('/:id', getService);

// Admin
router.use(protect);
router.use(authorize('admin', 'super-admin'));

router.post('/', upload.single('image'), createService);
router.put('/:id', upload.single('image'), updateService);
router.delete('/:id', deleteService);
router.patch('/:id/toggle', toggleServiceStatus);

module.exports = router;