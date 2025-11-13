// routes/serviceRoutes.js
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

// Public routes
router.get('/', getAllServices);
router.get('/:id', getService);

// Admin routes - all protected
router.use(protect);

// ✅ FIX: Allow both 'admin' and 'super-admin' roles
router.use(authorize('admin', 'super-admin')); // Changed from 'superadmin' to 'super-admin'

router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);
router.patch('/:id/toggle', toggleServiceStatus);
router.put('/reorder', reorderServices);
router.get('/stats/all', getServiceStats);

module.exports = router;