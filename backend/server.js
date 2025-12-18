const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/database');
const errorHandler = require('./src/middleware/errorHandler');
const path = require('path');
const fs = require('fs'); // Add this line

// Load env vars FIRST
dotenv.config();

// Initialize express app
const app = express();

// ✅ FIX: Create uploads directory if it doesn't exist
const uploadsPath = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log('✅ Created uploads directory:', uploadsPath);
}

// ✅ FIXED CORS Configuration - Allow multiple origins
app.use(cors({
  origin: function (origin, callback) {
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'https://my-site-backend-0661.onrender.com'
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CRITICAL FIX: Static files MUST be before API routes
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'), {
  setHeaders: function(res, path) {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Request logging middleware (Development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`📍 ${req.method} ${req.path}`);
    next();
  });
}

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
  res.status(404).json({
    success: false,
    message: `🔍 Route not found: ${req.originalUrl}`
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
      console.log(`📁 Uploads: http://localhost:${PORT}/uploads/`);
      console.log(`📂 Uploads Directory: ${uploadsPath}`);
      console.log(`✨ ==============================================\n`);
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
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  process.exit(1);
});