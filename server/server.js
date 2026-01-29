require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const trainerRoutes = require('./routes/trainer.routes');
const classRoutes = require('./routes/class.routes');
const slotRoutes = require('./routes/slot.routes');
const bookingRoutes = require('./routes/booking.routes');
const forumRoutes = require('./routes/forum.routes');
const adminRoutes = require('./routes/admin.routes');
const newsletterRoutes = require('./routes/newsletter.routes');
const paymentRoutes = require('./routes/payment.routes');

// Initialize express app
const app = express();

// Middleware
const allowedOrigins = [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5173' // Explicitly add both common Vite ports
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path} ${res.statusCode} (${duration}ms)`);
    });
    next();
});

// Basic routes
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Welcome to the Fitness Tracker API',
        endpoints: {
            health: '/health',
            api: '/api'
        },
        version: '1.0.0'
    });
});

app.get('/api', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Fitness Tracker API Base',
        availableRoutes: [
            '/api/auth',
            '/api/users',
            '/api/trainers',
            '/api/classes',
            '/api/slots',
            '/api/bookings',
            '/api/forum',
            '/api/admin',
            '/api/newsletter',
            '/api/payment'
        ]
    });
});

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Fitness Tracker API is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/payment', paymentRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Route not found: ${req.method} ${req.path}`,
        suggestion: 'Check the URL and try again'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('❌ SERVER ERROR:', err.message);
    if (err.stack) console.error(err.stack);

    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// MongoDB Connection logic moved to config/db.js

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Connect to DB first
        await connectDB();

        // Then start listening
        app.listen(PORT, () => {
            console.log(`🚀 Server: http://localhost:${PORT}`);
            console.log(`💡 Test the API: http://localhost:${PORT}/health`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err.message);
        process.exit(1);
    }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});
