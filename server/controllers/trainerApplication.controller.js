const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');

// @desc    Apply to be a trainer
// @route   POST /api/trainers/apply
// @access  Private/Member
exports.applyToBeTrainer = async (req, res) => {
    try {
        const db = getDb();

        // Check if application already exists
        const existingApp = await db.collection('trainerapplications').findOne({
            userId: new ObjectId(req.user._id),
            status: { $in: ['pending', 'rejected'] }
        }, { sort: { updatedAt: -1 } });

        if (existingApp) {
            if (existingApp.status === 'pending') {
                return res.status(400).json({
                    status: 'error',
                    message: 'You already have a pending application'
                });
            }

            if (existingApp.status === 'rejected') {
                const rejectionDate = new Date(existingApp.updatedAt);
                const oneMonthLater = new Date(rejectionDate.getTime());
                oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

                if (new Date() < oneMonthLater) {
                    const nextAvailableDate = oneMonthLater.toLocaleDateString();
                    return res.status(403).json({
                        status: 'error',
                        message: `Your previous application was rejected. You can apply again after ${nextAvailableDate}.`
                    });
                }
            }
        }

        const applicationData = {
            ...req.body,
            userId: new ObjectId(req.user._id),
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection('trainerapplications').insertOne(applicationData);
        const savedApplication = { _id: result.insertedId, ...applicationData };

        res.status(201).json({
            status: 'success',
            data: {
                application: savedApplication
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error submitting application',
            error: error.message
        });
    }
};

// @desc    Get current user's application
// @route   GET /api/trainers/my-application
// @access  Private
exports.getMyApplication = async (req, res) => {
    try {
        const db = getDb();
        const application = await db.collection('trainerapplications').findOne({
            userId: new ObjectId(req.user._id)
        });

        res.status(200).json({
            status: 'success',
            data: {
                application
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching application',
            error: error.message
        });
    }
};

// @desc    Get single application (Admin)
// @route   GET /api/trainers/applications/:id
// @access  Private/Admin
exports.getApplication = async (req, res) => {
    try {
        const db = getDb();
        const application = await db.collection('trainerapplications').findOne({
            _id: new ObjectId(req.params.id)
        });

        if (!application) {
            return res.status(404).json({
                status: 'error',
                message: 'Application not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                application
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching application',
            error: error.message
        });
    }
};

// @desc    Get all applications (Admin)
// @route   GET /api/trainers/applications
// @access  Private/Admin
exports.getApplications = async (req, res) => {
    try {
        console.log('📡 GET /api/trainers/applications - Hit at:', new Date().toISOString());
        const db = getDb();
        const applications = await db.collection('trainerapplications')
            .find()
            .sort({ createdAt: -1 })
            .toArray();

        res.status(200).json({
            status: 'success',
            results: applications.length,
            data: {
                applications
            }
        });
    } catch (error) {
        console.error('Error fetching applications:', error.message);
        const isDbError = error.message.includes('Database not initialized');

        // Development Mock Fallback if DB is disconnected
        if (isDbError) {
            console.log('📡 INFO: Providing Mock Applications for development (DB Offline)');
            const mockApps = [
                {
                    _id: 'mock_1',
                    fullName: 'Alex Johnson',
                    email: 'alex.fitness@example.com',
                    profileImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200',
                    skills: ['Strength', 'HIIT', 'Nutrition'],
                    yearsOfExperience: 8,
                    experience: 8, // Support both field names
                    age: 32,
                    bio: 'Passionate about body transformations and clean eating. Certified NASM trainer with a decade of experience.',
                    status: 'pending',
                    availableDays: ['Monday', 'Wednesday', 'Friday'],
                    availableTime: '06:00 AM - 12:00 PM'
                },
                {
                    _id: 'mock_2',
                    fullName: 'Sarah Miller',
                    email: 'sarah.yoga@example.com',
                    profileImage: 'https://images.unsplash.com/photo-1518611012118-296538b77627?auto=format&fit=crop&q=80&w=200',
                    skills: ['Yoga', 'Pilates'],
                    yearsOfExperience: 5,
                    experience: 5,
                    age: 27,
                    bio: 'Mindfulness and movement expert. I specialize in restorative yoga and injury prevention.',
                    status: 'pending',
                    availableDays: ['Tuesday', 'Thursday'],
                    availableTime: '04:00 PM - 08:00 PM'
                }
            ];
            return res.status(200).json({
                status: 'success',
                results: mockApps.length,
                data: { applications: mockApps },
                isMock: true
            });
        }

        res.status(500).json({
            status: 'error',
            message: 'Error fetching applications',
            error: error.message
        });
    }
};

// @desc    Handle application (Approve/Reject)
// @route   PATCH /api/trainers/applications/:id
// @access  Private/Admin
exports.handleApplication = async (req, res) => {
    try {
        const db = getDb();
        const { status, adminFeedback } = req.body;
        const application = await db.collection('trainerapplications').findOne({ _id: new ObjectId(req.params.id) });

        if (!application) {
            return res.status(404).json({ status: 'error', message: 'Application not found' });
        }

        await db.collection('trainerapplications').updateOne(
            { _id: new ObjectId(req.params.id) },
            {
                $set: {
                    status,
                    adminFeedback: adminFeedback || '',
                    updatedAt: new Date()
                }
            }
        );

        if (status === 'approved') {
            // Create Trainer profile
            await db.collection('trainers').insertOne({
                userId: application.userId,
                bio: application.bio,
                experience: application.experience,
                skills: application.skills,
                isApproved: true,
                approvedAt: new Date(),
                approvedBy: new ObjectId(req.user._id),
                createdAt: new Date(),
                updatedAt: new Date()
            });

            // Update User role
            await db.collection('users').updateOne(
                { _id: application.userId },
                { $set: { role: 'trainer', updatedAt: new Date() } }
            );
        }

        res.status(200).json({
            status: 'success',
            data: {
                application: { ...application, status, adminFeedback }
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error handling application',
            error: error.message
        });
    }
};
