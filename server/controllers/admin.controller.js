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

        // 5. Revenue (Mock logic for now, or sum payments)
        const totalRevenue = 12450;

        res.status(200).json({
            status: 'success',
            data: {
                stats: {
                    totalUsers,
                    totalTrainers,
                    totalClasses,
                    totalPendingApplications,
                    totalRevenue
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
