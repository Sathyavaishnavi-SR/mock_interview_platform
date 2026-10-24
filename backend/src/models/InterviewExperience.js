const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema(
  {
    roundNumber: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const interviewExperienceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required.'],
      trim: true,
      alias: 'company',
    },
    role: {
      type: String,
      required: [true, 'Role / Position is required.'],
      trim: true,
    },
    interviewType: {
      type: String,
      required: [true, 'Interview Type is required.'],
      trim: true,
    },
    interviewMode: {
      type: String,
      required: [true, 'Interview Mode is required.'],
      trim: true,
    },
    interviewDate: {
      type: Date,
      default: null,
    },
    rounds: {
      type: [roundSchema],
      required: [true, 'At least one interview round is required.'],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'Please add at least one interview round.',
      },
    },
    questionsAsked: {
      type: [String],
      alias: 'questions',
      required: [true, 'At least one interview question is required.'],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'Please add at least one interview question.',
      },
    },
    experience: {
      type: String,
      required: [true, 'Overall interview experience description is required.'],
      maxlength: [2000, 'Experience description cannot exceed 2000 characters.'],
      trim: true,
    },
    preparation: {
      type: String,
      maxlength: [1000, 'Preparation notes cannot exceed 1000 characters.'],
      trim: true,
      default: '',
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty level is required.'],
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field: auto-calculate numberOfRounds from rounds.length
interviewExperienceSchema.virtual('numberOfRounds').get(function () {
  return Array.isArray(this.rounds) ? this.rounds.length : 0;
});

// Compound index for querying user submissions with status
interviewExperienceSchema.index({ userId: 1, status: 1 });

const InterviewExperience = mongoose.model('InterviewExperience', interviewExperienceSchema);

module.exports = InterviewExperience;
