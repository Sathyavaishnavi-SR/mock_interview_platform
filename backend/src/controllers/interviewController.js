const multer = require('multer');
const { z } = require('zod');
const InterviewSession = require('../models/InterviewSession');
const { extractText, extractKeywords } = require('../services/resumeService');
const { generateQuestions, evaluateAnswers } = require('../services/groqService');
const { QUESTION_COUNT_BY_DURATION, ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } = require('../config/interviewConfig');
const ApiError = require('../utils/errors');

/**
 * Configure Multer Memory Storage
 * Stores uploaded file in memory as Buffer for immediate text extraction.
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ApiError(400, 'Invalid file format. Only PDF, DOC, and DOCX files are allowed.'));
    }
  },
});

/**
 * Zod schema for Interview Setup request fields
 */
const startInterviewSchema = z.object({
  targetRole: z.string().trim().min(1, 'Target role is required.'),
  interviewType: z.enum(['Technical Interview', 'HR / Behavioral Interview', 'Mixed Interview'], {
    errorMap: () => ({ message: 'Invalid interview type selected.' }),
  }),
  difficulty: z.enum(['Easy', 'Medium', 'Hard'], {
    errorMap: () => ({ message: 'Difficulty must be Easy, Medium, or Hard.' }),
  }),
  duration: z.coerce.number().refine((val) => [15, 30, 45].includes(val), {
    message: 'Duration must be 15, 30, or 45 minutes.',
  }),
});

/**
 * 1. POST /api/interviews/start
 * Uploads resume, extracts keywords, generates AI questions via Groq,
 * and initializes an in_progress InterviewSession.
 */
