// Test frontend booking flow with same data structure as frontend
const API_BASE_URL = 'http://localhost:8000/api';

async function simulateFrontendBooking() {
  console.log('=== Testing Frontend Booking Flow ===\n');
  
  // Step 1: Login (simulate user login)
  console.log('1. Logging in user...');
  const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'testuser@example.com',
      password: 'password123'
    })
  });
  
  const loginData = await loginResponse.json();
  const token = loginData.access_token;
  
  if (!token) {
    console.error('❌ Login failed');
    return;
  }
  console.log('✅ Login successful');
  
  // Step 2: Simulate BookingFlow.js booking submission
  console.log('\n2. Creating booking via frontend flow...');
  
  const listingId = '688113ca838474be3f355ebc'; // Use different property to avoid conflicts
  
  // This simulates the data structure from BookingFlow.js handleBookingComplete
  const moveInDate = new Date('2025-09-01T00:00:00.000Z'); // After existing booking ends
  const leaseDuration = '3-months'; // Shorter lease to avoid conflicts
  let checkOutDate = new Date(moveInDate);
  checkOutDate.setMonth(checkOutDate.getMonth() + 3); // Add 3 months
  
  const frontendBookingData = {
    property_id: listingId,
    check_in: moveInDate.toISOString(),
    check_out: checkOutDate.toISOString(),
    guests: 1,
    total_price: 100.0,
    special_requests: 'Applicant: Test User\\nPhone: 123-456-7890\\nEmployer: Test Company\\nJob: Software Developer\\nIncome: $5000\\nLease: 12-months\\n\\nAbout: Test booking via frontend simulation'
  };
  
  console.log('Booking data being sent:', JSON.stringify(frontendBookingData, null, 2));
  
  const bookingResponse = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(frontendBookingData)
  });
  
  console.log('Response status:', bookingResponse.status);
  
  if (!bookingResponse.ok) {
    const errorText = await bookingResponse.text();
    console.error('❌ Booking creation failed:', errorText);
    return;
  }
  
  const bookingResult = await bookingResponse.json();
  console.log('✅ Booking created successfully!');
  console.log('Booking ID:', bookingResult.id);
  console.log('Property:', bookingResult.property_title);
  console.log('Status:', bookingResult.status);
  
  // Step 3: Test fetching user bookings (what UserRoomApplications.js does)
  console.log('\n3. Fetching user bookings...');
  
  const userBookingsResponse = await fetch(`${API_BASE_URL}/bookings`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (userBookingsResponse.ok) {
    const userBookings = await userBookingsResponse.json();
    console.log(`✅ Found ${userBookings.length} booking(s) for user`);
    
    userBookings.forEach((booking, index) => {
      console.log(`\nBooking ${index + 1}:`);
      console.log(`  - ID: ${booking.id}`);
      console.log(`  - Property: ${booking.property_title}`);
      console.log(`  - Location: ${booking.property_location}`);
      console.log(`  - Check-in: ${new Date(booking.check_in).toLocaleDateString()}`);
      console.log(`  - Check-out: ${new Date(booking.check_out).toLocaleDateString()}`);
      console.log(`  - Status: ${booking.status}`);
      console.log(`  - Guests: ${booking.guests}`);
      console.log(`  - Total Price: $${booking.total_price}`);
    });
  } else {
    console.error('❌ Failed to fetch user bookings');
  }
  
  console.log('\n=== Test Complete ===');
}

// Run the test
simulateFrontendBooking().catch(console.error);