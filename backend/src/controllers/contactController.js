const ContactMessage = require('../models/ContactMessage');

// Resend.com setup (100 emails/month FREE)
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

// @desc    Create new contact message
// @route   POST /api/contact
// @access  Public
exports.createContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Create message
    const contactMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: contactMessage
    });

  } catch (error) {
    console.error('Error creating contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact/messages
// @access  Private (Admin)
exports.getAllMessages = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ContactMessage.countDocuments(query);

    res.status(200).json({
      success: true,
      count: messages.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: messages
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
};

// @desc    Get unread messages count
// @route   GET /api/contact/unread-count
// @access  Private (Admin)
exports.getUnreadCount = async (req, res) => {
  try {
    const unreadCount = await ContactMessage.countDocuments({ status: 'unread' });

    res.status(200).json({
      success: true,
      data: {
        unreadCount
      }
    });

  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unread count',
      error: error.message
    });
  }
};

// @desc    Mark message as read
// @route   PATCH /api/contact/messages/:id/read
// @access  Private (Admin)
exports.markAsRead = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status: 'read' },
      { new: true, runValidators: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.status(200).json({
      success: true,
      data: message
    });

  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update message',
      error: error.message
    });
  }
};

// @desc    Reply to message
// @route   POST /api/contact/messages/:id/reply
// @access  Private (Admin)
exports.replyToMessage = async (req, res) => {
  try {
    const { replyMessage } = req.body;

    if (!replyMessage) {
      return res.status(400).json({
        success: false,
        message: 'Reply message is required'
      });
    }

    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Update message with admin reply
    message.adminReply = {
      message: replyMessage,
      repliedAt: new Date(),
      repliedBy: req.user._id
    };
    message.status = 'replied';

    await message.save();

    // Send email reply using Resend.com (FREE)
    try {
      await sendReplyEmailResend(message.email, message.name, message.subject, replyMessage);
      
      res.status(200).json({
        success: true,
        message: 'Reply sent successfully via email',
        data: message
      });
      
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      
      // Email fail hua toh bhi reply save ho gaya hai
      res.status(200).json({
        success: true,
        message: 'Reply saved but email failed. Please check email configuration.',
        data: message
      });
    }

  } catch (error) {
    console.error('Error replying to message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send reply',
      error: error.message
    });
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contact/messages/:id
// @access  Private (Admin)
exports.deleteMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message',
      error: error.message
    });
  }
};

// Helper function to send email using Resend.com
const sendReplyEmailResend = async (toEmail, toName, originalSubject, replyMessage) => {
  // Check if Resend API key is available
  if (!process.env.RESEND_API_KEY) {
    throw new Error('Resend API key not configured. Please set RESEND_API_KEY in .env file');
  }

  const { data, error } = await resend.emails.send({
    from: 'Your Company <onboarding@resend.dev>', // Resend provides this domain for testing
    to: [toEmail],
    subject: `Re: ${originalSubject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; }
          .content { padding: 30px; background: #f9f9f9; }
          .reply-box { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
          .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Contacting Us!</h1>
          </div>
          <div class="content">
            <p>Hello <strong>${toName}</strong>,</p>
            <p>Thank you for reaching out to us. Here is our response to your message:</p>
            <div class="reply-box">
              ${replyMessage.replace(/\n/g, '<br>')}
            </div>
            <p>If you have any further questions, feel free to reply to this email.</p>
            <br>
            <p>Best regards,<br><strong>Your Team</strong></p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Hello ${toName},\n\nThank you for reaching out to us. Here is our response to your message:\n\n${replyMessage}\n\nIf you have any further questions, feel free to reply to this email.\n\nBest regards,\nYour Team`
  });

  if (error) {
    throw error;
  }

  console.log('📧 Reply email sent successfully via Resend to:', toEmail);
  console.log('Resend Email ID:', data.id);
  
  return data;
};

// Test email configuration
exports.testEmailConfig = async (req, res) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      return res.status(400).json({
        success: false,
        message: 'Resend API key not configured in environment variables'
      });
    }

    // Test by sending a simple email
    const { data, error } = await resend.emails.send({
      from: 'Test <onboarding@resend.dev>',
      to: ['test@example.com'],  // Yahan tum apna test email daal sakte ho
      subject: 'Test Email Configuration - Your Company',
      html: '<p>If you receive this, Resend email configuration is working perfectly!</p>'
    });

    if (error) {
      throw error;
    }

    res.status(200).json({
      success: true,
      message: 'Resend email configuration is working!',
      data: {
        emailId: data.id,
        status: 'Ready to send emails'
      }
    });
    
  } catch (error) {
    console.error('Resend configuration test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Resend configuration test failed',
      error: error.message
    });
  }
};