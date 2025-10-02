const express = require('express');
const router = express.Router();
const {
    getMenu,
    getAllMenu,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    reorderMenu
} = require('../controllers/menuController');
const { protect } = require('../middleware/auth');

// Public route - for frontend to fetch active menu
router.get('/', getMenu);

// Protected routes - for admin panel
router.get('/all', protect, getAllMenu);
router.post('/', protect, createMenuItem);
router.put('/:id', protect, updateMenuItem);
router.delete('/:id', protect, deleteMenuItem);
router.put('/reorder', protect, reorderMenu);

module.exports = router;