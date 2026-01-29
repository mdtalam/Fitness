const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/create-payment-intent', protect, paymentController.createPaymentIntent);
router.post('/confirm-booking', protect, paymentController.confirmBooking);

module.exports = router;
