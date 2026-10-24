const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const submissionController = require('../controllers/submissionController');
const { authenticateToken } = require('../middleware/auth');
const {
  validateRequest,
  signupSchema,
  verifyEmailSchema,
  resendOtpSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyResetOtpSchema,
  resetPasswordSchema,
  experienceSubmissionSchema,
  questionSubmissionSchema,
} = require('../middleware/validation');

/**
 * Authentication Endpoints (Public)
 */
// 1. User Registration -> generates OTP, sets isEmailVerified = false
router.post('/signup', validateRequest(signupSchema), authController.signup);

// 2. Email Verification -> validates OTP, sets isEmailVerified = true
router.post('/verify-email', validateRequest(verifyEmailSchema), authController.verifyEmail);

// 3. Resend Verification OTP -> rate-limited resend
router.post('/resend-otp', validateRequest(resendOtpSchema), authController.resendOtp);

// 4. User Login -> only allowed if email is verified
router.post('/login', validateRequest(loginSchema), authController.login);

// 5. Forgot Password -> sends 6-digit reset OTP
router.post('/forgot-password', validateRequest(forgotPasswordSchema), authController.forgotPassword);

// 6. Verify Reset OTP -> verifies OTP and returns one-time resetToken
router.post('/verify-reset-otp', validateRequest(verifyResetOtpSchema), authController.verifyResetOtp);

// 7. Reset Password -> validates resetToken and hashes new password
router.post('/reset-password', validateRequest(resetPasswordSchema), authController.resetPassword);

/**
 * Submissions Endpoints (Protected by JWT)
 */
// Experiences
router.post(
  '/submissions/experiences',
  authenticateToken,
  validateRequest(experienceSubmissionSchema),
  submissionController.submitExperience
);
router.get(
  '/submissions/experiences/my',
  authenticateToken,
  submissionController.getMyExperiences
);

// Questions
router.post(
  '/submissions/questions',
  authenticateToken,
  validateRequest(questionSubmissionSchema),
  submissionController.submitQuestion
);
router.get(
  '/submissions/questions/my',
  authenticateToken,
  submissionController.getMyQuestions
);

module.exports = router;
