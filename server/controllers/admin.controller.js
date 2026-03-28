const { getDb } = require('../config/db');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin only)
exports.getStats = async (req, res) => {
    try {
        const db = getDb();

        // 1. Total Users
        const totalUsers = await db.collection('users').countDocuments({ role: 'member' });

        // 2. Total Trainers
        const totalTrainers = await db.collection('trainers').countDocuments({ isApproved: true });

        // 3. Total Classes (if collection exists, else mock)
        // Assuming 'classes' collection
        const totalClasses = await db.collection('classes').countDocuments({});

        // 4. Pending Applications
        const totalPendingApplications = await db.collection('trainerapplications').countDocuments({ status: 'pending' });

        // 5. Total Revenue (Dynamically calculated from transactions)
        const totalRevenueData = await db.collection('transactions').aggregate([
            { $match: { status: 'success' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]).next();
        const totalRevenue = totalRevenueData ? totalRevenueData.total : 0;

        // 6. Monthly Revenue Chart (Last 6 Months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1); // Start of the month
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const revenueChartData = await db.collection('transactions').aggregate([
            {
                $match: {
                    status: 'success',
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    total: { $sum: '$amount' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]).toArray();

        // Format for Recharts (e.g., "Jan", "Feb")
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const revenueChart = revenueChartData.map(item => ({
            name: monthNames[item._id.month - 1],
            value: item.total
        }));

        res.status(200).json({
            status: 'success',
            data: {
                stats: {
                    totalUsers,
                    totalTrainers,
                    totalClasses,
                    totalPendingApplications,
                    totalRevenue,
                    revenueChart // Added chart data
                }
            }
        });
    } catch (error) {
        console.error('Admin stats error:', error.message);
        const isDbError = error.message.includes('Database not initialized');

        if (isDbError) {
            console.log('📡 INFO: Providing Mock Stats for development (DB Offline)');
            return res.status(200).json({
                status: 'success',
                data: {
                    stats: {
                        totalUsers: 142,
                        totalTrainers: 12,
                        totalClasses: 8,
                        totalPendingApplications: 2, // Matches mock applications above
                        totalRevenue: 12450
                    }
                },
                isMock: true
            });
        }

        res.status(500).json({
            status: 'error',
            message: 'Error fetching admin stats',
            error: error.message
        });
    }
};
