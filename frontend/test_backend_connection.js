// Test backend connection
const testBackend = async () => {
  try {
    console.log('Testing backend connection...');
    
    // Test basic health endpoint
    const healthResponse = await fetch('http://localhost:8000/api/health');
    console.log('Health endpoint status:', healthResponse.status);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('Health data:', healthData);
    }
    
    // Test auth endpoints
    const authResponse = await fetch('http://localhost:8000/api/auth/me', {
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });
    console.log('Auth endpoint status:', authResponse.status);
    
  } catch (error) {
    console.error('Backend connection failed:', error.message);
    console.log('Make sure your backend is running on http://localhost:8000');
  }
};

// Run the test
testBackend(); 