const Menu = require('../models/Menu');

// GET /api/menu — public, sirf active items
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

// GET /api/menu/all — admin, sab items
const getAllMenu = async (req, res) => {
    try {
        const menu = await Menu.find()
            .sort({ order: 1, createdAt: 1 })
            .select('-__v');
        res.json({ success: true, data: menu });
    } catch (error) {
        console.error('Get all menu error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// POST /api/menu — naya menu item banao
const createMenuItem = async (req, res) => {
    try {
        const { name, path, type, url, order, icon } = req.body;
        const itemType = type || 'internal';

        // Validation
        if (!name || !name.trim()) {
            return res.status(400).json({ success: false, message: 'Name is required' });
        }
        if (itemType === 'internal' && (!path || !path.trim())) {
            return res.status(400).json({ success: false, message: 'Path is required for internal links' });
        }
        if (itemType === 'external' && (!url || !url.trim())) {
            return res.status(400).json({ success: false, message: 'URL is required for external links' });
        }

        // Duplicate check
        const existingMenu = await Menu.findOne({ name: name.trim() });
        if (existingMenu) {
            return res.status(400).json({ success: false, message: 'Menu item with this name already exists' });
        }

        const menuItem = await Menu.create({
            name: name.trim(),
            path: itemType === 'internal' ? path.trim() : '',
            type: itemType,
            url: itemType === 'external' ? url.trim() : '',
            order: order || 0,
            icon: icon ? icon.trim() : ''
        });

        res.status(201).json({ success: true, message: 'Menu item created successfully', data: menuItem });

    } catch (error) {
        console.error('Create menu error:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: 'Server error while creating menu item', error: error.message });
    }
};

// PUT /api/menu/:id — update
const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, path, type, url, order, isActive, icon } = req.body;

        const menuItem = await Menu.findById(id);
        if (!menuItem) {
            return res.status(404).json({ success: false, message: 'Menu item not found' });
        }

        const newType = type || menuItem.type;

        // Sirf isActive toggle ho raha hai toh duplicate check skip karo
        const onlyStatusUpdate = isActive !== undefined &&
            !name && path === undefined && !type && url === undefined &&
            order === undefined && icon === undefined;

        if (!onlyStatusUpdate && name) {
            const existingMenu = await Menu.findOne({ _id: { $ne: id }, name: name.trim() });
            if (existingMenu) {
                return res.status(400).json({ success: false, message: 'Menu item with this name already exists' });
            }
        }

        // Fields update karo
        if (name !== undefined) menuItem.name = name.trim();
        if (type !== undefined) menuItem.type = type;
        if (order !== undefined) menuItem.order = order;
        if (isActive !== undefined) menuItem.isActive = isActive;
        if (icon !== undefined) menuItem.icon = icon.trim();

        if (newType === 'internal') {
            if (path !== undefined) menuItem.path = path.trim();
            menuItem.url = '';
        } else {
            if (url !== undefined) menuItem.url = url.trim();
            menuItem.path = '';
        }

        await menuItem.save();
        res.json({ success: true, message: 'Menu item updated successfully', data: menuItem });

    } catch (error) {
        console.error('Update menu error:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: 'Server error while updating menu item', error: error.message });
    }
};

// DELETE /api/menu/:id
const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const menuItem = await Menu.findById(id);
        if (!menuItem) {
            return res.status(404).json({ success: false, message: 'Menu item not found' });
        }
        await Menu.findByIdAndDelete(id);
        res.json({ success: true, message: 'Menu item deleted successfully' });
    } catch (error) {
        console.error('Delete menu error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// PUT /api/menu/reorder
const reorderMenu = async (req, res) => {
    try {
        const { menuOrder } = req.body;
        if (!Array.isArray(menuOrder)) {
            return res.status(400).json({ success: false, message: 'Menu order must be an array' });
        }
        const bulkOperations = menuOrder.map(item => ({
            updateOne: { filter: { _id: item.id }, update: { order: item.order } }
        }));
        await Menu.bulkWrite(bulkOperations);
        res.json({ success: true, message: 'Menu order updated successfully' });
    } catch (error) {
        console.error('Reorder menu error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { getMenu, getAllMenu, createMenuItem, updateMenuItem, deleteMenuItem, reorderMenu };