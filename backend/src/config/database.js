const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`✅ MongoDB Connected Successfully!`);
        console.log(`📊 Host: ${conn.connection.host}`);
        console.log(`🗄️  Database: ${conn.connection.name}`);
        
        // Create default admin if not exists
        await createDefaultAdmin();
        
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        console.log('💡 Please check your MONGODB_URI in .env file');
        process.exit(1);
    }
};

// Create default admin account
const createDefaultAdmin = async () => {
    try {
        const Admin = require('../models/Admin');
        const defaultAdmin = await Admin.findOne({ email: 'admin@nexgen.com' });
        
        if (!defaultAdmin) {
            await Admin.create({
                name: 'Super Admin',
                email: 'admin@nexgen.com',
                password: 'admin123',
                role: 'super-admin'
            });
            console.log('✅ Default admin created: admin@nexgen.com / admin123');
        } else {
            console.log('✅ Default admin already exists');
        }
    } catch (error) {
        console.error('❌ Error creating default admin:', error.message);
    }
};

// MongoDB connection events
mongoose.connection.on('connected', () => {
    console.log('🔗 Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('🔌 Mongoose disconnected');
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('❌ MongoDB connection closed due to app termination');
    process.exit(0);
});

module.exports = connectDB;