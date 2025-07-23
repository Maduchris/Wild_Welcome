// Simple booking test - Run this in browser console
// Make sure you're logged in first

async function testSimpleBooking() {
  const API_BASE_URL = 'http://localhost:8000/api';
  const token = localStorage.getItem('token');
  
  console.log('Token:', token ? 'exists' : 'missing');
  console.log('User:', localStorage.getItem('user'));
  
  const bookingData = {
    property_id: "6880d6e8e2cf81af45013198",
    check_in: new Date().toISOString(),
    check_out: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days later
    guests: 1,
    total_price: 100.0,
    special_requests: "Test booking"
  };
  
  console.log('Creating booking with:', bookingData);
  
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookingData)
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return;
    }
    
    const result = await response.json();
    console.log('Booking created:', result);
    
    // Now fetch user bookings
    console.log('\n--- Fetching user bookings ---');
    const bookingsResponse = await fetch(`${API_BASE_URL}/bookings`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Bookings response status:', bookingsResponse.status);
    
    if (bookingsResponse.ok) {
      const bookings = await bookingsResponse.json();
      console.log('User bookings:', bookings);
      console.log('Number of bookings:', bookings.length);
    } else {
      const errorText = await bookingsResponse.text();
      console.error('Error fetching bookings:', errorText);
    }
    
  } catch (error) {
    console.error('Request failed:', error);
  }
}

// Run the test
testSimpleBooking();