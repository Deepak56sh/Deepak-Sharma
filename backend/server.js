// ============================================
// FILE: nexgen-backend/server.js (CommonJS Version)
// ============================================

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db.js');
const errorHandler = require('./src/middleware/errorHandler.js');

// Import routes
const authRoutes = require('./src/routes/authRoutes.js');
// const serviceRoutes = require('./src/routes/serviceRoutes.js');
// const heroRoutes = require('./src/routes/heroRoutes.js');
// const aboutRoutes = require('./src/routes/aboutRoutes.js');
// const contactRoutes = require('./src/routes/contactRoutes.js');
// const settingsRoutes = require('./src/routes/settingsRoutes.js');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
// app.use('/api/services', serviceRoutes);
// app.use('/api/hero', heroRoutes);
// app.use('/api/about', aboutRoutes);
// app.use('/api/contact', contactRoutes);
// app.use('/api/settings', settingsRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'NexGen Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
