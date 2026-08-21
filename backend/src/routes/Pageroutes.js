const express = require('express');
const router = express.Router();
const {
  getAllPages,
  getPageById,
  getPublicPageBySlug,
  createPage,
  updatePage,
  togglePageStatus,
  deletePage,
} = require('../controllers/Pagecontroller');

// TODO: agar aapke project mein admin-auth middleware hai (jaise `protect, isAdmin`)
// to admin wale routes pe use zaroor lagayein, example:
// const { protect, isAdmin } = require('../middleware/authMiddleware');
// router.post('/', protect, isAdmin, createPage);

// ---- PUBLIC (live site render karne ke liye) ----
router.get('/public/:slug', getPublicPageBySlug);

// ---- ADMIN ----
router.get('/', getAllPages);
router.get('/:id', getPageById);
router.post('/', createPage);
router.put('/:id', updatePage);
router.patch('/:id/status', togglePageStatus);
router.delete('/:id', deletePage);

module.exports = router;