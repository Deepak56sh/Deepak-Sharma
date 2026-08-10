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

// Public
router.get('/', getMenu);

// Protected
router.get('/all', protect, getAllMenu);
router.post('/', protect, createMenuItem);

// ✅ /reorder PEHLE hona chahiye — warna /:id match kar leta hai "reorder" string ko
router.put('/reorder', protect, reorderMenu);
router.put('/:id', protect, updateMenuItem);
router.delete('/:id', protect, deleteMenuItem);

module.exports = router;