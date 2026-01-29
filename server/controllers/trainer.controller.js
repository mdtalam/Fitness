const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');

// @desc    Get all approved trainers
// @route   GET /api/trainers
// @access  Public
exports.getTrainers = async (req, res) => {
    try {
        const db = getDb();


        const trainers = await db.collection('trainers').aggregate([
            { $match: { isApproved: true } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $lookup: {
                    from: 'slots',
                    localField: '_id',
                    foreignField: 'trainerId',
                    as: 'slots'
                }
            },
            {
                $addFields: {
                    availableSlotsCount: {
                        $size: {
                            $filter: {
                                input: '$slots',
                                as: 'slot',
                                cond: {
                                    $eq: ['$$slot.status', 'available']
                                }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    'user.firebaseUid': 0,
                    'user.updatedAt': 0,
                    'user.createdAt': 0,
                    'user.__v': 0,
                    slots: 0 // Remove the full slots array to keep response size small
                }
            },
            { $sort: { rating: -1 } }
        ]).toArray();

        res.status(200).json({
            status: 'success',
            results: trainers.length,
            data: {
                trainers
            }
        });
    } catch (error) {
        console.error('Error fetching trainers:', error.message);
        const isDbError = error.message.includes('Database not initialized');

        if (isDbError) {
            console.log('📡 INFO: Providing Mock Trainers for development (DB Offline)');
            const mockTrainers = [
                {
                    _id: 'mock_t1',
                    userId: 'mock_u1',
                    bio: 'Elite strength and conditioning coach with a focus on functional movement.',
                    experience: 12,
                    skills: ['Strength', 'Powerlifting', 'Mobility'],
                    rating: 4.9,
                    user: {
                        name: 'Marcus Thorne',
                        email: 'marcus@mock.com',
                        photoURL: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=200'
                    }
                },
                {
                    _id: 'mock_t2',
                    userId: 'mock_u2',
                    bio: 'Holistic wellness and yoga instructor specialized in mindfulness.',
                    experience: 8,
                    skills: ['Yoga', 'Meditation', 'Pilates'],
                    rating: 4.8,
                    user: {
                        name: 'Elena Vance',
                        email: 'elena@mock.com',
                        photoURL: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=200'
                    }
                }
            ];
            return res.status(200).json({
                status: 'success',
                results: mockTrainers.length,
                data: { trainers: mockTrainers },
                isMock: true
            });
        }

        res.status(500).json({
            status: 'error',
            message: 'Error fetching trainers',
            error: error.message
        });
    }
};

// @desc    Get single trainer details
// @route   GET /api/trainers/:id
// @access  Public
exports.getTrainer = async (req, res) => {
    try {
        const db = getDb();
        const trainer = await db.collection('trainers').aggregate([
            { $match: { _id: new ObjectId(req.params.id) } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    'user.firebaseUid': 0,
                    'user.updatedAt': 0,
                    'user.createdAt': 0,
                    'user.__v': 0
                }
            }
        ]).next();

        if (!trainer) {
            return res.status(404).json({
                status: 'error',
                message: 'Trainer not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                trainer
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching trainer details',
            error: error.message
        });
    }
};

// @desc    Get trainer dashboard stats
// @route   GET /api/trainers/dashboard/stats
// @access  Private (Trainer only)
exports.getDashboardStats = async (req, res) => {
    try {
        const db = getDb();
        const userId = new ObjectId(req.user._id);

        // Find trainer profile
        const trainer = await db.collection('trainers').findOne({ userId });

        if (!trainer) {
            return res.status(404).json({
                status: 'error',
                message: 'Trainer profile not found'
            });
        }

        // 1. Total Slots
        const totalSlots = await db.collection('slots').countDocuments({ trainerId: trainer._id });

        // 2. Booked Slots (Sessions)
        const bookedSlots = await db.collection('slots').countDocuments({
            trainerId: trainer._id,
            isBooked: true
        });

        // 3. Unique Students
        // Find all bookings for this trainer and get unique memberIds
        const uniqueStudents = await db.collection('bookings').distinct('memberId', { trainerId: trainer._id });
        const totalStudents = uniqueStudents.length;

        // 4. Rating
        const rating = trainer.rating || 0;

        res.status(200).json({
            status: 'success',
            data: {
                stats: {
                    totalStudents,
                    totalSlots,
                    bookedSlots,
                    rating
                }
            }
        });
    } catch (error) {
        console.error('Trainer stats error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching trainer stats'
        });
    }
};

// @desc    Remove trainer role (Admin)
// @route   DELETE /api/trainers/:id
// @access  Private (Admin only)
exports.removeTrainer = async (req, res) => {
    try {
        const db = getDb();
        const trainerId = new ObjectId(req.params.id);

        // 1. Find the trainer to get their userId
        const trainer = await db.collection('trainers').findOne({ _id: trainerId });

        if (!trainer) {
            return res.status(404).json({
                status: 'error',
                message: 'Trainer profile not found'
            });
        }

        const userId = trainer.userId;

        // 2. Delete trainer profile
        await db.collection('trainers').deleteOne({ _id: trainerId });

        // 3. Revert user role to member
        await db.collection('users').updateOne(
            { _id: userId },
            { $set: { role: 'member', updatedAt: new Date() } }
        );

        // 4. (Optional) You might want to handle their slots/bookings here 
        // depending on business rules. For now, we just remove the role.

        res.status(200).json({
            status: 'success',
            message: 'Trainer role removed and user reverted to member successfully'
        });
    } catch (error) {
        console.error('Remove trainer error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error removing trainer role',
            error: error.message
        });
    }
};

// @desc    Get trainer's bookings
// @route   GET /api/trainers/dashboard/bookings
// @access  Private (Trainer only)
exports.getTrainerBookings = async (req, res) => {
    try {
        const db = getDb();
        const userId = new ObjectId(req.user._id);

        const trainer = await db.collection('trainers').findOne({ userId });

        if (!trainer) {
            return res.status(404).json({
                status: 'error',
                message: 'Trainer profile not found'
            });
        }

        const bookings = await db.collection('bookings').aggregate([
            { $match: { trainerId: trainer._id } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'memberId',
                    foreignField: '_id',
                    as: 'member'
                }
            },
            { $unwind: '$member' },
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
                    'member.password': 0,
                    'member.firebaseUid': 0,
                    'member.role': 0
                }
            },
            { $sort: { createdAt: -1 } },
            { $limit: 10 }
        ]).toArray();

        res.status(200).json({
            status: 'success',
            data: {
                bookings
            }
        });
    } catch (error) {
        console.error('Trainer bookings error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching trainer bookings'
        });
    }
};

