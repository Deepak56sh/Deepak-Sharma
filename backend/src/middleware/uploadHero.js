const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith('video/');
    return {
      folder: 'nexgen/hero',
      resource_type: isVideo ? 'video' : 'image', 
      allowed_formats: isVideo
        ? ['mp4', 'mov', 'webm', 'avi', 'mkv']
        : ['jpg', 'jpeg', 'png', 'webp'],
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    };
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image or video files are allowed'), false);
  }
};

const uploadHero = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, 
  },
});

module.exports = uploadHero;