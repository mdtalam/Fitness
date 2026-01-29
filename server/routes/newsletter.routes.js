const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletter.controller');

const { protect, restrictTo } = require('../middleware/auth.middleware');

router.post('/subscribe', newsletterController.subscribe);
router.get('/', protect, restrictTo('admin'), newsletterController.getAllSubscribers);

module.exports = router;
