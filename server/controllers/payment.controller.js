const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');
const stripe = process.env.STRIPE_SECRET_KEY ? require('stripe')(process.env.STRIPE_SECRET_KEY) : null;

if (stripe) {
    console.log('✅ Stripe initialized successfully on the backend.');
} else {
    console.error('❌ Stripe initialization failed: STRIPE_SECRET_KEY is missing.');
}

// @desc    Create payment intent
// @route   POST /api/payments/create-payment-intent
// @access  Private
exports.createPaymentIntent = async (req, res) => {
    try {
        const { amount, packageType } = req.body;
        console.log('💳 Payment Intent Request:', { amount, packageType, user: req.user?._id });

        if (!stripe) {
            console.error('❌ STRIPE_ERROR: STRIPE_SECRET_KEY is missing in server/.env');
            return res.status(500).json({
                status: 'error',
                message: 'Stripe Secret Key is missing on the server. Please add STRIPE_SECRET_KEY to server/.env'
            });
        }

        if (!amount) {
            return res.status(400).json({ status: 'error', message: 'Amount is required' });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // convert to cents
            currency: 'usd',
            payment_method_types: ['card'],
            metadata: { packageType, userId: req.user._id.toString() }
        });

        console.log('✅ Payment Intent Created:', paymentIntent.id);

        res.status(200).json({
            status: 'success',
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        console.error('❌ Payment Intent Error:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Stripe Error: ' + error.message,
            error: error.message
        });
    }
};

// @desc    Save booking after successful payment
// @route   POST /api/payments/confirm-booking
// @access  Private
exports.confirmBooking = async (req, res) => {
    try {
        const db = getDb();
        const { trainerId, slotId, packageType, amount, paymentId } = req.body;

        // 1. Fetch slot to get classId
        const slot = await db.collection('slots').findOne({ _id: new ObjectId(slotId) });

        if (!slot) {
            return res.status(404).json({ status: 'error', message: 'Slot not found' });
        }

        // 2. Create booking record
        const booking = {
            memberId: new ObjectId(req.user._id),
            trainerId: new ObjectId(trainerId),
            slotId: new ObjectId(slotId),
            packageType,
            amount: parseFloat(amount),
            paymentId,
            paymentStatus: 'completed',
            bookingDate: new Date(),
            status: 'upcoming',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection('bookings').insertOne(booking);
        const savedBooking = { _id: result.insertedId, ...booking };

        // 3. Update slot status
        await db.collection('slots').updateOne(
            { _id: new ObjectId(slotId) },
            { $set: { status: 'booked', isBooked: true, updatedAt: new Date() } }
        );

        // 4. Increase Booking count of class
        if (slot.classId) {
            await db.collection('classes').updateOne(
                { _id: new ObjectId(slot.classId) },
                { $inc: { bookingCount: 1 }, $set: { updatedAt: new Date() } }
            );
        }

        // 5. Create transaction record
        const trainer = await db.collection('trainers').aggregate([
            { $match: { _id: new ObjectId(trainerId) } },
            { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' }
        ]).next();

        const transaction = {
            bookingId: savedBooking._id,
            memberId: new ObjectId(req.user._id),
            memberName: req.user.name,
            memberEmail: req.user.email,
            trainerId: new ObjectId(trainerId),
            trainerName: trainer?.user?.name || 'Trainer',
            amount: parseFloat(amount),
            currency: 'USD',
            packageType,
            stripePaymentId: paymentId,
            status: 'success',
            paymentMethod: 'card',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await db.collection('transactions').insertOne(transaction);

        res.status(201).json({
            status: 'success',
            data: {
                booking: savedBooking,
                transaction: transaction
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error confirming booking',
            error: error.message
        });
    }
};
// @desc    Get Admin Stats (Balance, Transactions, Chart Data)
// @route   GET /api/payments/admin-stats
// @access  Private (Admin)
exports.getAdminStats = async (req, res) => {
    try {
        const db = getDb();

        // 1. Calculate Total Balance
        const totalBalanceData = await db.collection('transactions').aggregate([
            { $match: { status: 'success' } }, // Only count successful transactions
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]).next();

        const totalBalance = totalBalanceData ? totalBalanceData.total : 0;

        // 2. Fetch Last 6 Transactions
        const lastTransactions = await db.collection('transactions')
            .find({ status: 'success' })
            .sort({ createdAt: -1 })
            .limit(6)
            .toArray();

        // 3. Count Newsletter Subscribers
        const newsletterSubscribersCount = await db.collection('newsletters').countDocuments();

        // 4. Count Paid Members (Unique members who have made a payment)
        const paidMembersList = await db.collection('transactions')
            .distinct('memberId', { status: 'success' });

        const paidMembersCount = paidMembersList.length;

        // Construct chart data structure
        const chartData = [
            { name: 'Newsletter Subscribers', value: newsletterSubscribersCount },
            { name: 'Paid Members', value: paidMembersCount }
        ];

        res.status(200).json({
            status: 'success',
            data: {
                totalBalance,
                lastTransactions,
                chartData,
                newsletterSubscribersCount,
                paidMembersCount
            }
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching admin stats',
            error: error.message
        });
    }
};
