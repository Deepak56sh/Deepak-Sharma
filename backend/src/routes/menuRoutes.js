const express = require('express');
const router = express.Router();
const {
    getMenu, getAllMenu, createMenuItem, updateMenuItem,
    deleteMenuItem, reorderMenu, getHeader, updateHeader, deleteLogo
} = require('../controllers/menuController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// ============ MENU ROUTES ============
router.get('/', getMenu);
router.get('/all', protect, getAllMenu);
router.post('/', protect, createMenuItem);

// ✅ /reorder pehle aana chahiye /:id se — warna /:id match kar leta hai
router.put('/reorder', protect, reorderMenu);
router.put('/:id', protect, updateMenuItem);
router.delete('/:id', protect, deleteMenuItem);

// ============ HEADER ROUTES ============
// ✅ Ye routes /menu/header pe hain — frontend API_URL fix karna hoga
router.get('/header', getHeader);
router.put('/header', protect, upload.single('logoImage'), updateHeader);
router.delete('/header/logo', protect, deleteLogo);

module.exports = router;