// controllers/menuController.js
const { Menu } = require('../models/Menu');

<<<<<<< HEAD
// GET /api/menu — public, sirf active items
=======
>>>>>>> 68a2c39c1320bed1847393443db3a0a7003fe7c6
const getMenu = async (req, res) => {
    try {
        const menu = await Menu.find({ isActive: true })
            .sort({ order: 1, createdAt: 1 })
            .select('-__v');
        res.json({ success: true, data: menu });
    } catch (error) {
<<<<<<< HEAD
        console.error('Get menu error:', error);
=======
>>>>>>> 68a2c39c1320bed1847393443db3a0a7003fe7c6
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

<<<<<<< HEAD
// GET /api/menu/all — admin, sab items
const getAllMenu = async (req, res) => {
    try {
        const menu = await Menu.find()
            .sort({ order: 1, createdAt: 1 })
            .select('-__v');
        res.json({ success: true, data: menu });
    } catch (error) {
        console.error('Get all menu error:', error);
=======
const getAllMenu = async (req, res) => {
    try {
        const menu = await Menu.find().sort({ order: 1, createdAt: 1 });
        res.json({ success: true, data: menu });
    } catch (error) {
>>>>>>> 68a2c39c1320bed1847393443db3a0a7003fe7c6
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

<<<<<<< HEAD
// POST /api/menu — naya menu item banao
=======
>>>>>>> 68a2c39c1320bed1847393443db3a0a7003fe7c6
const createMenuItem = async (req, res) => {
    try {
        const { name, path, type, url, order, icon } = req.body;
        const itemType = type || 'internal';

<<<<<<< HEAD
        // Validation
=======
>>>>>>> 68a2c39c1320bed1847393443db3a0a7003fe7c6
        if (!name || !name.trim()) {
            return res.status(400).json({ success: false, message: 'Name is required' });
        }
        if (itemType === 'internal' && (!path || !path.trim())) {
            return res.status(400).json({ success: false, message: 'Path is required for internal links' });
        }
        if (itemType === 'external' && (!url || !url.trim())) {
            return res.status(400).json({ success: false, message: 'URL is required for external links' });
        }

<<<<<<< HEAD
        // Duplicate check
        const existingMenu = await Menu.findOne({ name: name.trim() });
=======
        const existingMenu = await Menu.findOne(
            itemType === 'internal'
                ? { $or: [{ name: name.trim() }, { path: path.trim() }] }
                : { name: name.trim() }
        );
>>>>>>> 68a2c39c1320bed1847393443db3a0a7003fe7c6
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
<<<<<<< HEAD
        console.error('Create menu error:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
=======
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
>>>>>>> 68a2c39c1320bed1847393443db3a0a7003fe7c6
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: 'Server error while creating menu item', error: error.message });
    }
};

<<<<<<< HEAD
// PUT /api/menu/:id — update
=======
>>>>>>> 68a2c39c1320bed1847393443db3a0a7003fe7c6
const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, path, type, url, order, isActive, icon } = req.body;

        const menuItem = await Menu.findById(id);
        if (!menuItem) {
            return res.status(404).json({ success: false, message: 'Menu item not found' });
        }

        const newType = type || menuItem.type;

<<<<<<< HEAD
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
=======
        const onlyStatusUpdate = isActive !== undefined &&
            !name && !path && !type && !url && order === undefined && !icon;

        if (!onlyStatusUpdate && (name || path)) {
            const orConditions = [];
            if (name) orConditions.push({ name: name.trim() });
            if (path && newType === 'internal') orConditions.push({ path: path.trim() });

            if (orConditions.length > 0) {
                const existingMenu = await Menu.findOne({ _id: { $ne: id }, $or: orConditions });
                if (existingMenu) {
                    return res.status(400).json({ success: false, message: 'Menu item with this name or path already exists' });
                }
            }
        }

        if (name) menuItem.name = name.trim();
        if (type) menuItem.type = type;
>>>>>>> 68a2c39c1320bed1847393443db3a0a7003fe7c6
        if (order !== undefined) menuItem.order = order;
        if (isActive !== undefined) menuItem.isActive = isActive;
        if (icon !== undefined) menuItem.icon = icon.trim();

        if (newType === 'internal') {
<<<<<<< HEAD
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
=======
            if (path) menuItem.path = path.trim();
            menuItem.url = '';
        } else {
            if (url) menuItem.url = url.trim();
            menuItem.path = '';
        }

        await menuItem.save();
        res.json({ success: true, message: 'Menu item updated successfully', data: menuItem });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
>>>>>>> 68a2c39c1320bed1847393443db3a0a7003fe7c6
        res.status(500).json({ success: false, message: 'Server error while updating menu item', error: error.message });
    }
};

<<<<<<< HEAD
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
=======
const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        await Menu.findByIdAndDelete(id);
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
>>>>>>> 68a2c39c1320bed1847393443db3a0a7003fe7c6
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

<<<<<<< HEAD
// PUT /api/menu/reorder
=======
>>>>>>> 68a2c39c1320bed1847393443db3a0a7003fe7c6
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
<<<<<<< HEAD
        res.json({ success: true, message: 'Menu order updated successfully' });
    } catch (error) {
        console.error('Reorder menu error:', error);
=======
        res.json({ success: true, message: 'Reordered successfully' });
    } catch (error) {
>>>>>>> 68a2c39c1320bed1847393443db3a0a7003fe7c6
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { getMenu, getAllMenu, createMenuItem, updateMenuItem, deleteMenuItem, reorderMenu };