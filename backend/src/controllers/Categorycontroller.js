const Category = require('../models/Category');
const cloudinary = require('../config/cloudinary');

// GET /api/categories — public, active only
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true })
            .sort({ order: 1, createdAt: 1 })
            .select('-__v');
        res.json({ success: true, data: categories });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// GET /api/categories/all — admin, sab
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find()
            .sort({ order: 1, createdAt: 1 })
            .select('-__v');
        res.json({ success: true, data: categories });
    } catch (error) {
        console.error('Get all categories error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// POST /api/categories — create
const createCategory = async (req, res) => {
    try {
        const { name, description, order } = req.body;
        const file = req.file;

        if (!name || !name.trim()) {
            if (file) await cloudinary.uploader.destroy(file.filename);
            return res.status(400).json({ success: false, message: 'Name is required' });
        }

        const existing = await Category.findOne({ name: name.trim() });
        if (existing) {
            if (file) await cloudinary.uploader.destroy(file.filename);
            return res.status(400).json({ success: false, message: 'Category with this name already exists' });
        }

        const slug = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        const category = await Category.create({
            name: name.trim(),
            slug,
            description: description ? description.trim() : '',
            order: order || 0,
            image: file ? file.path : '',
            imagePublicId: file ? file.filename : ''
        });

        res.status(201).json({ success: true, message: 'Category created successfully', data: category });

    } catch (error) {
        console.error('Create category error:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// PUT /api/categories/:id — update
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, order, isActive } = req.body;
        const file = req.file;

        const category = await Category.findById(id);
        if (!category) {
            if (file) await cloudinary.uploader.destroy(file.filename);
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        // Duplicate name check
        if (name && name.trim() !== category.name) {
            const existing = await Category.findOne({ _id: { $ne: id }, name: name.trim() });
            if (existing) {
                if (file) await cloudinary.uploader.destroy(file.filename);
                return res.status(400).json({ success: false, message: 'Category with this name already exists' });
            }
        }

        if (name !== undefined) {
            category.name = name.trim();
            category.slug = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        }
        if (description !== undefined) category.description = description.trim();
        if (order !== undefined) category.order = order;
        if (isActive !== undefined) category.isActive = isActive;

        // Image update
        if (file) {
            try {
                if (category.imagePublicId) {
                    await cloudinary.uploader.destroy(category.imagePublicId);
                }
            } catch (e) {
                console.error('Cloudinary delete error:', e);
            }
            category.image = file.path;
            category.imagePublicId = file.filename;
        }

        await category.save();
        res.json({ success: true, message: 'Category updated successfully', data: category });

    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// DELETE /api/categories/:id
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        // Delete image from cloudinary
        if (category.imagePublicId) {
            try {
                await cloudinary.uploader.destroy(category.imagePublicId);
            } catch (e) {
                console.error('Cloudinary delete error:', e);
            }
        }

        await Category.findByIdAndDelete(id);
        res.json({ success: true, message: 'Category deleted successfully' });

    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { getCategories, getAllCategories, createCategory, updateCategory, deleteCategory };