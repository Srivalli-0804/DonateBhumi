const Donation = require('../models/Donation');
const Event = require('../models/Event');
const razorpay = require('../utils/razorpayInstance');

// @desc    Make a donation
// @route   POST /api/donations
// @access  Private (Donor)
const createDonation = async (req, res) => {
  const { eventId, amount, paymentMethod, paymentId } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const donation = await Donation.create({
      donor: req.user._id,
      event: eventId,
      amount,
      paymentMethod,
      paymentId,
      status: 'success', // You can make this dynamic if using Razorpay webhook
    });

    // Update event's totalCollected amount
    event.totalCollected += amount;
    await event.save();

    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create donation', error: error.message });
  }
};

// @desc    Get all donations (admin only)
// @route   GET /api/donations
// @access  Private/Admin
const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('donor', 'name email')
      .populate('event', 'title date');

    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch donations', error: error.message });
  }
};

// @desc    Get logged-in user's donations
// @route   GET /api/donations/my
// @access  Private
const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user._id })
      .populate('event', 'title date');

    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch your donations', error: error.message });
  }
};

// @desc    Get donations for a specific event
// @route   GET /api/donations/event/:eventId
// @access  Private/Admin (optional)
const getDonationsByEvent = async (req, res) => {
  try {
    const donations = await Donation.find({ event: req.params.eventId })
      .populate('donor', 'name email');

    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch donations for event', error: error.message });
  }
};

const createRazorpayOrder = async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // Razorpay works in paise (₹100 = 10000)
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Razorpay order creation failed', error: error.message });
  }
};

module.exports = {
  createDonation,
  getAllDonations,
  getMyDonations,
  getDonationsByEvent,
  createRazorpayOrder
};
