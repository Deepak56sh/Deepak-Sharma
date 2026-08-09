const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/database');
const errorHandler = require('./src/middleware/errorHandler');
const path = require('path');
const fs = require('fs');

// Load env vars FIRST
dotenv.config();

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const allowedOrigins = ['http://localhost:3000', 'https://deepakch.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Content-Disposition']
}));

const isRender = process.env.RENDER_EXTERNAL_URL || process.env.NODE_ENV === 'production';

console.log('🚀 Environment:', process.env.NODE_ENV);
console.log('🌍 Is Render?', isRender);

let uploadsPath;
if (isRender) {
  uploadsPath = '/tmp/uploads';
  console.log('📁 Using Render.com path:', uploadsPath);
} else {
  uploadsPath = path.join(__dirname, 'public', 'uploads');
  console.log('📁 Using local path:', uploadsPath);
}

const createUploadsDirectory = () => {
  try {
    if (!fs.existsSync(uploadsPath)) {
      fs.mkdirSync(uploadsPath, { recursive: true, mode: 0o755 });
      console.log('✅ Created uploads directory:', uploadsPath);
    }
    const testFile = path.join(uploadsPath, 'test.txt');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    console.log('✅ Directory is writable');
    return uploadsPath;
  } catch (error) {
    console.error('❌ Directory creation error:', error.message);
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

app.use('/uploads', express.static(actualUploadsPath, {
  setHeaders: (res, filePath) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Cache-Control', 'public, max-age=86400');
  }
}));

app.get('/uploads/*', (req, res, next) => {
  const filePath = path.join(actualUploadsPath, req.params[0]);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    next();
  }
});

app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.originalUrl}`);
  next();
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    message: '🚀 API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    isRender: isRender,
    uploadsPath: actualUploadsPath
  });
});

app.get('/api/debug/uploads', (req, res) => {
  try {
    const files = fs.existsSync(actualUploadsPath) ? fs.readdirSync(actualUploadsPath) : [];
    const stats = fs.statSync(actualUploadsPath);
    res.json({
      success: true,
      uploadsPath: actualUploadsPath,
      files,
      fileCount: files.length,
      directoryExists: fs.existsSync(actualUploadsPath),
      isRender
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ API ROUTES ============
app.use('/api/auth', require('./src/routes/authRoutes'));

// ✅ FIX: /api/header HATA DIYA — wo /:id se clash karta tha
// Header routes ab /api/menu/header pe hain — menuRoutes ke andar defined hain
app.use('/api/menu', require('./src/routes/menuRoutes'));

app.use('/api/footer', require('./src/routes/footerRoutes'));
app.use('/api/services', require('./src/routes/serviceRoutes'));
app.use('/api/about', require('./src/routes/aboutRoutes'));
app.use('/api/hero', require('./src/routes/heroRoutes'));
app.use('/api/contact', require('./src/routes/contactRoutes'));
app.use('/api/settings', require('./src/routes/settingsRoutes'));
app.use('/api/plants', require('./src/routes/plantRoutes'));
app.use('/api/products', require('./src/routes/plantRoutes'));
app.use('/api/customers', require('./src/routes/Customerroutes'));
app.use('/api/instagram', require('./src/routes/instagramRoutes'));
app.use('/api/testimonials', require('./src/routes/testimonialRoutes'));

// 404 handler
app.use('*', (req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n✨ ==============================================`);
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📁 Uploads Path: ${actualUploadsPath}`);
      console.log(`✨ ==============================================\n`);

      const testFile = path.join(actualUploadsPath, 'server-start.txt');
      fs.writeFileSync(testFile, `Server started at: ${new Date().toISOString()}`);
    });
  })
  .catch((error) => {
    console.error('❌ Failed to connect to database:', error.message);
    process.exit(1);
  });

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
});