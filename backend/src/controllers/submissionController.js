const InterviewExperience = require('../models/InterviewExperience');
const QuestionSubmission = require('../models/QuestionSubmission');
const ApiError = require('../utils/errors');

/**
 * Submission Controller
 * Handles user interview experiences and question contributions
 */

// 1. POST /api/submissions/experiences
const submitExperience = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const {
      companyName,
      company,
      role,
      interviewType,
      interviewMode,
      interviewDate,
      rounds,
      questionsAsked,
      questions,
      experience,
      preparation,
      difficulty,
    } = req.body;

    const finalCompanyName = companyName || company;

    let finalQuestions = [];
    const rawQuestions = questionsAsked || questions;
    if (Array.isArray(rawQuestions)) {
      finalQuestions = rawQuestions.map((q) => (typeof q === 'string' ? q : q.text || '')).filter(Boolean);
    }

    const newDoc = await InterviewExperience.create({
      userId,
      companyName: finalCompanyName,
      role,
      interviewType,
      interviewMode,
      interviewDate: interviewDate || null,
      rounds,
      questionsAsked: finalQuestions,
      experience,
      preparation: preparation || '',
      difficulty,
      status: 'pending',
    });

    return res.status(201).json({
      success: true,
      message: 'Experience submitted successfully',
      submissionId: newDoc._id,
    });
  } catch (error) {
    next(error);
  }
};

// 2. GET /api/submissions/experiences/my
const getMyExperiences = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { status } = req.query;

    const filter = { userId };
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      filter.status = status;
    }

    const experiences = await InterviewExperience.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: experiences.length,
      experiences,
    });
  } catch (error) {
    next(error);
  }
};

// 3. POST /api/submissions/questions
const submitQuestion = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const questionDoc = await QuestionSubmission.create({
      ...req.body,
      userId,
      status: 'pending',
    });

    return res.status(201).json({
      success: true,
      message: 'Question submitted successfully',
      questionId: questionDoc._id,
    });
  } catch (error) {
    next(error);
  }
};

// 4. GET /api/submissions/questions/my
const getMyQuestions = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { status } = req.query;

    const filter = { userId };
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      filter.status = status;
    }

    const questions = await QuestionSubmission.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitExperience,
  getMyExperiences,
  submitQuestion,
  getMyQuestions,
};

