const express = require('express');
const router = express.Router();
const {
  getPlants,
  getPlant,
  createPlant,
  updatePlant,
  deletePlant,
  uploadPlantImage
} = require('../controllers/plantController');
const { protect } = require('../middleware/auth');

// Public list
router.get('/', getPlants);

// Upload MUST be before /:idOrSlug
router.post('/upload-image', protect, uploadPlantImage);

// Admin CRUD
router.post('/', protect, createPlant);
router.put('/:id', protect, updatePlant);
router.delete('/:id', protect, deletePlant);

// Public single (id or slug) — last
router.get('/:idOrSlug', getPlant);

module.exports = router;