#!/usr/bin/env python3
"""
Test script to verify authentication fixes
"""
import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("🔍 Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"✅ Health check: {response.status_code} - {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_register():
    """Test user registration"""
    print("\n🔍 Testing user registration...")
    # Use timestamp to make email unique
    timestamp = int(time.time())
    user_data = {
        "email": f"test{timestamp}@example.com",
        "password": "testpassword123",
        "first_name": "Test",
        "last_name": "User",
        "phone": "+1234567890",
        "user_type": "user"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/register", json=user_data)
        print(f"✅ Registration: {response.status_code}")
        if response.status_code == 200:
            print(f"   Response: {response.json()}")
        else:
            print(f"   Error: {response.text}")
        return response.status_code == 200, user_data["email"]
    except Exception as e:
        print(f"❌ Registration failed: {e}")
        return False, None

def test_login(email):
    """Test user login"""
    print("\n🔍 Testing user login...")
    login_data = {
        "email": email,
        "password": "testpassword123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        print(f"✅ Login: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   Access token: {data.get('access_token', 'MISSING')[:20]}...")
            print(f"   Refresh token: {data.get('refresh_token', 'MISSING')[:20]}...")
            print(f"   Token type: {data.get('token_type', 'MISSING')}")
            return data.get('access_token'), data.get('refresh_token')
        else:
            print(f"   Error: {response.text}")
            return None, None
    except Exception as e:
        print(f"❌ Login failed: {e}")
        return None, None

def test_me_endpoint(access_token):
    """Test /me endpoint"""
    print("\n🔍 Testing /me endpoint...")
    if not access_token:
        print("❌ No access token available")
        return False
    
    headers = {"Authorization": f"Bearer {access_token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/api/auth/me", headers=headers)
        print(f"✅ /me endpoint: {response.status_code}")
        
        if response.status_code == 200:
            user_data = response.json()
            print(f"   User ID: {user_data.get('id', 'MISSING')}")
            print(f"   Email: {user_data.get('email', 'MISSING')}")
            print(f"   Name: {user_data.get('first_name', 'MISSING')} {user_data.get('last_name', 'MISSING')}")
            return True
        else:
            print(f"   Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ /me endpoint failed: {e}")
        return False

def test_refresh_token(refresh_token):
    """Test refresh token endpoint"""
    print("\n🔍 Testing refresh token endpoint...")
    if not refresh_token:
        print("❌ No refresh token available")
        return False
    
    refresh_data = {"refresh_token": refresh_token}
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/refresh", json=refresh_data)
        print(f"✅ Refresh token: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   New access token: {data.get('access_token', 'MISSING')[:20]}...")
            return data.get('access_token')
        else:
            print(f"   Error: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Refresh token failed: {e}")
        return None

def main():
    """Run all tests"""
    print("🚀 Starting authentication tests...")
    print("=" * 50)
    
    # Test health
    if not test_health():
        print("❌ Health check failed, stopping tests")
        return
    
    # Test registration
    success, email = test_register()
    if not success:
        print("❌ Registration failed, stopping tests")
        return
    
    # Test login
    access_token, refresh_token = test_login(email)
    if not access_token:
        print("❌ Login failed, stopping tests")
        return
    
    # Test /me endpoint
    if not test_me_endpoint(access_token):
        print("❌ /me endpoint failed")
    else:
        print("✅ /me endpoint working correctly")
    
    # Test refresh token
    if refresh_token:
        new_access_token = test_refresh_token(refresh_token)
        if new_access_token:
            print("✅ Refresh token working correctly")
            # Test /me with new token
            test_me_endpoint(new_access_token)
        else:
            print("❌ Refresh token failed")
    else:
        print("❌ No refresh token received from login")
    
    print("\n" + "=" * 50)
    print("🏁 Authentication tests completed!")

if __name__ == "__main__":
    main() 