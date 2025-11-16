const express = require('express');
const router = express.Router();
const {
  createContactMessage,
  getAllMessages,
  getUnreadCount,
  markAsRead,
  replyToMessage,
  deleteMessage,
  testEmailConfig
} = require('../controllers/contactController');

const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/', createContactMessage);
router.get('/test-email', testEmailConfig); // ✅ PUBLIC BANA DO

// Protected Admin routes
router.get('/messages', protect, authorize('admin', 'super-admin'), getAllMessages);
router.get('/unread-count', protect, authorize('admin', 'super-admin'), getUnreadCount);
router.patch('/messages/:id/read', protect, authorize('admin', 'super-admin'), markAsRead);
router.post('/messages/:id/reply', protect, authorize('admin', 'super-admin'), replyToMessage);
router.delete('/messages/:id', protect, authorize('admin', 'super-admin'), deleteMessage);

module.exports = router;