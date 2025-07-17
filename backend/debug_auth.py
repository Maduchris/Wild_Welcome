#!/usr/bin/env python3
"""
Debug script to test authentication endpoints
"""
import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_login_response():
    """Test login and print full response"""
    print("🔍 Testing login response...")
    
    # First register a new user
    timestamp = int(time.time())
    user_data = {
        "email": f"debug{timestamp}@example.com",
        "password": "testpassword123",
        "first_name": "Debug",
        "last_name": "User",
        "phone": "+1234567890",
        "user_type": "user"
    }
    
    # Register
    response = requests.post(f"{BASE_URL}/api/auth/register", json=user_data)
    print(f"Registration: {response.status_code}")
    if response.status_code == 200:
        print(f"Registration response: {response.json()}")
    
    # Login
    login_data = {
        "email": user_data["email"],
        "password": "testpassword123"
    }
    
    response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
    print(f"\nLogin: {response.status_code}")
    print(f"Login response: {response.json()}")
    
    if response.status_code == 200:
        data = response.json()
        access_token = data.get('access_token')
        refresh_token = data.get('refresh_token')
        
        print(f"\nAccess token: {access_token[:20] if access_token else 'MISSING'}...")
        print(f"Refresh token: {refresh_token[:20] if refresh_token else 'MISSING'}...")
        
        # Test /me endpoint
        if access_token:
            headers = {"Authorization": f"Bearer {access_token}"}
            me_response = requests.get(f"{BASE_URL}/api/auth/me", headers=headers)
            print(f"\n/me endpoint: {me_response.status_code}")
            print(f"/me response: {me_response.text}")
        
        return access_token, refresh_token
    
    return None, None

if __name__ == "__main__":
    test_login_response() 