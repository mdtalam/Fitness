const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || 'FitnessTrackerDB';

if (!uri) {
    console.error('❌ ERROR: MONGODB_URI is not defined in environment variables.');
}

let cachedClient = null;
let cachedDb = null;

const connectDB = async () => {
    // If we have a cached connection, use it
    if (cachedDb) {
        return cachedDb;
    }

    if (!uri) {
        throw new Error('MONGODB_URI is missing. Please set it in your environment variables.');
    }

    try {
        console.log('📡 Connecting to MongoDB Atlas...');
        
        // Setup client if not already created
        if (!cachedClient) {
            cachedClient = new MongoClient(uri, {
                connectTimeoutMS: 10000,
                socketTimeoutMS: 45000,
            });
        }

        await cachedClient.connect();
        cachedDb = cachedClient.db(dbName);
        
        console.log('✅ MongoDB Connected Successfully');
        return cachedDb;
    } catch (err) {
        console.error('❌ MongoDB Connection Failure:', err.message);
        // Clear cache on failure to allow retry
        cachedClient = null;
        cachedDb = null;
        throw err;
    }
};

const getDb = () => {
    if (!cachedDb) {
        throw new Error('Database not initialized. Make sure connectDB() was called and awaited.');
    }
    return cachedDb;
};

module.exports = { connectDB, getDb };
