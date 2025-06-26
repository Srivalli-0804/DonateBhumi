const express = require('express');
const router = express.Router();
const {
  createFeedback,
  getFeedbacksByEvent,
  getMyFeedbacks,
} = require('../controllers/feedbackController');

const { protect } = require('../middleware/authMiddleware');

// Public route: View all feedbacks for a specific event
router.get('/event/:eventId', getFeedbacksByEvent);

// Protected route: Submit feedback
router.post('/', protect, createFeedback);

// Protected route: Get feedbacks by logged-in user
router.get('/my', protect, getMyFeedbacks);

module.exports = router;
