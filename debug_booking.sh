#!/bin/bash

echo "=== Testing Booking Flow ==="

# Step 1: Login and get token
echo "1. Logging in..."
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "kehindekehinde894@icloud.com", "password": "!PASSword123"}' | \
  python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('access_token', ''))" 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed"
  exit 1
else
  echo "✅ Login successful - Token: ${TOKEN:0:20}..."
fi

# Step 2: Create booking
echo "2. Creating booking..."
BOOKING_RESPONSE=$(curl -s -X POST http://localhost:8000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "property_id": "6880d6e8e2cf81af45013198",
    "check_in": "2025-02-01T00:00:00.000Z",
    "check_out": "2025-02-08T00:00:00.000Z",
    "guests": 1,
    "total_price": 100.0,
    "special_requests": "Test booking via script"
  }')

echo "Booking Response: $BOOKING_RESPONSE"

# Check if booking was created
BOOKING_ID=$(echo "$BOOKING_RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('id', ''))" 2>/dev/null)

if [ -z "$BOOKING_ID" ]; then
  echo "❌ Booking creation failed"
  echo "Response: $BOOKING_RESPONSE"
else
  echo "✅ Booking created - ID: $BOOKING_ID"
fi

# Step 3: Fetch user bookings
echo "3. Fetching user bookings..."
USER_BOOKINGS=$(curl -s -X GET http://localhost:8000/api/bookings \
  -H "Authorization: Bearer $TOKEN")

echo "User Bookings: $USER_BOOKINGS"

# Count bookings
BOOKING_COUNT=$(echo "$USER_BOOKINGS" | python3 -c "import sys, json; data=json.load(sys.stdin); print(len(data) if isinstance(data, list) else 0)" 2>/dev/null)

echo "📊 Total bookings found: $BOOKING_COUNT"