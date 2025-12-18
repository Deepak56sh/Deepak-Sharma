const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/database');
const errorHandler = require('./src/middleware/errorHandler');
const path = require('path');
const fs = require('fs');

// Load env vars FIRST
dotenv.config();

// Initialize express app
const app = express();

// ✅ FIX: Detect Render.com properly
const isRender = process.env.RENDER_EXTERNAL_URL || process.env.NODE_ENV === 'production';

console.log('🚀 Environment:', process.env.NODE_ENV);
console.log('🌍 Is Render?', isRender);

// ✅ FIX: Single uploads path for both environments
let uploadsPath;

if (isRender) {
  // Render.com: Use /tmp/uploads
  uploadsPath = '/tmp/uploads';
  console.log('📁 Using Render.com path:', uploadsPath);
} else {
  // Local: Use public/uploads
  uploadsPath = path.join(__dirname, 'public', 'uploads');
  console.log('📁 Using local path:', uploadsPath);
}

// ✅ FIX: Create directory with proper error handling
const createUploadsDirectory = () => {
  try {
    if (!fs.existsSync(uploadsPath)) {
      fs.mkdirSync(uploadsPath, { recursive: true, mode: 0o755 });
      console.log('✅ Created uploads directory:', uploadsPath);
    }
    
    // Test write permission
    const testFile = path.join(uploadsPath, 'test.txt');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    console.log('✅ Directory is writable');
    
    return uploadsPath;
  } catch (error) {
    console.error('❌ Directory creation error:', error.message);
    
    // Fallback for Render.com
    if (isRender) {
      const fallbackPath = path.join(__dirname, 'temp_uploads');
      if (!fs.existsSync(fallbackPath)) {
        fs.mkdirSync(fallbackPath, { recursive: true });
      }
      console.log('⚠️ Using fallback directory:', fallbackPath);
      return fallbackPath;
    }
    
    throw error;
  }
};

const actualUploadsPath = createUploadsDirectory();

// ✅ FIX: Increase payload size limit (ADD THIS AT THE TOP - BEFORE CORS)
app.use(express.json({ limit: '50mb' })); // 50MB limit for JSON
app.use(express.urlencoded({ 
  extended: true, 
  limit: '50mb'  // 50MB limit for URL-encoded
}));

// ✅ FIX: Simple CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'https://my-site-backend-0661.onrender.com'],
  credentials: true
}));

// ✅ CRITICAL FIX: Static file serving - SIMPLE AND CLEAN
app.use('/uploads', express.static(actualUploadsPath, {
  setHeaders: (res, filePath) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Cache-Control', 'public, max-age=86400');
  }
}));

// ✅ FIX: Add fallback static route for any /uploads/... request
app.get('/uploads/*', (req, res, next) => {
  const filePath = path.join(actualUploadsPath, req.params[0]);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    next(); // Pass to 404 handler
  }
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.originalUrl}`);
  if (req.originalUrl.startsWith('/uploads')) {
    console.log('📁 Static file request');
  }
  next();
});

// ✅ FIX: Improved debug route
app.get('/api/debug/uploads', (req, res) => {
  try {
    const files = fs.existsSync(actualUploadsPath) ? 
      fs.readdirSync(actualUploadsPath) : [];
    
    // Get directory info
    const stats = fs.statSync(actualUploadsPath);
    
    res.json({
      success: true,
      environment: process.env.NODE_ENV || 'development',
      isRender: isRender,
      uploadsPath: actualUploadsPath,
      files: files,
      fileCount: files.length,
      directoryExists: fs.existsSync(actualUploadsPath),
      writable: true, // Already tested
      directoryStats: {
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime
      },
      env: {
        NODE_ENV: process.env.NODE_ENV,
        RENDER: process.env.RENDER,
        RENDER_EXTERNAL_URL: process.env.RENDER_EXTERNAL_URL
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      uploadsPath: actualUploadsPath,
      isRender: isRender
    });
  }
});

// ✅ FIX: Simple test route
app.get('/api/test-static', (req, res) => {
  try {
    const testContent = `Test created: ${new Date().toISOString()}\nEnvironment: ${process.env.NODE_ENV}\nIs Render: ${isRender}`;
    const testFile = path.join(actualUploadsPath, 'test.txt');
    
    fs.writeFileSync(testFile, testContent);
    const content = fs.readFileSync(testFile, 'utf8');
    
    res.json({
      success: true,
      message: 'Static file test successful',
      path: actualUploadsPath,
      fileContent: content,
      fileExists: fs.existsSync(testFile),
      isRender: isRender
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      path: actualUploadsPath
    });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    status: 'OK', 
    message: '🚀 API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    isRender: isRender,
    uploadsPath: actualUploadsPath,
    endpoints: {
      uploads: '/uploads/',
      debug: '/api/debug/uploads',
      test: '/api/test-static'
    }
  });
});

// API Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/menu', require('./src/routes/menuRoutes'));
app.use('/api/footer', require('./src/routes/footerRoutes'));
app.use('/api/services', require('./src/routes/serviceRoutes'));
app.use('/api/about', require('./src/routes/aboutRoutes'));
app.use('/api/hero', require('./src/routes/heroRoutes'));
app.use('/api/contact', require('./src/routes/contactRoutes'));
app.use('/api/settings', require('./src/routes/settingsRoutes'));

// 404 handler
app.use('*', (req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `🔍 Route not found: ${req.originalUrl}`,
    suggested: {
      api: '/api/health',
      uploads: '/uploads/',
      debug: '/api/debug/uploads'
    }
  });
});

// Error handling middleware
app.use(errorHandler);

// Connect to database and start server
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`\n✨ ==============================================`);
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API URL: http://localhost:${PORT}/api`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
      console.log(`💾 Database: MongoDB Atlas Connected`);
      console.log(`📁 Uploads URL: http://localhost:${PORT}/uploads/`);
      console.log(`📂 Uploads Path: ${actualUploadsPath}`);
      console.log(`🚀 Running on Render.com: ${isRender}`);
      console.log(`✨ ==============================================\n`);
      
      // Create a test file to verify
      const testFile = path.join(actualUploadsPath, 'server-start.txt');
      fs.writeFileSync(testFile, `Server started at: ${new Date().toISOString()}\nPath: ${actualUploadsPath}`);
    });

    return server;
  })
  .catch((error) => {
    console.error('❌ Failed to connect to database:', error.message);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  console.error(err.stack);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  console.error(err.stack);
});