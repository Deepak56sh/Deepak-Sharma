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

const upload = require('../middleware/upload');

router.get('/public/:slug', getPublicPageBySlug);

// ---- ADMIN ----
router.get('/', getAllPages);
router.get('/:id', getPageById);
router.post('/', createPage);
router.put('/:id', updatePage);
router.patch('/:id/status', togglePageStatus);
router.delete('/:id', deletePage);

router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Koi file nahi mili' });
  }
  res.status(200).json({
    success: true,
    url: req.file.path, 
    publicId: req.file.filename,
  });
});

module.exports = router;