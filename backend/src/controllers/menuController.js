const Menu = require('../models/Menu');

// @desc    Get all active menu items
// @route   GET /api/menu
// @access  Public
const getMenu = async (req, res) => {
    try {
        const menu = await Menu.find({ isActive: true })
            .sort({ order: 1, createdAt: 1 })
            .select('-__v');

        res.json({
            success: true,
            data: menu
        });
    } catch (error) {
        console.error('Get menu error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching menu'
        });
    }
};

// @desc    Get all menu items (for admin)
// @route   GET /api/menu/all
// @access  Private
const getAllMenu = async (req, res) => {
    try {
        const menu = await Menu.find()
            .sort({ order: 1, createdAt: 1 })
            .select('-__v');

        res.json({
            success: true,
            data: menu
        });
    } catch (error) {
        console.error('Get all menu error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching menu'
        });
    }
};

// @desc    Create new menu item
// @route   POST /api/menu
// @access  Private
const createMenuItem = async (req, res) => {
    try {
        const { name, path, type, url, order, icon } = req.body;

        // Check if menu item already exists
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
            path: path ? path.trim() : '',
            type,
            url: url ? url.trim() : '',
            order: order || 0,
            icon: icon ? icon.trim() : ''
        });

        res.status(201).json({
            success: true,
            message: 'Menu item created successfully',
            data: menuItem
        });

    } catch (error) {
        console.error('Create menu error:', error);
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while creating menu item'
        });
    }
};

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Private
const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, path, type, url, order, isActive, icon } = req.body;

        const menuItem = await Menu.findById(id);
        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        // Check for duplicate name/path excluding current item
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

        // Update fields
        if (name) menuItem.name = name.trim();
        if (path) menuItem.path = path.trim();
        if (type) menuItem.type = type;
        if (url) menuItem.url = url.trim();
        if (order !== undefined) menuItem.order = order;
        if (isActive !== undefined) menuItem.isActive = isActive;
        if (icon !== undefined) menuItem.icon = icon.trim();

        await menuItem.save();

        res.json({
            success: true,
            message: 'Menu item updated successfully',
            data: menuItem
        });

    } catch (error) {
        console.error('Update menu error:', error);
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while updating menu item'
        });
    }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Private
const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;

        const menuItem = await Menu.findById(id);
        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        await Menu.findByIdAndDelete(id);

        res.json({
            success: true,
            message: 'Menu item deleted successfully'
        });

    } catch (error) {
        console.error('Delete menu error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting menu item'
        });
    }
};

// @desc    Reorder menu items
// @route   PUT /api/menu/reorder
// @access  Private
const reorderMenu = async (req, res) => {
    try {
        const { menuOrder } = req.body; // Array of { id, order }

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

        res.json({
            success: true,
            message: 'Menu order updated successfully'
        });

    } catch (error) {
        console.error('Reorder menu error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while reordering menu'
        });
    }
};

module.exports = {
    getMenu,
    getAllMenu,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    reorderMenu
};