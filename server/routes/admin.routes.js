const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

router.get('/stats', protect, restrictTo('admin'), adminController.getStats);

router.get('/applications', (req, res) => {
    res.json({ status: 'success', message: 'Admin routes - Coming soon' });
});

module.exports = router;
