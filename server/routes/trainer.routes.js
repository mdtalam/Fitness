const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainer.controller');
const trainerAppController = require('../controllers/trainerApplication.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

router.get('/', trainerController.getTrainers);
router.get('/dashboard/stats', protect, restrictTo('trainer'), trainerController.getDashboardStats);
router.get('/dashboard/bookings', protect, restrictTo('trainer'), trainerController.getTrainerBookings);
router.get('/dashboard/students', protect, restrictTo('trainer'), trainerController.getTrainerStudents);

// Applications - Specific routes must come before parameter routes
router.get('/my-application', protect, trainerAppController.getMyApplication);
router.post('/apply', protect, trainerAppController.applyToBeTrainer);
router.get('/applications', protect, restrictTo('admin'), trainerAppController.getApplications);
router.get('/applications/:id', protect, restrictTo('admin'), trainerAppController.getApplication);
router.patch('/applications/:id', protect, restrictTo('admin'), trainerAppController.handleApplication);

// Parameter routes
router.get('/:id', trainerController.getTrainer);
router.delete('/:id', protect, restrictTo('admin'), trainerController.removeTrainer);

module.exports = router;
