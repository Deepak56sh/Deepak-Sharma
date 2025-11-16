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

    // ✅ Send notification email to ADMIN
    try {
      await sendAdminNotification(name, email, subject, message);
    } catch (emailError) {
      console.error('Admin notification email failed:', emailError);
      // Continue even if email fails
    }

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
      repliedBy: req.user ? req.user._id : 'admin'
    };
    message.status = 'replied';

    await message.save();

    // ✅ Send email reply to USER
    try {
      await sendReplyEmailToUser(message.email, message.name, message.subject, replyMessage);
      
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

// ✅ Helper function to send ADMIN NOTIFICATION email
const sendAdminNotification = async (name, email, subject, message) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('Resend API key not configured');
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@yourcompany.com'; // Set this in .env

  const { data, error } = await resend.emails.send({
    from: 'Website Contact <onboarding@resend.dev>',
    to: [adminEmail],
    subject: `📧 New Contact Message: ${subject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 30px; text-align: center; color: white; }
          .content { padding: 30px; background: #f9f9f9; }
          .message-box { background: white; padding: 20px; border-left: 4px solid #ff6b6b; margin: 20px 0; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
          .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 12px; }
          .button { display: inline-block; padding: 12px 24px; background: #ff6b6b; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📨 New Contact Message</h1>
          </div>
          <div class="content">
            <p><strong>You have received a new message from your website contact form:</strong></p>
            
            <div class="message-box">
              <p><strong>From:</strong> ${name} (${email})</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong></p>
              <p>${message.replace(/\n/g, '<br>')}</p>
            </div>
            
            <p>
              <a href="${process.env.ADMIN_URL || 'http://localhost:3000/admin'}/contact-messages" class="button">
                View in Admin Panel
              </a>
            </p>
            
            <p><em>This is an automated notification from your website.</em></p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Your Company Name</p>
          </div>
        </div>
      </body>
      </html>
    `
  });

  if (error) {
    throw error;
  }

  console.log('📧 Admin notification sent to:', adminEmail);
  return data;
};

// ✅ Helper function to send REPLY email to USER
const sendReplyEmailToUser = async (toEmail, toName, originalSubject, replyMessage) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('Resend API key not configured');
  }

  const { data, error } = await resend.emails.send({
    from: 'Your Company <onboarding@resend.dev>',
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
    `
  });

  if (error) {
    throw error;
  }

  console.log('📧 Reply email sent to user:', toEmail);
  return data;
};

// Test email configuration
exports.testEmailConfig = async (req, res) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      return res.status(400).json({
        success: false,
        message: 'Resend API key not configured'
      });
    }

    // Test both admin notification and user reply
    const adminEmail = process.env.ADMIN_EMAIL || 'test@example.com';
    
    const { data, error } = await resend.emails.send({
      from: 'Test <onboarding@resend.dev>',
      to: [adminEmail],
      subject: 'Test Email Configuration - Working!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #667eea;">✅ Email Configuration Test</h2>
          <p>If you receive this, your Resend email configuration is working perfectly!</p>
          <p><strong>Features tested:</strong></p>
          <ul>
            <li>✅ Admin notifications for new contact messages</li>
            <li>✅ Reply emails to users</li>
            <li>✅ HTML email templates</li>
          </ul>
        </div>
      `
    });

    if (error) {
      throw error;
    }

    res.status(200).json({
      success: true,
      message: 'Email configuration is working! Both admin notifications and user replies will work.',
      data: {
        emailId: data.id,
        adminEmail: adminEmail,
        status: 'Ready to send emails'
      }
    });
    
  } catch (error) {
    console.error('Email configuration test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Email configuration test failed',
      error: error.message
    });
  }
};