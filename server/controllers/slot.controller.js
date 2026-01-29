const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');

// @desc    Get all slots for a trainer
// @route   GET /api/slots/trainer/:trainerId
// @access  Public
exports.getTrainerSlots = async (req, res) => {
    try {
        const db = getDb();

        const slots = await db.collection('slots').find({
            trainerId: new ObjectId(req.params.trainerId),
            isBooked: false
        }).sort({ startTime: 1 }).toArray();

        res.status(200).json({
            status: 'success',
            results: slots.length,
            data: {
                slots
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching trainer slots',
            error: error.message
        });
    }
};

// @desc    Create new slot
// @route   POST /api/slots
// @access  Private/Trainer
exports.createSlot = async (req, res) => {
    try {
        const db = getDb();
        const userId = new ObjectId(req.user._id);

        // Find the trainer profile
        const trainer = await db.collection('trainers').findOne({ userId });

        if (!trainer) {
            return res.status(404).json({
                status: 'error',
                message: 'Trainer profile not found'
            });
        }

        const newSlotData = {
            ...req.body,
            trainerId: trainer._id,
            isBooked: false,
            status: 'available',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        if (req.body.date) {
            newSlotData.date = new Date(req.body.date);
        }

        const result = await db.collection('slots').insertOne(newSlotData);
        const savedSlot = { _id: result.insertedId, ...newSlotData };

        res.status(201).json({
            status: 'success',
            data: {
                slot: savedSlot
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error creating slot',
            error: error.message
        });
    }
};

// @desc    Get all slots for the logged-in trainer (Manage Slots)
// @route   GET /api/slots/manage
// @access  Private/Trainer
exports.getTrainerManageSlots = async (req, res) => {
    try {
        const db = getDb();
        const userId = new ObjectId(req.user._id);

        // 1. Find the trainer profile
        const trainer = await db.collection('trainers').findOne({ userId });

        if (!trainer) {
            return res.status(404).json({
                status: 'error',
                message: 'Trainer profile not found'
            });
        }

        // 2. Fetch slots with booking and student details
        const slots = await db.collection('slots').aggregate([
            { $match: { trainerId: trainer._id } },
            {
                $lookup: {
                    from: 'bookings',
                    localField: '_id',
                    foreignField: 'slotId',
                    as: 'booking'
                }
            },
            {
                $unwind: {
                    path: '$booking',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'booking.memberId',
                    foreignField: '_id',
                    as: 'student'
                }
            },
            {
                $unwind: {
                    path: '$student',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    'student.password': 0,
                    'student.firebaseUid': 0,
                    'student.role': 0
                }
            },
            { $sort: { date: -1, startTime: -1 } }
        ]).toArray();

        res.status(200).json({
            status: 'success',
            results: slots.length,
            data: {
                slots
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching management slots',
            error: error.message
        });
    }
};

// @desc    Get single slot
// @route   GET /api/slots/:id
// @access  Private
exports.getSlot = async (req, res) => {
    try {
        const db = getDb();
        const slot = await db.collection('slots').findOne({ _id: new ObjectId(req.params.id) });

        if (!slot) {
            return res.status(404).json({
                status: 'error',
                message: 'Slot not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                slot
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching slot',
            error: error.message
        });
    }
};

// @desc    Update slot
// @route   PATCH /api/slots/:id
// @access  Private/Trainer
exports.updateSlot = async (req, res) => {
    try {
        const db = getDb();
        const userId = new ObjectId(req.user._id);

        // Find the trainer profile
        const trainer = await db.collection('trainers').findOne({ userId });

        if (!trainer) {
            return res.status(404).json({
                status: 'error',
                message: 'Trainer profile not found'
            });
        }

        const slot = await db.collection('slots').findOne({ _id: new ObjectId(req.params.id) });

        if (!slot) {
            return res.status(404).json({
                status: 'error',
                message: 'Slot not found'
            });
        }

        // Check if slot belongs to the trainer
        if (slot.trainerId.toString() !== trainer._id.toString()) {
            return res.status(403).json({
                status: 'error',
                message: 'You are not authorized to update this slot'
            });
        }

        // Optional: Block update if already booked (depending on requirements)
        if (slot.status === 'booked') {
            return res.status(400).json({
                status: 'error',
                message: 'Cannot edit a booked slot'
            });
        }

        const updates = {
            ...req.body,
            updatedAt: new Date()
        };

        // Convert classId to ObjectId if present
        if (updates.classId) {
            updates.classId = new ObjectId(updates.classId);
        }

        // Handle date conversion if present
        if (updates.date) {
            updates.date = new Date(updates.date);
        }

        const result = await db.collection('slots').findOneAndUpdate(
            { _id: new ObjectId(req.params.id) },
            { $set: updates },
            { returnDocument: 'after' }
        );

        res.status(200).json({
            status: 'success',
            data: {
                slot: result
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error updating slot',
            error: error.message
        });
    }
};

// @desc    Delete slot
// @route   DELETE /api/slots/:id
// @access  Private/Trainer
exports.deleteSlot = async (req, res) => {
    try {
        const db = getDb();
        const slot = await db.collection('slots').findOne({ _id: new ObjectId(req.params.id) });

        if (!slot) {
            return res.status(404).json({
                status: 'error',
                message: 'Slot not found'
            });
        }

        if (slot.status === 'booked') {
            return res.status(400).json({
                status: 'error',
                message: 'Cannot delete a booked slot'
            });
        }

        await db.collection('slots').deleteOne({ _id: new ObjectId(req.params.id) });

        res.status(200).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error deleting slot',
            error: error.message
        });
    }
};
