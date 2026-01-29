const express = require('express');
const router = express.Router();
const classController = require('../controllers/class.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

router.get('/', classController.getClasses);
router.get('/:id', classController.getClass);

// Admin only
router.post('/', protect, restrictTo('admin'), classController.createClass);
router.put('/:id', protect, restrictTo('admin'), classController.updateClass);
router.delete('/:id', protect, restrictTo('admin'), classController.deleteClass);

module.exports = router;
