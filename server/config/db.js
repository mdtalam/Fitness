const { MongoClient } = require('mongodb');
const dns = require('dns');

// Attempt to force Google DNS but don't crash if it fails
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
    console.warn('⚠️ Note: Could not override DNS servers. Using system defaults.');
}

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4
});

let db;

const connectDB = async () => {
    try {
        console.log('📡 Connecting to:', uri.replace(/:([^@]+)@/, ':****@'));
        await client.connect();
        db = client.db(process.env.DB_NAME || 'FitnessTrackerDB');
        console.log('✅ MongoDB Connected Successfully');
        return db;
    } catch (err) {
        console.error('❌ MongoDB Connection Failure:', err.message);
        if (err.message.includes('ECONNREFUSED')) {
            console.error('📡 DIAGNOSTIC: Connection refused. Usually means your IP is not whitelisted in Atlas or Port 27017/DNS is blocked.');
        }
        // Do not throw to allow server to start, but db will be null
    }
};

const getDb = () => {
    if (!db) {
        throw new Error('Database not initialized. Ensure your IP is whitelisted in MongoDB Atlas and the server log shows "Connected Successfully".');
    }
    return db;
};

module.exports = { connectDB, getDb, client };
