const Feedback = require('../models/Feedback');
const Event = require('../models/Event');

// @desc    Submit feedback for an event
// @route   POST /api/feedbacks
// @access  Private
const createFeedback = async (req, res) => {
  const { eventId, rating, message, role } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const feedback = await Feedback.create({
      user: req.user._id,
      event: eventId,
      rating,
      message,
      role,
    });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Feedback submission failed', error: error.message });
  }
};

// @desc    Get all feedback for an event
// @route   GET /api/feedbacks/event/:eventId
// @access  Public
const getFeedbacksByEvent = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ event: req.params.eventId })
      .populate('user', 'name role')
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch feedbacks', error: error.message });
  }
};

// @desc    Get all feedback by the logged-in user
// @route   GET /api/feedbacks/my
// @access  Private
const getMyFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ user: req.user._id })
      .populate('event', 'title date');

    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch your feedbacks', error: error.message });
  }
};

module.exports = {
  createFeedback,
  getFeedbacksByEvent,
  getMyFeedbacks,
};
