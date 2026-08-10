const express = require('express');
const router = express.Router();
const {
    getCategories,
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/Categorycontroller');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public
router.get('/', getCategories);

// Protected
router.get('/all', protect, getAllCategories);

router.post('/', protect, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) console.error('Upload error:', err.message);
        next();
    });
}, createCategory);

router.put('/:id', protect, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) console.error('Upload error:', err.message);
        next();
    });
}, updateCategory);

router.delete('/:id', protect, deleteCategory);

module.exports = router;