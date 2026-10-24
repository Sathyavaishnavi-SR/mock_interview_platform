// backend/test-email.js
require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('Testing SMTP connection with:');
console.log('GMAIL_USER:', process.env.GMAIL_USER);
console.log('GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? '****** (Found)' : 'MISSING');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for port 465, false for port 587 (STARTTLS)
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Verify SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP Verification Error:', error.message);
    console.error('Full Error Code:', error.code);
    console.error('Command:', error.command);
  } else {
    console.log('✅ SMTP Connection is ready to send messages:', success);
  }
});