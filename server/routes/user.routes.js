const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');

const userController = require('../controllers/user.controller');

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, userController.getProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, userController.updateProfile);

// @route   PUT /api/users/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', protect, userController.changePassword);

module.exports = router;
