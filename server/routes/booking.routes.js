const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect); // All booking routes require authentication

router.get('/my-bookings', bookingController.getMyBookings);
router.post('/:id/review', bookingController.addBookingReview);

module.exports = router;
