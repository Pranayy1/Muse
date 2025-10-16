const axios = require('axios');

async function testAPI() {
  console.log('Starting API tests...\n');
  
  // Test 1: Health endpoint
  try {
    console.log('Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:5000/api/health', { timeout: 5000 });
    console.log('✅ Health check successful:', healthResponse.data);
  } catch (error) {
    console.error('❌ Health endpoint failed:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data
    });
    return; // Stop if health check fails
  }
  
  // Test 2: Search endpoint
  try {
    console.log('\nTesting search endpoint...');
    const searchResponse = await axios.get('http://localhost:5000/api/search?q=hello&maxResults=3', { timeout: 10000 });
    console.log('✅ Search results:', JSON.stringify(searchResponse.data, null, 2));
  } catch (error) {
    console.error('❌ Search endpoint failed:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data
    });
  }
  
  // Test 3: Trending endpoint
  try {
    console.log('\nTesting trending endpoint...');
    const trendingResponse = await axios.get('http://localhost:5000/api/trending?maxResults=3', { timeout: 15000 });
    console.log('✅ Trending results:', JSON.stringify(trendingResponse.data, null, 2));
  } catch (error) {
    console.error('❌ Trending endpoint failed:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data
    });
  }
}

testAPI();