const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        const db = getDb();
        const user = await db.collection('users').findOne({ _id: new ObjectId(req.user._id) });

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    photoURL: user.photoURL,
                    createdAt: user.createdAt
                }
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching profile'
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const { name, photoURL } = req.body;
        const db = getDb();

        const updateFields = {};
        if (name) updateFields.name = name;
        if (photoURL) updateFields.photoURL = photoURL;
        updateFields.updatedAt = new Date();

        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(req.user._id) },
            { $set: updateFields }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Fetch updated user
        const updatedUser = await db.collection('users').findOne({ _id: new ObjectId(req.user._id) });

        res.status(200).json({
            status: 'success',
            message: 'Profile updated successfully',
            data: {
                user: {
                    id: updatedUser._id,
                    email: updatedUser.email,
                    name: updatedUser.name,
                    role: updatedUser.role,
                    photoURL: updatedUser.photoURL
                }
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error updating profile'
        });
    }
};

// @desc    Change user password
// @route   PUT /api/users/change-password
// @access  Private
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const db = getDb();

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide current and new password'
            });
        }

        const user = await db.collection('users').findOne({ _id: new ObjectId(req.user._id) });

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Check if user is Google-only
        if (user.isGoogleAccount && !user.password) {
            return res.status(400).json({
                status: 'error',
                message: 'You are logged in with Google. Please use Google to manage your account security.'
            });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                status: 'error',
                message: 'Incorrect current password'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        await db.collection('users').updateOne(
            { _id: user._id },
            {
                $set: {
                    password: hashedPassword,
                    updatedAt: new Date()
                }
            }
        );

        res.status(200).json({
            status: 'success',
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error changing password'
        });
    }
};
