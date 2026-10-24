const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    rollNo: {
      type: String,
      required: [true, 'Roll number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
      type: String,
      enum: ['user', 'local_admin', 'global_admin'],
      default: 'user',
    },
    department: {
      type: String,
      trim: true,
    },
    // Email Verification fields
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String, // stores hashed OTP
      default: null,
    },
    emailVerificationTokenExpiry: {
      type: Date,
      default: null,
    },
    verificationAttempts: {
      type: Number,
      default: 0,
    },
    lastVerificationAttemptTime: {
      type: Date,
      default: null,
    },
    // Password Reset fields
    passwordResetToken: {
      type: String, // stores hashed reset OTP or temporary verified flag/token
      default: null,
    },
    passwordResetTokenExpiry: {
      type: Date,
      default: null,
    },
    passwordResetAttempts: {
      type: Number,
      default: 0,
    },
    lastPasswordResetAttemptTime: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
module.exports = User;