const startInterview = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError(401, 'Unauthorized. User session not found.');
    }

    if (!req.file) {
      throw new ApiError(400, 'Please upload a resume file (PDF or DOCX).');
    }

    // Validate form fields
    const parsedData = startInterviewSchema.safeParse(req.body);
    if (!parsedData.success) {
      const errorMsg = parsedData.error.issues.map((i) => i.message).join(', ');
      throw new ApiError(400, errorMsg);
    }

    const { targetRole, interviewType, difficulty, duration: durationMinutes } = parsedData.data;

    // Step 1: Extract text from resume buffer
    const resumeText = await extractText(req.file.buffer, req.file.mimetype);

    // Step 2: Extract tech keywords
    const keywords = extractKeywords(resumeText);

    // Step 3: Determine question count from duration
    const questionCount = QUESTION_COUNT_BY_DURATION[durationMinutes] || 8;

    // Step 4: Call Groq to generate customized interview questions
    const generatedItems = await generateQuestions({
      keywords,
      targetRole,
      interviewType,
      difficulty,
      count: questionCount,
    });

    // Step 5: Construct questions document array (with server-only reference answers)
    const sessionQuestions = generatedItems.map((item, index) => ({
      order: index + 1,
      text: item.question,
      referenceAnswer: item.referenceAnswer,
      userAnswer: '',
      score: null,
      feedback: '',
    }));

    // Step 6: Create and save InterviewSession in MongoDB
    const session = await InterviewSession.create({
      userId,
      targetRole,
      interviewType,
      difficulty,
      durationMinutes,
      keywords,
      questions: sessionQuestions,
      status: 'in_progress',
      startedAt: new Date(),
    });

    // Return interview data to frontend (excluding referenceAnswer for security)
    const clientQuestions = session.questions.map((q) => ({
      order: q.order,
      text: q.text,
    }));

    return res.status(201).json({
      success: true,
      message: 'Interview session created successfully.',
      interviewId: session._id,
      durationMinutes: session.durationMinutes,
      questions: clientQuestions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 2. POST /api/interviews/:id/finish
 * Submits user answers, runs AI evaluation with Groq,
 * computes overall percentage score, and closes session.
 */
const finishInterview = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      throw new ApiError(400, 'Answers payload must be an array.');
    }

    // Step 1: Fetch session and verify ownership & state
    const session = await InterviewSession.findById(id);
    if (!session) {
      throw new ApiError(404, 'Interview session not found.');
    }

    if (session.userId.toString() !== userId.toString()) {
      throw new ApiError(403, 'Forbidden. You do not have permission to access this interview session.');
    }

    if (session.status !== 'in_progress') {
      throw new ApiError(409, `Interview session cannot be finished because it is already ${session.status}.`);
    }

    // Map submitted answers by order number
    const answerMap = new Map();
    for (const item of answers) {
      if (item && typeof item.order === 'number') {
        answerMap.set(item.order, item.answer ? String(item.answer).trim() : '');
      }
    }

    // Prepare evaluation items
    const evalItems = [];
    session.questions.forEach((q) => {
      const userAnswer = answerMap.get(q.order) || '';
      q.userAnswer = userAnswer;

      evalItems.push({
        order: q.order,
        question: q.text,
        referenceAnswer: q.referenceAnswer,
        userAnswer,
      });
    });

    // Step 2: Call Groq to evaluate answers
    const evaluation = await evaluateAnswers({
      targetRole: session.targetRole,
      interviewType: session.interviewType,
      difficulty: session.difficulty,
      items: evalItems,
    });

    // Step 3: Attach evaluated scores & feedback to questions
    let totalScore = 0;
    const questionCount = session.questions.length;

    session.questions.forEach((q, idx) => {
      // If user answer was completely empty or skipped, assign 0 score
      if (!q.userAnswer || q.userAnswer.trim().length === 0) {
        q.score = 0;
        q.feedback = 'No answer provided. Make sure to attempt every question during your interview.';
      } else {
        const evalResult = evaluation.perQuestion?.[idx];
        const assignedScore = typeof evalResult?.score === 'number'
          ? Math.max(0, Math.min(10, Math.round(evalResult.score)))
          : 0;
        q.score = assignedScore;
        q.feedback = evalResult?.feedback || 'Answer evaluated.';
      }
      totalScore += q.score;
    });

    // Step 4: Compute overallScore on backend (0-100)
    // Formula: round(sum of scores / (questionCount * 10) * 100)
    const maxPossiblePoints = questionCount * 10;
    const computedOverallScore = maxPossiblePoints > 0
      ? Math.round((totalScore / maxPossiblePoints) * 100)
      : 0;

    session.overallScore = computedOverallScore;
    session.summaryFeedback = evaluation.summaryFeedback || 'Interview completed.';
    session.strengths = Array.isArray(evaluation.strengths) ? evaluation.strengths : [];
    session.improvements = Array.isArray(evaluation.improvements) ? evaluation.improvements : [];
    session.status = 'completed';
    session.completedAt = new Date();

    await session.save();

    // Prepare client response (strictly omit referenceAnswer)
    const clientQuestions = session.questions.map((q) => ({
      order: q.order,
      text: q.text,
      userAnswer: q.userAnswer,
      score: q.score,
      feedback: q.feedback,
    }));

    return res.status(200).json({
      success: true,
      message: 'Interview evaluated successfully.',
      overallScore: session.overallScore,
      summaryFeedback: session.summaryFeedback,
      strengths: session.strengths,
      improvements: session.improvements,
      questions: clientQuestions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 3. GET /api/interviews/my
 * Fetches user interview history and summary statistics.
 */
const getMyInterviews = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError(401, 'Unauthorized. Please log in.');
    }

    const sessions = await InterviewSession.find({ userId, status: 'completed' })
      .sort({ createdAt: -1 })
      .select('targetRole interviewType difficulty overallScore status createdAt completedAt');

    const mappedHistory = sessions.map((s) => ({
      id: s._id,
      date: s.completedAt || s.createdAt,
      targetRole: s.targetRole,
      role: s.targetRole, // alias for frontend ResultCard
      interviewType: s.interviewType,
      difficulty: s.difficulty,
      overallScore: s.overallScore,
      score: s.overallScore, // alias for frontend ResultCard
      status: s.status,
    }));

    // Calculate overall stats
    const total = mappedHistory.length;
    const validScores = mappedHistory
      .map((s) => s.overallScore)
      .filter((s) => typeof s === 'number');

    const average = validScores.length > 0
      ? (validScores.reduce((acc, curr) => acc + curr, 0) / validScores.length).toFixed(1)
      : '—';

    const highest = validScores.length > 0 ? Math.max(...validScores) : '—';
    const latest = mappedHistory.length > 0 ? mappedHistory[0].overallScore : '—';

    return res.status(200).json({
      success: true,
      stats: {
        total,
        average,
        highest,
        latest,
      },
      interviews: mappedHistory,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 4. GET /api/interviews/:id
 * Fetches single interview session detail for the owner (excluding referenceAnswer).
 */
const getInterviewById = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const session = await InterviewSession.findById(id);
    if (!session) {
      throw new ApiError(404, 'Interview session not found.');
    }

    if (session.userId.toString() !== userId.toString()) {
      throw new ApiError(403, 'Forbidden. You do not have permission to view this interview session.');
    }

    const clientQuestions = session.questions.map((q) => ({
      order: q.order,
      text: q.text,
      userAnswer: q.userAnswer,
      score: q.score,
      feedback: q.feedback,
    }));

    return res.status(200).json({
      success: true,
      interview: {
        id: session._id,
        targetRole: session.targetRole,
        interviewType: session.interviewType,
        difficulty: session.difficulty,
        durationMinutes: session.durationMinutes,
        keywords: session.keywords,
        status: session.status,
        overallScore: session.overallScore,
        summaryFeedback: session.summaryFeedback,
        strengths: session.strengths,
        improvements: session.improvements,
        startedAt: session.startedAt,
        completedAt: session.completedAt,
        questions: clientQuestions,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  upload,
  startInterview,
  finishInterview,
  getMyInterviews,
  getInterviewById,
};