// @desc    Get unique students for a trainer
// @route   GET /api/trainers/dashboard/students
// @access  Private (Trainer only)
exports.getTrainerStudents = async (req, res) => {
    try {
        const db = getDb();
        const userId = new ObjectId(req.user._id);

        const trainer = await db.collection('trainers').findOne({ userId });

        if (!trainer) {
            return res.status(404).json({
                status: 'error',
                message: 'Trainer profile not found'
            });
        }

        // Aggregate unique students through bookings
        const students = await db.collection('bookings').aggregate([
            { $match: { trainerId: trainer._id } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'memberId',
                    foreignField: '_id',
                    as: 'member'
                }
            },
            { $unwind: '$member' },
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
                $group: {
                    _id: '$memberId',
                    name: { $first: '$member.name' },
                    email: { $first: '$member.email' },
                    photoURL: { $first: '$member.photoURL' },
                    lastBookingDate: { $max: '$bookingDate' },
                    classes: { $addToSet: '$slot.className' },
                    totalBookings: { $sum: 1 }
                }
            },
            { $sort: { lastBookingDate: -1 } }
        ]).toArray();

        res.status(200).json({
            status: 'success',
            data: {
                students
            }
        });
    } catch (error) {
        console.error('Trainer students error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching trainer students'
        });
    }
};
