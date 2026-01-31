const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

router.post('/create-payment-intent', protect, paymentController.createPaymentIntent);
router.post('/confirm-booking', protect, paymentController.confirmBooking);
router.get('/admin-stats', protect, restrictTo('admin'), paymentController.getAdminStats);

module.exports = router;
