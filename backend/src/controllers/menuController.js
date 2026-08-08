// controllers/headerController.js
const Header = require('../models/Menu');
const cloudinary = require('../config/cloudinary');

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
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const updateHeader = async (req, res) => {
    try {
        const { logoText, topBarText } = req.body;
        const file = req.file;

        let header = await Header.findOne();
        if (!header) header = new Header();

        if (logoText) header.logoText = logoText.trim();
        if (topBarText) header.topBarText = topBarText.trim();

        if (file) {
            if (header.logoImagePublicId) {
                try { await cloudinary.uploader.destroy(header.logoImagePublicId); } catch (err) {}
            }
            header.logoImage = file.path;
            header.logoImagePublicId = file.filename || file.public_id;
        }

        await header.save();
        res.json({ success: true, message: 'Header updated', data: header });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const deleteLogo = async (req, res) => {
    try {
        let header = await Header.findOne();
        if (!header) {
            return res.status(404).json({ success: false, message: 'Header not found' });
        }

        if (header.logoImagePublicId) {
            try { await cloudinary.uploader.destroy(header.logoImagePublicId); } catch (err) {}
        }

        header.logoImage = '';
        header.logoImagePublicId = '';
        await header.save();

        res.json({ success: true, message: 'Logo deleted', data: header });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { getHeader, updateHeader, deleteLogo };