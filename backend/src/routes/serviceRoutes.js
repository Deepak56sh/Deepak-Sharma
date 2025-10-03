// ============================================
// FILE: routes/serviceRoutes.js
// ============================================
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
router.use(protect); // Apply authentication to all routes below
router.use(authorize('admin', 'superadmin')); // Only admin and superadmin can access

router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);
router.patch('/:id/toggle', toggleServiceStatus);
router.put('/reorder/all', reorderServices);
router.get('/stats/all', getServiceStats);

module.exports = router;