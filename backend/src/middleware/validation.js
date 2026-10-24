const { z } = require('zod');
const ApiError = require('../utils/errors');

/**
 * Validation Schemas with Zod
 * 
 * Educational Notes for Students:
 * - Zod provides schema-first validation.
 * - .trim() removes leading and trailing whitespace.
 * - .regex() enforces specific text patterns (like college roll numbers).
 * - .refine() allows cross-field validation (e.g., verifying that password matches confirmPassword).
 */

// Format: 2 digits + 1 uppercase letter + 3 digits (e.g. 25Z272)
const ROLL_NO_REGEX = /^[0-9]{2}[A-Z]{1}[0-9]{3}$/;
const OTP_REGEX = /^[0-9]{6}$/;

// 1. Signup Schema
const signupSchema = z
  .object({
    name: z
      .string({ required_error: 'Name is required' })
      .trim()
      .min(1, 'Name cannot be empty'),
    rollNo: z
      .string({ required_error: 'Roll number is required' })
      .trim()
      .toUpperCase()
      .regex(ROLL_NO_REGEX, 'Roll number must be in the format 25Z272 (2 digits, 1 letter, 3 digits)'),
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Invalid email address')
      .toLowerCase(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z
      .string({ required_error: 'Confirm password is required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// 2. Verify Email Schema
const verifyEmailSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Invalid email address')
    .toLowerCase(),
  otp: z
    .string({ required_error: 'OTP is required' })
    .trim()
    .regex(OTP_REGEX, 'OTP must be exactly 6 digits'),
});

// 3. Resend OTP Schema
const resendOtpSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Invalid email address')
    .toLowerCase(),
});

// 4. Login Schema
const loginSchema = z.object({
  rollNo: z
    .string({ required_error: 'Roll number is required' })
    .trim()
    .toUpperCase(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters long'),
});

// 5. Forgot Password Schema
const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Invalid email address')
    .toLowerCase(),
});

// 6. Verify Reset OTP Schema
const verifyResetOtpSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Invalid email address')
    .toLowerCase(),
  otp: z
    .string({ required_error: 'OTP is required' })
    .trim()
    .regex(OTP_REGEX, 'OTP must be exactly 6 digits'),
});

// 7. Reset Password Schema
const resetPasswordSchema = z
  .object({
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Invalid email address')
      .toLowerCase(),
    resetToken: z
      .string({ required_error: 'Reset token is required' })
      .min(1, 'Reset token cannot be empty'),
    newPassword: z
      .string({ required_error: 'New password is required' })
      .min(6, 'New password must be at least 6 characters long'),
    confirmNewPassword: z
      .string({ required_error: 'Confirm new password is required' }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  });

// 8. Experience Submission Schema (without numberOfRounds)
const experienceSubmissionSchema = z
  .object({
    companyName: z.string().trim().min(1, 'Company name is required.').optional(),
    company: z.string().trim().min(1, 'Company name is required.').optional(),
    role: z
      .string({ required_error: 'Role / Position is required.' })
      .trim()
      .min(1, 'Role / Position is required.'),
    interviewType: z
      .string({ required_error: 'Interview Type is required.' })
      .trim()
      .min(1, 'Interview Type is required.'),
    interviewMode: z
      .string({ required_error: 'Interview Mode is required.' })
      .trim()
      .min(1, 'Interview Mode is required.'),
    interviewDate: z
      .union([z.string(), z.date()])
      .optional()
      .nullable()
      .transform((val) => (val && typeof val === 'string' && val.trim() ? new Date(val) : null)),
    rounds: z
      .array(
        z.object({
          roundNumber: z.number().or(z.string().transform((v) => Number(v) || 1)),
          type: z.string().trim().min(1, 'Round type is required.'),
          description: z.string().trim().min(1, 'Please fill out the description for all added rounds.'),
        })
      )
      .min(1, 'Please add at least one interview round.'),
    questionsAsked: z
      .array(z.string().trim().min(1, 'Question text cannot be empty.'))
      .min(1, 'Please add at least one interview question.')
      .optional(),
    questions: z
      .array(
        z.object({
          text: z.string().trim().min(1, 'Please enter question details for all added questions.'),
        })
      )
      .min(1, 'Please add at least one interview question.')
      .optional(),
    experience: z
      .string({ required_error: 'Please describe your overall interview experience.' })
      .trim()
      .min(1, 'Please describe your overall interview experience.')
      .max(2000, 'Experience description must be 2000 characters or less.'),
    preparation: z
      .string()
      .max(1000, 'Preparation notes must be 1000 characters or less.')
      .optional()
      .default(''),
    difficulty: z.enum(['Easy', 'Medium', 'Hard'], {
      errorMap: () => ({ message: 'Difficulty must be Easy, Medium, or Hard.' }),
    }),
  })
  .refine(
    (data) => (data.companyName && data.companyName.trim().length > 0) || (data.company && data.company.trim().length > 0),
    {
      message: 'Company name is required.',
      path: ['companyName'],
    }
  )
  .refine(
    (data) =>
      (Array.isArray(data.questionsAsked) && data.questionsAsked.length > 0) ||
      (Array.isArray(data.questions) && data.questions.length > 0),
    {
      message: 'Please add at least one interview question.',
      path: ['questionsAsked'],
    }
  );

// 9. Question Submission Schema
const questionSubmissionSchema = z.object({
  company: z
    .string({ required_error: 'Please enter the company name.' })
    .trim()
    .min(1, 'Please enter the company name.'),
  role: z
    .string({ required_error: 'Please enter the role / position.' })
    .trim()
    .min(1, 'Please enter the role / position.'),
  interviewRound: z
    .string({ required_error: 'Please select the interview round.' })
    .trim()
    .min(1, 'Please select the interview round.'),
  interviewDate: z.coerce.date({
    required_error: 'Please enter the interview date.',
    invalid_type_error: 'Please enter a valid interview date.',
  }),
  question: z
    .string({ required_error: 'Please enter the interview question.' })
    .trim()
    .min(1, 'Please enter the interview question.')
    .max(500, 'Question must be 500 characters or less.'),
  topic: z
    .string({ required_error: 'Please select a topic.' })
    .trim()
    .min(1, 'Please select a topic.'),
  questionType: z
    .string({ required_error: 'Please select a question type.' })
    .trim()
    .min(1, 'Please select a question type.'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard'], {
    errorMap: () => ({ message: 'Difficulty must be Easy, Medium, or Hard.' }),
  }),
  memory: z.enum(['exact', 'mostly', 'partial'], {
    errorMap: () => ({ message: 'Please indicate how accurately you remember the question.' }),
  }),
  answerNotes: z
    .string()
    .max(1000, 'Answer / notes must be 1000 characters or less.')
    .optional()
    .default(''),
});

/**
 * Generic Validation Middleware
 * Validates req.body against a given Zod schema.
 * If validation fails, collects all error messages and passes an ApiError(400) to next().
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        // Collect messages from all failed fields
        const errorMessage = parsed.error.issues.map((err) => err.message).join(', ');
        return next(new ApiError(400, errorMessage));
      }
      // Replace req.body with the sanitized and parsed data (trimmed, uppercased/lowercased)
      req.body = parsed.data;
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = {
  signupSchema,
  verifyEmailSchema,
  resendOtpSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyResetOtpSchema,
  resetPasswordSchema,
  experienceSubmissionSchema,
  questionSubmissionSchema,
  validateRequest,
};
