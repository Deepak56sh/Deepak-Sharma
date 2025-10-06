const express = require('express');
const router = express.Router();
const {
  createContactMessage,
  getAllMessages,
  markAsRead,
  deleteMessage
} = require('../controllers/contactController');

// ✅ CORRECTED: Remove duplicate '/contact' from path
router.post('/', createContactMessage);                // POST /api/contact
router.get('/messages', getAllMessages);              // GET /api/contact/messages
router.patch('/messages/:id', markAsRead);            // PATCH /api/contact/messages/:id
router.delete('/messages/:id', deleteMessage);        // DELETE /api/contact/messages/:id

module.exports = router;