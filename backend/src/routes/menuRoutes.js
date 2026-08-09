// routes/menuRoutes.js
const express = require('express');
const router = express.Router();
const {
    // Menu Functions
    getMenu,
    getAllMenu,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    reorderMenu,
    // Header Functions (Naye - Logo + Top Bar)
    getHeader,
    updateHeader,
    deleteLogo
} = require('../controllers/menuController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// ============================================
// ===== MENU ROUTES (Pehle jese) =====
// ============================================

// Public route - for frontend to fetch active menu
router.get('/', getMenu);

// Protected routes - for admin panel
router.get('/all', protect, getAllMenu);
router.post('/', protect, createMenuItem);
router.put('/:id', protect, updateMenuItem);
router.delete('/:id', protect, deleteMenuItem);
router.put('/reorder', protect, reorderMenu);

// ============================================
// ===== HEADER ROUTES (Naye - Logo + Top Bar) =====
// ============================================

// Public route - get header data
router.get('/header', getHeader);

// Protected routes - admin only
router.put('/header', protect, upload.single('logoImage'), updateHeader);
router.delete('/header/logo', protect, deleteLogo);

module.exports = router;