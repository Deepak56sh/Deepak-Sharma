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

// ✅ Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory:', uploadsDir);
}

// ✅ FIXED CORS Configuration
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://my-site-backend-0661.onrender.com',
      process.env.FRONTEND_URL
    ].filter(Boolean); // Remove undefined values
    
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      callback(null, true); // Allow anyway during development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CRITICAL: Serve static files BEFORE API routes
// This must come before app.use('/api/...')
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads'), {
  setHeaders: function(res, filePath) {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', '*');
    console.log('📂 Serving file:', path.basename(filePath));
  }
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📍 ${req.method} ${req.path}`);
  next();
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    status: 'OK', 
    message: '🚀 NexGen Backend API is running perfectly!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: '✅ Backend is connected successfully!',
    data: {
      server: 'Express.js',
      database: 'MongoDB Atlas',
      status: 'Active'
    }
  });
});

// ✅ Test uploads directory
app.get('/api/test-uploads', (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    res.json({
      success: true,
      uploadsDir: uploadsDir,
      exists: fs.existsSync(uploadsDir),
      files: files,
      count: files.length,
      sampleUrl: files.length > 0 ? `/uploads/${files[0]}` : null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ✅ API Routes - These come AFTER static file serving
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/menu', require('./src/routes/menuRoutes'));
app.use('/api/footer', require('./src/routes/footerRoutes'));
app.use('/api/services', require('./src/routes/serviceRoutes'));
app.use('/api/about', require('./src/routes/aboutRoutes'));
app.use('/api/hero', require('./src/routes/heroRoutes'));
app.use('/api/contact', require('./src/routes/contactRoutes'));
app.use('/api/settings', require('./src/routes/settingsRoutes'));

// 404 handler - Must be AFTER all routes
app.use('*', (req, res) => {
  console.log('🔍 Route not found:', req.originalUrl);
  res.status(404).json({
    success: false,
    message: `🔍 Route not found: ${req.originalUrl}`
  });
});

// Error handling middleware - Must be LAST
app.use(errorHandler);

// Connect to database and start server
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`\n✨ ${'='.repeat(60)}`);
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API URL: http://localhost:${PORT}/api`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
      console.log(`💾 Database: MongoDB Atlas Connected`);
      console.log(`📁 Uploads Dir: ${uploadsDir}`);
      console.log(`📁 Uploads URL: http://localhost:${PORT}/uploads/`);
      console.log(`🧪 Test uploads: http://localhost:${PORT}/api/test-uploads`);
      console.log(`✨ ${'='.repeat(60)}\n`);
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
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  console.error(err.stack);
  process.exit(1);
});