#!/usr/bin/env python3
"""
Debug script to test /me endpoint
"""
import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_me_endpoint():
    """Test /me endpoint with detailed error reporting"""
    print("🔍 Testing /me endpoint...")
    
    # First register and login
    timestamp = int(time.time())
    user_data = {
        "email": f"me_test{timestamp}@example.com",
        "password": "testpassword123",
        "first_name": "MeTest",
        "last_name": "User",
        "phone": "+1234567890",
        "user_type": "user"
    }
    
    # Register
    response = requests.post(f"{BASE_URL}/api/auth/register", json=user_data)
    print(f"Registration: {response.status_code}")
    
    # Login
    login_data = {
        "email": user_data["email"],
        "password": "testpassword123"
    }
    
    response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
    print(f"Login: {response.status_code}")
    print(f"Login response: {response.json()}")
    
    if response.status_code == 200:
        data = response.json()
        access_token = data.get('access_token')
        
        if access_token:
            # Test /me endpoint
            headers = {"Authorization": f"Bearer {access_token}"}
            
            print(f"\nTesting /me with token: {access_token[:20]}...")
            
            try:
                me_response = requests.get(f"{BASE_URL}/api/auth/me", headers=headers)
                print(f"/me status: {me_response.status_code}")
                print(f"/me headers: {dict(me_response.headers)}")
                print(f"/me response: {me_response.text}")
                
                if me_response.status_code == 500:
                    print("\n⚠️ 500 error details:")
                    try:
                        error_data = me_response.json()
                        print(f"Error JSON: {error_data}")
                    except:
                        print(f"Raw error: {me_response.text}")
                        
            except Exception as e:
                print(f"Exception during /me request: {e}")
        else:
            print("❌ No access token received")
    else:
        print("❌ Login failed")

if __name__ == "__main__":
    test_me_endpoint() 