const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');

// @desc    Get all classes
// @route   GET /api/classes
// @access  Public
exports.getClasses = async (req, res) => {
    try {
        const db = getDb();

        const classes = await db.collection('classes').aggregate([
            { $match: { isActive: true } },
            {
                $lookup: {
                    from: 'trainers',
                    let: { trainersIds: { $ifNull: ['$trainers', []] } },
                    pipeline: [
                        { $match: { $expr: { $in: ['$_id', '$$trainersIds'] } } },
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'userId',
                                foreignField: '_id',
                                as: 'userInfo'
                            }
                        },
                        {
                            $unwind: {
                                path: '$userInfo',
                                preserveNullAndEmptyArrays: true
                            }
                        },
                        {
                            $addFields: {
                                name: '$userInfo.name',
                                photoURL: '$userInfo.photoURL'
                            }
                        },
                        { $project: { userInfo: 0 } }
                    ],
                    as: 'trainersDetails'
                }
            },
            { $sort: { bookingCount: -1 } }
        ]).toArray();

        // Map back to expected structure
        const formattedClasses = classes.map(c => ({
            ...c,
            trainers: c.trainersDetails
        }));

        res.status(200).json({
            status: 'success',
            results: formattedClasses.length,
            data: {
                classes: formattedClasses
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching classes',
            error: error.message
        });
    }
};

// @desc    Get single class
// @route   GET /api/classes/:id
// @access  Public
exports.getClass = async (req, res) => {
    try {
        const db = getDb();
        const classItem = await db.collection('classes').aggregate([
            { $match: { _id: new ObjectId(req.params.id) } },
            {
                $lookup: {
                    from: 'trainers',
                    let: { trainersIds: { $ifNull: ['$trainers', []] } },
                    pipeline: [
                        { $match: { $expr: { $in: ['$_id', '$$trainersIds'] } } },
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'userId',
                                foreignField: '_id',
                                as: 'userInfo'
                            }
                        },
                        {
                            $unwind: {
                                path: '$userInfo',
                                preserveNullAndEmptyArrays: true
                            }
                        },
                        {
                            $addFields: {
                                name: '$userInfo.name',
                                photoURL: '$userInfo.photoURL'
                            }
                        },
                        { $project: { userInfo: 0 } }
                    ],
                    as: 'trainers'
                }
            }
        ]).next();

        if (!classItem) {
            return res.status(404).json({
                status: 'error',
                message: 'Class not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                class: classItem
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching class',
            error: error.message
        });
    }
};

// @desc    Create new class (Admin only stub)
// @route   POST /api/classes
// @access  Private/Admin
exports.createClass = async (req, res) => {
    try {
        const db = getDb();
        const newClassData = {
            ...req.body,
            isActive: true, // Default to active
            bookingCount: 0, // Default to 0 bookings
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Convert trainers to ObjectIds if they are strings
        if (newClassData.trainers && Array.isArray(newClassData.trainers)) {
            newClassData.trainers = newClassData.trainers.map(id =>
                typeof id === 'string' ? new ObjectId(id) : id
            );
        }

        const result = await db.collection('classes').insertOne(newClassData);
        const savedClass = { _id: result.insertedId, ...newClassData };

        res.status(201).json({
            status: 'success',
            data: {
                class: savedClass
            }
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error creating class',
            error: error.message
        });
    }
};

// @desc    Update class
// @route   PUT /api/classes/:id
// @access  Private/Admin
exports.updateClass = async (req, res) => {
    try {
        const db = getDb();
        const updates = { ...req.body, updatedAt: new Date() };
        delete updates._id; // Prevent updating _id

        // Convert trainers to ObjectIds if they are strings
        if (updates.trainers && Array.isArray(updates.trainers)) {
            updates.trainers = updates.trainers.map(id =>
                typeof id === 'string' ? new ObjectId(id) : id
            );
        }

        const result = await db.collection('classes').findOneAndUpdate(
            { _id: new ObjectId(req.params.id) },
            { $set: updates },
            { returnDocument: 'after' }
        );

        if (!result) {
            return res.status(404).json({
                status: 'error',
                message: 'Class not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                class: result
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error updating class',
            error: error.message
        });
    }
};

// @desc    Delete class
// @route   DELETE /api/classes/:id
// @access  Private/Admin
exports.deleteClass = async (req, res) => {
    try {
        const db = getDb();
        const result = await db.collection('classes').deleteOne({
            _id: new ObjectId(req.params.id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Class not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error deleting class',
            error: error.message
        });
    }
};
