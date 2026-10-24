const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/errors');
const emailService = require('../services/emailService');

/**
 * Helper to generate random 6-digit OTP (100000 - 999999)
 */
const generateSixDigitOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * 1. Signup Controller
 * Registers user in unverified state (isEmailVerified: false) and sends OTP.
 */
const signup = async (req, res, next) => {
  try {
    const { name, rollNo, email, password } = req.body;
    console.log('1️⃣ [Signup] Request received for:', email, 'Roll:', rollNo);

    // Check if user already exists by rollNo or email
    const existingUser = await User.findOne({
      $or: [{ rollNo: rollNo.toUpperCase() }, { email: email.toLowerCase() }],
    });

    if (existingUser) {
      console.log('⚠️ [Signup] User already registered:', email, rollNo);
      throw new ApiError(409, 'Roll number or email already registered');
    }

    // Hash password with bcrypt (salt rounds: 10)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate and hash 6-digit OTP
    const rawOtp = generateSixDigitOTP();
    const hashedOtp = await bcrypt.hash(rawOtp, saltRounds);

    // Expiry: 10 minutes from now (in ms)
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    console.log('2️⃣ [Signup] Creating user in MongoDB...');
    // Create user in unverified status. Note: role is not accepted from req.body
    const newUser = await User.create({
      name,
      rollNo: rollNo.toUpperCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'user',
      isEmailVerified: false,
      emailVerificationToken: hashedOtp,
      emailVerificationTokenExpiry: otpExpiry,
      verificationAttempts: 0,
      lastVerificationAttemptTime: null,
    });
    console.log('3️⃣ [Signup] User created in DB with _id:', newUser._id);

    console.log('4️⃣ [Signup] Calling sendVerificationEmail with OTP:', rawOtp);
    // Send verification email
    await emailService.sendVerificationEmail(newUser.email, rawOtp);
    console.log('5️⃣ [Signup] Email sent successfully, returning response');

    return res.status(201).json({
      success: true,
      message: 'Signup successful. OTP sent to your email. Valid for 10 minutes.',
      email: newUser.email,
    });
  } catch (error) {
    console.error('❌ [Signup] Error in signup flow:', error.message);
    next(error);
  }
};

/**
 * 2. Verify Email Controller
 * Verifies email OTP, enforces attempt limit and expiry, activates account.
 */
const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    if (user.isEmailVerified) {
      throw new ApiError(400, 'Email already verified');
    }

    // Check if user is locked out due to >= 3 failed attempts in the last 10 minutes
    if (user.verificationAttempts >= 3 && user.lastVerificationAttemptTime) {
      const timeSinceLastAttempt = Date.now() - new Date(user.lastVerificationAttemptTime).getTime();
      if (timeSinceLastAttempt < 10 * 60 * 1000) {
        throw new ApiError(429, 'Too many failed attempts. Try again in 10 minutes.');
      } else {
        // Cooldown passed: reset attempts counter
        user.verificationAttempts = 0;
        user.lastVerificationAttemptTime = null;
      }
    }

    // Check OTP expiration
    if (!user.emailVerificationTokenExpiry || new Date(user.emailVerificationTokenExpiry).getTime() < Date.now()) {
      throw new ApiError(400, 'OTP expired. Request a new one.');
    }

    // Compare plain OTP with stored hashed OTP
    const isOtpValid = await bcrypt.compare(otp, user.emailVerificationToken);

    if (!isOtpValid) {
      user.verificationAttempts += 1;
      if (user.verificationAttempts >= 3) {
        user.lastVerificationAttemptTime = new Date();
        await user.save();
        throw new ApiError(429, 'Too many failed attempts. Try again in 10 minutes.');
      }
      await user.save();
      throw new ApiError(400, 'Invalid OTP');
    }

    // OTP is valid -> Mark account verified and clear tokens
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationTokenExpiry = null;
    user.verificationAttempts = 0;
    user.lastVerificationAttemptTime = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully. You will be re-directed to the dashboard.',
      token: jwt.sign(
    { userId: user._id, rollNo: user.rollNo, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  ),
  user: { 
    id: user._id, 
    name: user.name, 
    rollNo: user.rollNo, 
    email: user.email,
    role: user.role 
  }

    });
  } catch (error) {
    next(error);
  }
};

/**
 * 3. Resend OTP Controller
 * Issues a new OTP if account is unverified and rate limit is respected.
 */
