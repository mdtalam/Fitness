const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');

// @desc    Get bookings for logged in member
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res) => {
    try {
        const db = getDb();
        const memberId = new ObjectId(req.user._id);

        const bookings = await db.collection('bookings').aggregate([
            { $match: { memberId } },
            {
                $lookup: {
                    from: 'trainers',
                    localField: 'trainerId',
                    foreignField: '_id',
                    as: 'trainer'
                }
            },
            { $unwind: '$trainer' },
            {
                $lookup: {
                    from: 'users',
                    localField: 'trainer.userId',
                    foreignField: '_id',
                    as: 'trainerUser'
                }
            },
            { $unwind: '$trainerUser' },
            {
                $lookup: {
                    from: 'slots',
                    localField: 'slotId',
                    foreignField: '_id',
                    as: 'slot'
                }
            },
            { $unwind: '$slot' },
            {
                $project: {
                    'trainerUser.password': 0,
                    'trainerUser.firebaseUid': 0,
                    'trainerUser.role': 0,
                    'trainer.userId': 0,
                    'trainer.isApproved': 0
                }
            },
            { $sort: { createdAt: -1 } }
        ]).toArray();

        res.status(200).json({
            status: 'success',
            results: bookings.length,
            data: {
                bookings
            }
        });
    } catch (error) {
        console.error('Error fetching my bookings:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching your bookings'
        });
    }
};

// @desc    Add review for a booking
// @route   POST /api/bookings/:id/review
// @access  Private
exports.addBookingReview = async (req, res) => {
    try {
        const db = getDb();
        const bookingId = new ObjectId(req.params.id);
        const { rating, feedback } = req.body;

        const booking = await db.collection('bookings').findOne({
            _id: bookingId,
            memberId: new ObjectId(req.user._id)
        });

        if (!booking) {
            return res.status(404).json({
                status: 'error',
                message: 'Booking not found'
            });
        }

        // Update booking with review
        await db.collection('bookings').updateOne(
            { _id: bookingId },
            {
                $set: {
                    review: {
                        rating: Number(rating),
                        feedback,
                        createdAt: new Date()
                    }
                }
            }
        );

        // Optional: Update trainer's average rating
        const trainerBookings = await db.collection('bookings').find({
            trainerId: booking.trainerId,
            'review.rating': { $exists: true }
        }).toArray();

        const avgRating = trainerBookings.reduce((acc, curr) => acc + curr.review.rating, 0) / trainerBookings.length;

        await db.collection('trainers').updateOne(
            { _id: booking.trainerId },
            { $set: { rating: parseFloat(avgRating.toFixed(1)) } }
        );

        res.status(200).json({
            status: 'success',
            message: 'Review added successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error adding review'
        });
    }
};
