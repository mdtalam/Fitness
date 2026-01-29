const axios = require('axios');

async function testSingle() {
    console.log('📡 Testing http://localhost:5000/api/trainers ...');
    try {
        const res = await axios.get('http://localhost:5000/api/trainers');
        console.log('--- SUCCESS ---');
        console.log('STATUS:', res.status);
        console.log('BODY:', JSON.stringify(res.data, null, 2));
    } catch (err) {
        console.log('--- FAILURE ---');
        if (err.response) {
            console.log('STATUS:', err.response.status);
            console.log('BODY:', JSON.stringify(err.response.data, null, 2));
        } else {
            console.log('MESSAGE:', err.message);
        }
    }
}

testSingle();
