const Plant = require('../models/Plant');
const path = require('path');
const fs = require('fs');
const cloudinary = require("../config/cloudinary");

// Same uploads path logic as server.js
const isRender = process.env.RENDER_EXTERNAL_URL || process.env.NODE_ENV === 'production';
const uploadsPath = isRender
  ? '/tmp/uploads'
  : path.join(__dirname, '../../public/uploads');

// ---------- GET all (admin + public) ----------
// GET /api/plants  OR  GET /api/products
const getPlants = async (req, res) => {
  try {
    const {
      search,
      category,
      plantType,
      light,
      careLevel,
      petFriendly,
      potIncluded,
      active,
      limit = 50,
      page = 1,
      sort = 'newest'
    } = req.query;

    const filter = {};

    // Public shop usually wants only active
    if (active === 'true' || active === true) {
      filter.isActive = true;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) filter.category = category;
    if (plantType) filter.plantType = plantType;
    if (light) filter.light = light;
    if (careLevel) filter.careLevel = careLevel;
    if (petFriendly === 'true') filter.petFriendly = true;
    if (petFriendly === 'false') filter.petFriendly = false;
    if (potIncluded === 'true') filter.potIncluded = true;
    if (potIncluded === 'false') filter.potIncluded = false;

    let sortOption = { createdAt: -1 };
    if (sort === 'price-low') sortOption = { price: 1 };
    if (sort === 'price-high') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'name') sortOption = { name: 1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [plants, total] = await Promise.all([
      Plant.find(filter).sort(sortOption).skip(skip).limit(Number(limit)),
      Plant.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: plants,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get plants error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching plants' });
  }
};

// ---------- GET single by id or slug ----------
// GET /api/plants/:idOrSlug  OR  GET /api/products/:idOrSlug
const getPlant = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let plant = null;

    // Try by MongoDB id
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      plant = await Plant.findById(idOrSlug);
    }
    // Try by slug
    if (!plant) {
      plant = await Plant.findOne({ slug: idOrSlug });
    }

    if (!plant) {
      return res.status(404).json({ success: false, message: 'Plant not found' });
    }

    // Related plants (same category, exclude self)
    const related = await Plant.find({
      _id: { $ne: plant._id },
      isActive: true,
      $or: [{ category: plant.category }, { plantType: plant.plantType }]
    })
      .limit(4)
      .select('name slug price image rating');

    const data = plant.toObject();
    data.related = related;

    res.json({ success: true, data });
  } catch (error) {
    console.error('Get plant error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching plant' });
  }
};

// ---------- CREATE ----------
// POST /api/plants
const createPlant = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      stock,
      description,
      image,
      originalPrice,
      plantType,
      light,
      careLevel,
      petFriendly,
      potIncluded,
      isBestSeller,
      isLowMaintenance,
      isAirPurifying,
      sizes,
      badges,
      tags,
      isActive
    } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name and price are required'
      });
    }

    const plant = await Plant.create({
      name,
      category: category || 'Indoor Plants',
      plantType: plantType || category || 'Indoor Plants',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(price),
      stock: stock !== undefined ? Number(stock) : 0,
      description: description || '',
      image: image || '',
      images: image ? [image] : [],
      light: light || 'Bright Indirect',
      careLevel: careLevel || 'Easy',
      petFriendly: petFriendly === true || petFriendly === 'true',
      potIncluded: potIncluded !== false && potIncluded !== 'false',
      isBestSeller: isBestSeller === true || isBestSeller === 'true',
      isLowMaintenance: isLowMaintenance === true || isLowMaintenance === 'true',
      isAirPurifying: isAirPurifying === true || isAirPurifying === 'true',
      sizes: sizes || ['5 inch', '7 inch', '9 inch'],
      badges: badges || [],
      tags: tags || [],
      isActive: isActive !== false
    });

    res.status(201).json({
      success: true,
      message: 'Plant created successfully',
      data: plant
    });
  } catch (error) {
    console.error('Create plant error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Plant with this name/slug already exists' });
    }
    res.status(500).json({ success: false, message: error.message || 'Server error while creating plant' });
  }
};

// ---------- UPDATE ----------
// PUT /api/plants/:id
const updatePlant = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      return res.status(404).json({ success: false, message: 'Plant not found' });
    }

    const fields = [
      'name', 'category', 'plantType', 'price', 'originalPrice', 'stock',
      'description', 'image', 'light', 'careLevel', 'petFriendly', 'potIncluded',
      'isBestSeller', 'isLowMaintenance', 'isAirPurifying', 'sizes', 'badges',
      'tags', 'isActive', 'rating', 'reviews', 'careGuide', 'order'
    ];

    fields.forEach((key) => {
      if (req.body[key] !== undefined) {
        plant[key] = req.body[key];
      }
    });

    // Numbers
    if (req.body.price !== undefined) plant.price = Number(req.body.price);
    if (req.body.originalPrice !== undefined) plant.originalPrice = Number(req.body.originalPrice);
    if (req.body.stock !== undefined) plant.stock = Number(req.body.stock);

    // Booleans
    if (req.body.petFriendly !== undefined) {
      plant.petFriendly = req.body.petFriendly === true || req.body.petFriendly === 'true';
    }
    if (req.body.potIncluded !== undefined) {
      plant.potIncluded = req.body.potIncluded === true || req.body.potIncluded === 'true';
    }
    if (req.body.isBestSeller !== undefined) {
      plant.isBestSeller = req.body.isBestSeller === true || req.body.isBestSeller === 'true';
    }
    if (req.body.isLowMaintenance !== undefined) {
      plant.isLowMaintenance = req.body.isLowMaintenance === true || req.body.isLowMaintenance === 'true';
    }
    if (req.body.isAirPurifying !== undefined) {
      plant.isAirPurifying = req.body.isAirPurifying === true || req.body.isAirPurifying === 'true';
    }
    if (req.body.isActive !== undefined) {
      plant.isActive = req.body.isActive === true || req.body.isActive === 'true';
    }

    // Keep images in sync with main image
    if (req.body.image) {
      plant.image = req.body.image;
      if (!plant.images.includes(req.body.image)) {
        plant.images = [req.body.image, ...(plant.images || [])];
      }
    }

    await plant.save();

    res.json({
      success: true,
      message: 'Plant updated successfully',
      data: plant
    });
  } catch (error) {
    console.error('Update plant error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating plant' });
  }
};

// ---------- DELETE ----------
// DELETE /api/plants/:id
const deletePlant = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      return res.status(404).json({ success: false, message: 'Plant not found' });
    }

    // Optional: delete image file
    if (plant.image && plant.image.startsWith('/uploads/')) {
      const filePath = path.join(uploadsPath, path.basename(plant.image));
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
      }
    }

    await Plant.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Plant deleted successfully'
    });
  } catch (error) {
    console.error('Delete plant error:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting plant' });
  }
};
// ---------- UPLOAD IMAGE (Cloudinary) ----------
const uploadPlantImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        imageUrl: req.file.path,
        url: req.file.path,
        filename: req.file.filename,
      },
    });
  } catch (error) {
    console.error("Upload plant image error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server error while uploading image",
    });
  }
};
module.exports = {
  getPlants,
  getPlant,
  createPlant,
  updatePlant,
  deletePlant,
  uploadPlantImage
};