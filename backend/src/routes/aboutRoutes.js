// routes/aboutRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAbout,
  updateAbout,
  addStat,
  deleteStat,
  addValue,
  deleteValue,
  addAdditionalImage,
  deleteAdditionalImage
} = require('../controllers/aboutController');

const { uploadMiddleware, uploadImage, deleteImage } = require('../controllers/uploadController');

// Public routes
router.get('/', getAbout);

// Admin routes
router.put('/', updateAbout);
router.post('/additional-images', addAdditionalImage);
router.delete('/additional-images/:index', deleteAdditionalImage);

// Image upload routes
router.post('/upload', uploadMiddleware, uploadImage);
router.delete('/upload/:filename', deleteImage);

// Stats and values routes
router.post('/stats', addStat);
router.delete('/stats/:id', deleteStat);
router.post('/values', addValue);
router.delete('/values/:id', deleteValue);

module.exports = router;