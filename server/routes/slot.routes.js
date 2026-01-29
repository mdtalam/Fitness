const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slot.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

router.get('/trainer/:trainerId', slotController.getTrainerSlots);
router.get('/manage', protect, restrictTo('trainer'), slotController.getTrainerManageSlots);
router.post('/', protect, restrictTo('trainer', 'admin'), slotController.createSlot);
router.get('/:id', protect, slotController.getSlot);
router.patch('/:id', protect, restrictTo('trainer', 'admin'), slotController.updateSlot);
router.delete('/:id', protect, restrictTo('trainer', 'admin'), slotController.deleteSlot);

module.exports = router;
