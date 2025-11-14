const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create upload directories if they don't exist
const createUploadDirs = () => {
  const directories = [
    path.join(__dirname, '../public/uploads/profiles'),
    path.join(__dirname, '../public/uploads/services'),
    path.join(__dirname, '../public/uploads/about')
  ];

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created upload directory: ${dir}`);
    }
  });
};

// Call this function to create directories
createUploadDirs();

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'public/uploads/';
    
    // Determine upload directory based on route
    if (req.originalUrl.includes('/auth/upload-profile-picture')) {
      uploadPath += 'profiles/';
    } else if (req.originalUrl.includes('/about/upload')) {
      uploadPath += 'about/';
    } else if (req.originalUrl.includes('/services/upload')) {
      uploadPath += 'services/';
    } else {
      uploadPath += 'general/';
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const cleanName = file.originalname.replace(fileExtension, '').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const fileName = `${cleanName}-${uniqueSuffix}${fileExtension}`;
    
    cb(null, fileName);
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter
});

// Error handling middleware
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }
  } else if (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  next();
};

module.exports = {
  upload,
  handleMulterError
};