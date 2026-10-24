const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  upload,
  startInterview,
  finishInterview,
  getMyInterviews,
  getInterviewById,
} = require('../controllers/interviewController');

/**
 * AI Mock Interview Routes
 * Base Mount: /api/interviews
 * All endpoints require valid JWT authentication.
 */

// 1. Start a new interview session (upload resume + generate questions)
router.post('/start', authenticateToken, upload.single('resume'), startInterview);

// 2. Submit candidate answers and evaluate session
router.post('/:id/finish', authenticateToken, finishInterview);

// 3. Get current user's completed interviews list + statistics
router.get('/my', authenticateToken, getMyInterviews);

// 4. Get specific interview session details and feedback
router.get('/:id', authenticateToken, getInterviewById);

module.exports = router;

