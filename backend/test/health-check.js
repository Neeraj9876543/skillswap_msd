const axios = require('axios');

async function testBackendConnection() {
  try {
    const response = await axios.get('http://localhost:5000/health');
    console.log('✅ Backend health check successful:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Backend health check failed:', error.message);
    return false;
  }
}

testBackendConnection();