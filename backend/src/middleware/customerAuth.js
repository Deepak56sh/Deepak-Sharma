const jwt = require('jsonwebtoken');

// Verifies customer JWT (role: 'customer') — used for cart/checkout/orders (shop side)
const customerAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Please login to continue' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'customer') {
      return res.status(403).json({ success: false, message: 'Invalid token for this action' });
    }
    req.customerId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Session expired, please login again' });
  }
};

module.exports = customerAuth;