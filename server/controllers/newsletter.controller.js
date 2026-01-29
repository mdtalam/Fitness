const { getDb } = require('../config/db');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
exports.subscribe = async (req, res) => {
    try {
        const { email, name } = req.body;
        const db = getDb();

        if (!email) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide an email address'
            });
        }

        // Check if already subscribed
        const existingSubscriber = await db.collection('newsletters').findOne({ email });
        if (existingSubscriber) {
            return res.status(400).json({
                status: 'error',
                message: 'You are already subscribed to our newsletter'
            });
        }

        // Create new subscriber
        const subscriber = {
            email,
            name,
            subscribedAt: new Date()
        };

        await db.collection('newsletters').insertOne(subscriber);

        res.status(201).json({
            status: 'success',
            message: 'Successfully subscribed to newsletter',
            data: {
                subscriber
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error subscribing to newsletter',
            error: error.message
        });
    }
};

// @desc    Get all newsletter subscribers
// @route   GET /api/newsletter
// @access  Private (Admin)
exports.getAllSubscribers = async (req, res) => {
    try {
        const db = getDb();
        const subscribers = await db.collection('newsletters').find({}).sort({ subscribedAt: -1 }).toArray();

        res.status(200).json({
            status: 'success',
            results: subscribers.length,
            data: {
                subscribers
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching subscribers',
            error: error.message
        });
    }
};
