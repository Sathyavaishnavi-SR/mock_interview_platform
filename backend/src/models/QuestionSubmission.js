const mongoose = require('mongoose');

const questionSubmissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required.'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role / Position is required.'],
      trim: true,
    },
    interviewRound: {
      type: String,
      required: [true, 'Interview round is required.'],
      trim: true,
    },
    interviewDate: {
      type: Date,
      required: [true, 'Interview date is required.'],
    },
    question: {
      type: String,
      required: [true, 'Interview question is required.'],
      maxlength: [500, 'Question must be 500 characters or less.'],
      trim: true,
    },
    topic: {
      type: String,
      required: [true, 'Topic is required.'],
      trim: true,
    },
    questionType: {
      type: String,
      required: [true, 'Question type is required.'],
      trim: true,
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty level is required.'],
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    memory: {
      type: String,
      required: [true, 'Memory accuracy is required.'],
      enum: ['exact', 'mostly', 'partial'],
      default: 'mostly',
    },
    answerNotes: {
      type: String,
      maxlength: [1000, 'Answer / notes must be 1000 characters or less.'],
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

questionSubmissionSchema.index({ userId: 1, status: 1 });

const QuestionSubmission = mongoose.model('QuestionSubmission', questionSubmissionSchema);

module.exports = QuestionSubmission;

