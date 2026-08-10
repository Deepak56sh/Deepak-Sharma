const express = require('express');
const router = express.Router();
const upload = require("../middleware/upload");
const {
  getPlants,
  getPlant,
  createPlant,
  updatePlant,
  deletePlant,
  uploadPlantImage,
  uploadPlantGalleryImages
} = require('../controllers/plantController');
const { protect } = require('../middleware/auth');

// Public list
router.get('/', getPlants);

// Uploads MUST be before /:idOrSlug
router.post(
  "/upload-image",
  protect,
  upload.single("image"),
  uploadPlantImage
);

router.post(
  "/upload-gallery-images",
  protect,
  upload.array("images", 6), // ✅ up to 6 gallery/slider images
  uploadPlantGalleryImages
);

// Admin CRUD
router.post('/', protect, createPlant);
router.put('/:id', protect, updatePlant);
router.delete('/:id', protect, deletePlant);

// Public single (id or slug) — last
router.get('/:idOrSlug', getPlant);

module.exports = router;