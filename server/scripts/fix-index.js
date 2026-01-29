require('dotenv').config({ path: '../.env' });
const { MongoClient } = require('mongodb');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function fixIndex() {
    try {
        await client.connect();
        const db = client.db(process.env.DB_NAME || 'FitnessTrackerDB');
        console.log('Connected to DB');

        const collection = db.collection('users');

        // Check existing indexes
        const indexes = await collection.indexes();
        console.log('Existing indexes:', indexes);

        // Try to drop firebaseUid index if it exists (it might be named differently, usually firebaseUid_1)
        try {
            await collection.dropIndex('firebaseUid_1');
            console.log('Dropped firebaseUid_1 index');
        } catch (e) {
            console.log('Index firebaseUid_1 might not exist or failed to drop:', e.message);
        }

        // Create sparse index
        await collection.createIndex({ firebaseUid: 1 }, { unique: true, sparse: true });
        console.log('Created sparse unique index on firebaseUid');

        console.log('Index fix complete');
    } catch (err) {
        console.error('Error fixing index:', err);
    } finally {
        await client.close();
    }
}

fixIndex();
