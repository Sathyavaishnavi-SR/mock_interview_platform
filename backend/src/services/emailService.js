const nodemailer = require('nodemailer');
const ApiError = require('../utils/errors');


// 🔍 DIAGNOSTIC LOG (add this line):
console.log('Gmail config loaded:', {
  user: process.env.GMAIL_USER || 'MISSING',
  pass: process.env.GMAIL_APP_PASSWORD ? 'LOADED (Length: ' + process.env.GMAIL_APP_PASSWORD.length + ')' : 'MISSING'
});

/**
 * Email Service Module
 * Uses Nodemailer with Gmail SMTP.
 * 
 * Educational Notes for Students:
 * - SMTP (Simple Mail Transfer Protocol) is the standard protocol for sending emails.
 * - For Gmail, Google requires an 'App Password' instead of your regular Google account password.
 * - The transporter holds configuration and credentials to establish a secure connection.
 */

// Initialize Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for 587 with STARTTLS
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

/**
 * Send Email Verification OTP
 * @param {string} email - Recipient email address
 * @param {string} otp - Plain 6-digit OTP code
 */
const sendVerificationEmail = async (email, otp) => {
  console.log('📧 [emailService] Attempting to send verification email to:', email);
  console.log('🔐 [emailService] Sender account:', process.env.GMAIL_USER);

  const mailOptions = {
    from: `"PSG AI Mock Interview Platform" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Email Verification OTP - PSG AI Mock Interview Platform',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #f3f4f6; padding: 30px; border-radius: 8px; max-width: 500px; margin: auto;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #6366f1; margin: 0;">PSG College of Technology</h2>
          <p style="color: #9ca3af; margin: 5px 0 0 0; font-size: 14px;">AI Mock Interview Platform</p>
        </div>
        <div style="background-color: #121824; padding: 25px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.08); text-align: center;">
          <p style="font-size: 16px; margin-top: 0;">Hello,</p>
          <p style="color: #9ca3af; font-size: 14px; line-height: 1.5;">
            Thank you for registering. Use the one-time verification code below to verify your email address:
          </p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #3b82f6; margin: 25px 0; padding: 12px; background: rgba(59, 130, 246, 0.1); border-radius: 6px; display: inline-block;">
            ${otp}
          </div>
          <p style="color: #ef4444; font-size: 13px; margin-bottom: 0;">
            ⚠️ This code is valid for <strong>10 minutes</strong>. Do not share this OTP with anyone.
          </p>
        </div>
        <p style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px;">
          If you did not request this verification, you can safely ignore this email.
        </p>
      </div>
    `,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ [emailService] Email sent successfully to:', email);
    console.log('📬 [emailService] Message ID:', result.messageId);
    console.log('📨 [emailService] SMTP Response:', result.response);
    return { success: true };
  } catch (error) {
    console.error('❌ [emailService] Email sending failed:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    if (error.response) console.error('SMTP response:', error.response);
    throw new ApiError(500, 'Failed to send verification email. Please try again later.');
  }
};

/**
 * Send Password Reset OTP
 * @param {string} email - Recipient email address
 * @param {string} otp - Plain 6-digit OTP code
 */
const sendPasswordResetEmail = async (email, otp) => {
  const mailOptions = {
    from: `"PSG AI Mock Interview Platform" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Password Reset OTP - PSG AI Mock Interview Platform',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #f3f4f6; padding: 30px; border-radius: 8px; max-width: 500px; margin: auto;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #6366f1; margin: 0;">PSG College of Technology</h2>
          <p style="color: #9ca3af; margin: 5px 0 0 0; font-size: 14px;">AI Mock Interview Platform</p>
        </div>
        <div style="background-color: #121824; padding: 25px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.08); text-align: center;">
          <p style="font-size: 16px; margin-top: 0;">Password Reset Request</p>
          <p style="color: #9ca3af; font-size: 14px; line-height: 1.5;">
            We received a request to reset the password for your account. Use the OTP below to proceed:
          </p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #f59e0b; margin: 25px 0; padding: 12px; background: rgba(245, 158, 11, 0.1); border-radius: 6px; display: inline-block;">
            ${otp}
          </div>
          <p style="color: #ef4444; font-size: 13px; margin-bottom: 0;">
            ⚠️ This code is valid for <strong>10 minutes</strong>. If you did not make this request, secure your account immediately.
          </p>
        </div>
        <p style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px;">
          PSG College of Technology • AI Mock Interview Portal
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Nodemailer password reset error:', error.message);
    throw new ApiError(500, 'Failed to send password reset email. Please try again later.');
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
