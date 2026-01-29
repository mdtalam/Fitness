require('dotenv').config();
const { MongoClient } = require('mongodb');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

async function checkData() {
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        const db = client.db('FitnessTrackerDB');

        console.log('--- Database Check ---');
        const collections = await db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));

        if (collections.find(c => c.name === 'newsletters')) {
            const count = await db.collection('newsletters').countDocuments();
            console.log('Newsletter count:', count);
            const latest = await db.collection('newsletters').find().sort({ subscribedAt: -1 }).limit(1).toArray();
            console.log('Latest subscriber:', latest[0]);
        } else {
            console.log('❌ newsletters collection does not exist');
        }

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.close();
    }
}

checkData();
