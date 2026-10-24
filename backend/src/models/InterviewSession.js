const mongoose = require('mongoose');

/**
 * Question Subdocument Schema
 * Represents an individual question generated for the interview session.
 * 
 * Note: referenceAnswer is strictly stored on the server side and NEVER
 * sent to the client during the interview to maintain integrity.
 */
const questionSchema = new mongoose.Schema(
  {
    order: {
      type: Number,
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    referenceAnswer: {
      type: String,
      required: true,
      trim: true,
    },
    userAnswer: {
      type: String,
      default: '',
      trim: true,
    },
    score: {
      type: Number,
      default: null, // 0 - 10, populated after evaluation
      min: 0,
      max: 10,
    },
    feedback: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { _id: false }
);

/**
 * Interview Session Schema
 * Tracks the complete lifecycle of a resume-based AI mock interview session.
 * 
 * Educational Notes for Students:
 * - We do NOT persist the original uploaded resume or raw resume text to respect user privacy and storage limits.
 * - Only extracted domain keywords are stored to contextualize subsequent analytics and audits.
 */
const interviewSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    targetRole: {
      type: String,
      required: [true, 'Target role is required.'],
      trim: true,
    },
    interviewType: {
      type: String,
      required: [true, 'Interview type is required.'],
      enum: ['Technical Interview', 'HR / Behavioral Interview', 'Mixed Interview'],
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty level is required.'],
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    durationMinutes: {
      type: Number,
      required: [true, 'Duration in minutes is required.'],
      enum: [15, 30, 45],
    },
    keywords: {
      type: [String],
      default: [],
    },
    questions: {
      type: [questionSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'abandoned'],
      default: 'in_progress',
      index: true,
    },
    overallScore: {
      type: Number,
      default: null, // 0 - 100, calculated on the backend
      min: 0,
      max: 100,
    },
    summaryFeedback: {
      type: String,
      default: '',
      trim: true,
    },
    strengths: {
      type: [String],
      default: [],
    },
    improvements: {
      type: [String],
      default: [],
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to quickly fetch a user's completed sessions in reverse chronological order
interviewSessionSchema.index({ userId: 1, status: 1, createdAt: -1 });

const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);

module.exports = InterviewSession;