const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    if (user.isEmailVerified) {
      throw new ApiError(400, 'Email already verified');
    }

    // Check rate limiting (10-minute cooldown if last attempt failed or was requested recently)
    if (user.lastVerificationAttemptTime) {
      const timeElapsed = Date.now() - new Date(user.lastVerificationAttemptTime).getTime();
      if (timeElapsed < 10 * 60 * 1000) {
        throw new ApiError(429, 'Please wait 10 minutes before requesting another OTP');
      }
    }

    // Generate new OTP and hash it
    const rawOtp = generateSixDigitOTP();
    const hashedOtp = await bcrypt.hash(rawOtp, 10);

    user.emailVerificationToken = hashedOtp;
    user.emailVerificationTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
    user.verificationAttempts = 0;
    await user.save();

    await emailService.sendVerificationEmail(user.email, rawOtp);

    return res.status(200).json({
      success: true,
      message: 'New OTP sent to your email.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 4. Login Controller
 * Authenticates user, ensures email is verified, returns JWT.
 */
const login = async (req, res, next) => {
  try {
    const { rollNo, password } = req.body;

    // Case-insensitive lookup for rollNo
    const user = await User.findOne({ rollNo: rollNo.toUpperCase() });
    if (!user) {
      throw new ApiError(401, 'Invalid roll number or password');
    }

    // Enforce email verification prerequisite
    if (!user.isEmailVerified) {
      throw new ApiError(403, 'Please verify your email first');
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid roll number or password');
    }

    // Issue JWT
    const token = jwt.sign(
      {
        userId: user._id,
        rollNo: user.rollNo,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        rollNo: user.rollNo,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 5. Forgot Password Controller
 * Generates password reset OTP and sends via email.
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new ApiError(404, 'No account found with this email');
    }

    // Generate 6-digit reset OTP and hash it
    const rawOtp = generateSixDigitOTP();
    const hashedOtp = await bcrypt.hash(rawOtp, 10);

    user.passwordResetToken = hashedOtp;
    user.passwordResetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
    user.passwordResetAttempts = 0;
    user.lastPasswordResetAttemptTime = null;
    await user.save();

    await emailService.sendPasswordResetEmail(user.email, rawOtp);

    return res.status(200).json({
      success: true,
      message: 'Password reset OTP sent to your email. Valid for 10 minutes.',
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 6. Verify Reset OTP Controller
 * Verifies reset OTP and issues a temporary reset token.
 */
const verifyResetOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Check rate limit / cooldown
    if (user.passwordResetAttempts >= 3 && user.lastPasswordResetAttemptTime) {
      const timeElapsed = Date.now() - new Date(user.lastPasswordResetAttemptTime).getTime();
      if (timeElapsed < 10 * 60 * 1000) {
        throw new ApiError(429, 'Too many failed attempts. Try again in 10 minutes.');
      } else {
        user.passwordResetAttempts = 0;
        user.lastPasswordResetAttemptTime = null;
      }
    }

    // Check expiry
    if (!user.passwordResetTokenExpiry || new Date(user.passwordResetTokenExpiry).getTime() < Date.now()) {
      throw new ApiError(400, 'OTP expired. Request a new one.');
    }

    // Compare reset OTP
    const isOtpValid = await bcrypt.compare(otp, user.passwordResetToken);

    if (!isOtpValid) {
      user.passwordResetAttempts += 1;
      if (user.passwordResetAttempts >= 3) {
        user.lastPasswordResetAttemptTime = new Date();
        await user.save();
        throw new ApiError(429, 'Too many failed attempts. Try again in 10 minutes.');
      }
      await user.save();
      throw new ApiError(400, 'Invalid OTP');
    }

    // OTP verified -> create temporary resetToken flag for step 7
    const temporaryResetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = temporaryResetToken; // Store the one-time ticket
    user.passwordResetAttempts = 0;
    user.lastPasswordResetAttemptTime = null;
    // Maintain 10-minute expiry window for actual password submission
    user.passwordResetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'OTP verified. You can now reset your password.',
      resetToken: temporaryResetToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 7. Reset Password Controller
 * Final step: updates password using verified reset token.
 */
const resetPassword = async (req, res, next) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Verify token expiration
    if (!user.passwordResetTokenExpiry || new Date(user.passwordResetTokenExpiry).getTime() < Date.now()) {
      throw new ApiError(400, 'Reset token expired. Start over.');
    }

    // Verify that the resetToken matches the one-time ticket issued in verifyResetOtp
    if (!user.passwordResetToken || user.passwordResetToken !== resetToken) {
      throw new ApiError(400, 'Invalid reset token. Please verify OTP first.');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clean up reset states
    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetTokenExpiry = null;
    user.passwordResetAttempts = 0;
    user.lastPasswordResetAttemptTime = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  verifyEmail,
  resendOtp,
  login,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
};
