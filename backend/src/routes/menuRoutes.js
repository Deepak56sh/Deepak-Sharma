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

// ✅ /reorder pehle — warna /:id match kar leta hai
router.put('/reorder', protect, reorderMenu);
router.put('/:id', protect, updateMenuItem);
router.delete('/:id', protect, deleteMenuItem);

// ============ HEADER ROUTES ============
router.get('/header', getHeader);

// ✅ FIX: multer error aaye toh bhi aage badho — JSON request bhi handle hogi
router.put('/header', protect, (req, res, next) => {
    upload.single('logoImage')(req, res, (err) => {
        if (err) {
            console.error('Multer error (ignored):', err.message);
        }
        next(); // error ho ya na ho — aage badho
    });
}, updateHeader);

router.delete('/header/logo', protect, deleteLogo);

module.exports = router;