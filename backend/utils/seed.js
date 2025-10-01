// ============================================
// FILE: nexgen-backend/src/utils/seed.js
// ============================================
// Use this to create first admin user
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();
connectDB();

const seedAdmin = async () => {
  try {
    // Delete existing admin
    await User.deleteMany({ email: 'admin@nexgen.com' });

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@nexgen.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('✅ Admin user created successfully');
    console.log('Email: admin@nexgen.com');
    console.log('Password: admin123');
    console.log('CHANGE THIS PASSWORD IN PRODUCTION!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();