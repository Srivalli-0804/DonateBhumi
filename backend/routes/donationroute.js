const express = require('express');
const router = express.Router();
const {
  createDonation,
  getAllDonations,
  getMyDonations,
  getDonationsByEvent,
  createRazorpayOrder,
} = require('../controllers/donationController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, createDonation);
router.get('/', protect, adminOnly, getAllDonations);
router.get('/my', protect, getMyDonations);
router.get('/event/:eventId', protect, adminOnly, getDonationsByEvent);

// Razorpay order creation route
router.post('/razorpay-order', protect, createRazorpayOrder);

module.exports = router;
