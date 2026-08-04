const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');

// Generate JWT Token (customer tokens are marked so they can't be reused as admin tokens)
const generateToken = (id) => {
  return jwt.sign({ id, role: 'customer' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @desc    Register new customer (shop signup)
// @route   POST /api/customers/register
// @access  Public
const registerCustomer = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    const existing = await Customer.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    const customer = await Customer.create({ name, email, phone, password });
    const token = generateToken(customer._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone
      }
    });
  } catch (error) {
    console.error('Customer register error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// @desc    Login customer
// @route   POST /api/customers/login
// @access  Public
const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const customer = await Customer.findOne({ email: email.toLowerCase() }).select('+password');
    if (!customer) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!customer.isActive) {
      return res.status(401).json({ success: false, message: 'Account is deactivated' });
    }

    const isMatch = await customer.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    await customer.updateLastLogin();
    const token = generateToken(customer._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone
      }
    });
  } catch (error) {
    console.error('Customer login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @desc    Get all customers (admin panel — Users & Roles page)
// @route   GET /api/customers
// @access  Private (admin token required)
const getAllCustomers = async (req, res) => {
  try {
    const { search, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [customers, total] = await Promise.all([
      Customer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Customer.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: customers,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching customers' });
  }
};

// @desc    Toggle customer active/inactive (admin panel)
// @route   PUT /api/customers/:id/status
// @access  Private (admin token required)
const toggleCustomerStatus = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    customer.isActive = !customer.isActive;
    await customer.save();

    res.json({ success: true, message: 'Customer status updated', data: customer });
  } catch (error) {
    console.error('Toggle customer status error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating status' });
  }
};

// @desc    Delete customer (admin panel)
// @route   DELETE /api/customers/:id
// @access  Private (admin token required)
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting customer' });
  }
};

module.exports = {
  registerCustomer,
  loginCustomer,
  getAllCustomers,
  toggleCustomerStatus,
  deleteCustomer
};