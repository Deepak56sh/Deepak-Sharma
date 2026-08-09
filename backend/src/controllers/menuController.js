// controllers/menuController.js
const { Menu, Header } = require('../models/Menu');
const cloudinary = require('../config/cloudinary');

// ============================================
// ===== MENU FUNCTIONS =====
// ============================================

const getMenu = async (req, res) => {
    try {
        const menu = await Menu.find({ isActive: true })
            .sort({ order: 1, createdAt: 1 })
            .select('-__v');
        res.json({ success: true, data: menu });
    } catch (error) {
        console.error('Get menu error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getAllMenu = async (req, res) => {
    try {
        const menu = await Menu.find().sort({ order: 1, createdAt: 1 });
        res.json({ success: true, data: menu });
    } catch (error) {
        console.error('Get all menu error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const createMenuItem = async (req, res) => {
    try {
        console.log('📝 Creating menu item:', req.body);
        
        const { name, path, type, url, order, icon } = req.body;

        // ✅ Validation
        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Name is required'
            });
        }

        if (!path || !path.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Path is required'
            });
        }

        // ✅ Check duplicate
        const existingMenu = await Menu.findOne({ 
            $or: [
                { name: name.trim() },
                { path: path.trim() }
            ]
        });

        if (existingMenu) {
            return res.status(400).json({
                success: false,
                message: 'Menu item with this name or path already exists'
            });
        }

        const menuItem = await Menu.create({
            name: name.trim(),
            path: path.trim(),
            type: type || 'internal',
            url: url ? url.trim() : '',
            order: order || 0,
            icon: icon ? icon.trim() : ''
        });

        console.log('✅ Menu created:', menuItem);

        res.status(201).json({
            success: true,
            message: 'Menu item created successfully',
            data: menuItem
        });

    } catch (error) {
        console.error('❌ Create menu error:', error);
        console.error('❌ Stack:', error.stack);
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while creating menu item',
            error: error.message
        });
    }
};

const updateMenuItem = async (req, res) => {
    try {
        console.log('📝 Updating menu item:', req.params.id, req.body);
        
        const { id } = req.params;
        const { name, path, type, url, order, isActive, icon } = req.body;

        const menuItem = await Menu.findById(id);
        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        // ✅ Check duplicate
        if (name || path) {
            const existingMenu = await Menu.findOne({
                _id: { $ne: id },
                $or: [
                    { name: name?.trim() || menuItem.name },
                    { path: path?.trim() || menuItem.path }
                ]
            });

            if (existingMenu) {
                return res.status(400).json({
                    success: false,
                    message: 'Menu item with this name or path already exists'
                });
            }
        }

        if (name) menuItem.name = name.trim();
        if (path) menuItem.path = path.trim();
        if (type) menuItem.type = type;
        if (url) menuItem.url = url.trim();
        if (order !== undefined) menuItem.order = order;
        if (isActive !== undefined) menuItem.isActive = isActive;
        if (icon) menuItem.icon = icon.trim();

        await menuItem.save();

        console.log('✅ Menu updated:', menuItem);

        res.json({
            success: true,
            message: 'Menu item updated successfully',
            data: menuItem
        });

    } catch (error) {
        console.error('❌ Update menu error:', error);
        console.error('❌ Stack:', error.stack);
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while updating menu item',
            error: error.message
        });
    }
};

const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        await Menu.findByIdAndDelete(id);
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        console.error('Delete menu error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const reorderMenu = async (req, res) => {
    try {
        const { menuOrder } = req.body;
        if (!Array.isArray(menuOrder)) {
            return res.status(400).json({
                success: false,
                message: 'Menu order must be an array'
            });
        }

        const bulkOperations = menuOrder.map(item => ({
            updateOne: {
                filter: { _id: item.id },
                update: { order: item.order }
            }
        }));

        await Menu.bulkWrite(bulkOperations);
        res.json({ success: true, message: 'Reordered successfully' });

    } catch (error) {
        console.error('Reorder menu error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ============================================
// ===== HEADER FUNCTIONS =====
// ============================================

const getHeader = async (req, res) => {
    try {
        let header = await Header.findOne();
        if (!header) {
            header = await Header.create({
                logoText: 'Plantora',
                logoImage: '',
                topBarText: 'Free Shipping on orders above ₹999'
            });
        }
        res.json({ success: true, data: header });
    } catch (error) {
        console.error('Get header error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const updateHeader = async (req, res) => {
    try {
        console.log('📝 Updating header:', req.body);
        console.log('📎 File:', req.file);
        
        const { logoText, topBarText } = req.body;
        const file = req.file;

        let header = await Header.findOne();
        if (!header) {
            header = new Header();
        }

        if (logoText) header.logoText = logoText.trim();
        if (topBarText) header.topBarText = topBarText.trim();

        if (file) {
            // Cloudinary try karo, agar fail ho toh bhi save ho
            try {
                if (header.logoImagePublicId) {
                    await cloudinary.uploader.destroy(header.logoImagePublicId);
                }
                header.logoImage = file.path;
                header.logoImagePublicId = file.filename || file.public_id;
            } catch (cloudinaryError) {
                console.error('Cloudinary error:', cloudinaryError);
                // Fallback
                header.logoImage = file.path;
                header.logoImagePublicId = 'local_' + Date.now();
            }
        }

        await header.save();
        console.log('✅ Header updated:', header);

        res.json({
            success: true,
            message: 'Header updated successfully',
            data: header
        });

    } catch (error) {
        console.error('❌ Update header error:', error);
        console.error('❌ Stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Server error while updating header',
            error: error.message
        });
    }
};

const deleteLogo = async (req, res) => {
    try {
        let header = await Header.findOne();
        if (!header) {
            return res.status(404).json({
                success: false,
                message: 'Header not found'
            });
        }

        if (header.logoImagePublicId) {
            try {
                await cloudinary.uploader.destroy(header.logoImagePublicId);
            } catch (err) {
                console.error('Error deleting logo:', err);
            }
        }

        header.logoImage = '';
        header.logoImagePublicId = '';
        await header.save();

        res.json({
            success: true,
            message: 'Logo deleted successfully',
            data: header
        });

    } catch (error) {
        console.error('Delete logo error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting logo'
        });
    }
};

// ============================================
// ===== EXPORT =====
// ============================================

module.exports = {
    getMenu,
    getAllMenu,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    reorderMenu,
    getHeader,
    updateHeader,
    deleteLogo
};