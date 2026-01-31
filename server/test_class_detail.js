const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testClassApi() {
    try {
        console.log('Fetching all classes...');
        const listResponse = await axios.get(`${API_URL}/classes`);

        if (!listResponse.data.data.classes || listResponse.data.data.classes.length === 0) {
            console.log('No classes found to test details with.');
            return;
        }

        const firstClass = listResponse.data.data.classes[0];
        console.log(`Found class: ${firstClass.name}, ID: ${firstClass._id}`);

        console.log(`Fetching details for class ID: ${firstClass._id}...`);
        try {
            const detailResponse = await axios.get(`${API_URL}/classes/${firstClass._id}`);
            console.log('Detail response status:', detailResponse.status);
            console.log('Detail data:', JSON.stringify(detailResponse.data.data.class, null, 2));
        } catch (detailError) {
            console.error('Error fetching class detail:', detailError.response ? detailError.response.data : detailError.message);
        }

    } catch (error) {
        console.error('Error in test:', error.response ? error.response.data : error.message);
    }
}

testClassApi();
