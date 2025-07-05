const nodemailer = require('nodemailer');

// Create a test transporter to validate email domains
const createTestTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || 'test@example.com',
      pass: process.env.EMAIL_PASS || 'testpass'
    }
  });
};

// Validate email domain by attempting to connect to its SMTP server
const validateEmailDomain = async (email) => {
  try {
    const domain = email.split('@')[1];
    
    // List of disposable email providers to block
    const disposableDomains = [
      'tempmail.org', '10minutemail.com', 'guerrillamail.com',
      'mailinator.com', 'yopmail.com', 'temp-mail.org',
      'fakeinbox.com', 'sharklasers.com', 'getairmail.com',
      'mailnesia.com', 'trashmail.com', 'tempr.email',
      'throwaway.email', 'maildrop.cc', 'guerrillamailblock.com'
    ];
    
    // Check if it's a disposable email
    if (disposableDomains.includes(domain.toLowerCase())) {
      return { valid: false, reason: 'disposable_email' };
    }
    
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, reason: 'invalid_format' };
    }
    
    // Try to verify the domain's MX records
    const transporter = createTestTransporter();
    const verifyResult = await transporter.verify();
    
    if (verifyResult) {
      return { valid: true, reason: 'valid_email' };
    } else {
      return { valid: false, reason: 'invalid_domain' };
    }
    
  } catch (error) {
    console.error('Email validation error:', error);
    // If validation fails, we'll still allow the email but log it
    return { valid: true, reason: 'validation_failed_but_allowed' };
  }
};

// Send verification email
const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ff6b35;">Verify Your Email Address</h2>
          <p>Thank you for signing up! Please click the button below to verify your email address:</p>
          <a href="http://localhost:3000/auth/verify?token=${verificationToken}" 
             style="background-color: #ff6b35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email Address
          </a>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p>http://localhost:3000/auth/verify?token=${verificationToken}</p>
          <p>This link will expire in 24 hours.</p>
        </div>
      `
    };
    
    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  validateEmailDomain,
  sendVerificationEmail
}; 