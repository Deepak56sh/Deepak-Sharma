// controllers/headerController.js
const Header = require('../models/Menu');
const cloudinary = require('../config/cloudinary');

// @desc    Get header data
// @route   GET /api/header
// @access  Public
const getHeader = async (req, res) => {
    try {
        let header = await Header.findOne();
        
        // If no header exists, create default
        if (!header) {
            header = await Header.create({
                logoText: 'Plantora',
                logoImage: '',
                topBarText: 'Free Shipping on orders above ₹999'
            });
        }

        res.json({
            success: true,
            data: header
        });
    } catch (error) {
        console.error('Get header error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching header'
        });
    }
};

// @desc    Update header
// @route   PUT /api/header
// @access  Private
const updateHeader = async (req, res) => {
    try {
        const { logoText, topBarText, isActive } = req.body;
        const file = req.file;

        let header = await Header.findOne();
        if (!header) {
            header = new Header();
        }

        // Update text fields
        if (logoText) header.logoText = logoText.trim();
        if (topBarText) header.topBarText = topBarText.trim();
        if (isActive !== undefined) header.isActive = isActive;

        // Handle logo image upload
        if (file) {
            // Delete old logo from cloudinary if exists
            if (header.logoImagePublicId) {
                try {
                    await cloudinary.uploader.destroy(header.logoImagePublicId);
                } catch (err) {
                    console.error('Error deleting old logo:', err);
                }
            }
            
            header.logoImage = file.path;
            header.logoImagePublicId = file.filename || file.public_id;
        }

        await header.save();

        res.json({
            success: true,
            message: 'Header updated successfully',
            data: header
        });

    } catch (error) {
        console.error('Update header error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating header'
        });
    }
};

// @desc    Delete header logo
// @route   DELETE /api/header/logo
// @access  Private
const deleteLogo = async (req, res) => {
    try {
        let header = await Header.findOne();
        if (!header) {
            return res.status(404).json({
                success: false,
                message: 'Header not found'
            });
        }

        // Delete from cloudinary
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

module.exports = {
    getHeader,
    updateHeader,
    deleteLogo
};