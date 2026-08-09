const express = require('express');
const router = express.Router();
const {
    getMenu, getAllMenu, createMenuItem, updateMenuItem,
    deleteMenuItem, reorderMenu
} = require('../controllers/menuController');
const { protect } = require('../middleware/auth');

router.get('/', getMenu);
router.get('/all', protect, getAllMenu);
router.post('/', protect, createMenuItem);
router.put('/reorder', protect, reorderMenu);
router.put('/:id', protect, updateMenuItem);
router.delete('/:id', protect, deleteMenuItem);

module.exports = router;