const Event = require('../models/Event');

// @desc    Create a new event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res) => {
  const { title, description, image, date, location, donationGoal } = req.body;

  try {
    const event = await Event.create({
      title,
      description,
      image,
      date,
      location,
      donationGoal,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Event creation failed', error: error.message });
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch events', error: error.message });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch event', error: error.message });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = async (req, res) => {
  const { title, description, image, date, location, donationGoal, isActive } = req.body;

  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.image = image || event.image;
    event.date = date || event.date;
    event.location = location || event.location;
    event.donationGoal = donationGoal || event.donationGoal;
    event.isActive = isActive !== undefined ? isActive : event.isActive;

    const updated = await event.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Event update failed', error: error.message });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.remove();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete event', error: error.message });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
