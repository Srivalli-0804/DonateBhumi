const express = require('express');
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Admin-only routes
router.post('/', protect, adminOnly, createEvent);
router.put('/:id', protect, adminOnly, updateEvent);
router.delete('/:id', protect, adminOnly, deleteEvent);

module.exports = router;
