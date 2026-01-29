const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

const bcrypt = require('bcryptjs');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { email, password, name, photoURL, role } = req.body;
        const db = getDb();

        // Validation
        if (!email || !password || !name) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide email, password, and name'
            });
        }

        // Validate role
        const validRoles = ['member', 'trainer', 'admin'];
        const userRole = role && validRoles.includes(role) ? role : 'member';

        // Security: Prevent multiple admins
        if (userRole === 'admin') {
            const adminExists = await db.collection('users').findOne({ role: 'admin' });
            if (adminExists) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Registration Failed: Only one Administrator account is allowed. Please contact support if you believe this is an error.'
                });
            }
        }

        // Check if user already exists
        let user = await db.collection('users').findOne({ email });

        if (user) {
            return res.status(400).json({
                status: 'error',
                message: 'User already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = {
            email,
            password: hashedPassword,
            name,
            photoURL: photoURL || '',
            role: userRole,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection('users').insertOne(newUser);
        const savedUser = { _id: result.insertedId, ...newUser };

        // Generate token
        const token = generateToken(savedUser._id);

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            data: {
                user: {
                    id: savedUser._id,
                    email: savedUser.email,
                    name: savedUser.name,
                    photoURL: savedUser.photoURL,
                    role: savedUser.role
                },
                token
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error registering user',
            error: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password, firebaseUid, name, photoURL, isGoogle } = req.body;
        const db = getDb();

        // Validation
        if (!email) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide email'
            });
        }

        // Find user
        let user = await db.collection('users').findOne({ email });

        // Method 1: Google Login (Firebase)
        if (isGoogle || firebaseUid) {
            if (user) {
                // Update existing user with Google info if needed (optional)
                if (!user.firebaseUid && firebaseUid) {
                    await db.collection('users').updateOne(
                        { _id: user._id },
                        { $set: { firebaseUid, updatedAt: new Date() } }
                    );
                    user.firebaseUid = firebaseUid;
                }
            } else {
                // Create new user from Google login
                const newUser = {
                    email,
                    firebaseUid,
                    name: name || 'Google User',
                    photoURL: photoURL || '',
                    role: 'member',
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    isGoogleAccount: true
                };
                const result = await db.collection('users').insertOne(newUser);
                user = { _id: result.insertedId, ...newUser };
            }
        }
        // Method 2: Standard Login
        else {
            if (!password) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Please provide password'
                });
            }

            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Invalid credentials'
                });
            }

            // Check if user is a Google-only account (no password)
            if (user.isGoogleAccount && !user.password) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Please login with Google'
                });
            }

            // Verify password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid credentials'
                });
            }
        }

        if (!user.isActive) {
            return res.status(403).json({
                status: 'error',
                message: 'Your account has been deactivated'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    photoURL: user.photoURL,
                    role: user.role
                },
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error logging in',
            error: error.message
        });
    }
};

// @desc    Verify token
// @route   POST /api/auth/verify-token
// @access  Private
exports.verifyToken = async (req, res) => {
    try {
        res.status(200).json({
            status: 'success',
            message: 'Token is valid',
            data: {
                user: {
                    id: req.user._id,
                    firebaseUid: req.user.firebaseUid,
                    email: req.user.email,
                    name: req.user.name,
                    photoURL: req.user.photoURL,
                    role: req.user.role
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error verifying token',
            error: error.message
        });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
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
                user
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching user data',
            error: error.message
        });
    }
};
