const express = require('express');
const router = express.Router();
const {
    getMenu, getAllMenu, createMenuItem, updateMenuItem,
    deleteMenuItem, reorderMenu
} = require('../controllers/menuController');
const { protect } = require('../middleware/auth');

<<<<<<< HEAD

router.get('/', getMenu);


router.get('/all', protect, getAllMenu);
router.post('/', protect, createMenuItem);

=======
router.get('/', getMenu);
router.get('/all', protect, getAllMenu);
router.post('/', protect, createMenuItem);
>>>>>>> 68a2c39c1320bed1847393443db3a0a7003fe7c6
router.put('/reorder', protect, reorderMenu);
router.put('/:id', protect, updateMenuItem);
router.delete('/:id', protect, deleteMenuItem);

module.exports = router;