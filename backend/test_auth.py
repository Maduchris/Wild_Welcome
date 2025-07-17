#!/usr/bin/env python3
"""
Simple test script for authentication endpoints
Run this to verify the backend is working correctly
"""

import requests
import json

# Configuration
BASE_URL = "http://localhost:8000/api"
TEST_EMAIL = "test@example.com"
TEST_PASSWORD = "TestPassword123"

def test_health():
    """Test health endpoint"""
    try:
        response = requests.get("http://localhost:8000/health")
        print(f"✅ Health check: {response.status_code}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_register():
    """Test user registration"""
    try:
        data = {
            "email": TEST_EMAIL,
            "first_name": "Test",
            "last_name": "User",
            "password": TEST_PASSWORD,
            "user_type": "user",
            "phone": "+1234567890"
        }
        response = requests.post(f"{BASE_URL}/auth/register", json=data)
        print(f"✅ Register: {response.status_code}")
        if response.status_code == 200:
            print(f"   Response: {response.json()}")
        else:
            print(f"   Error: {response.text}")
        return response.status_code in [200, 400]  # 400 if user already exists
    except Exception as e:
        print(f"❌ Register failed: {e}")
        return False

def test_login():
    """Test user login"""
    try:
        data = {
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        }
        response = requests.post(f"{BASE_URL}/auth/login", json=data)
        print(f"✅ Login: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"   Access token: {result.get('access_token', 'N/A')[:20]}...")
            print(f"   Refresh token: {result.get('refresh_token', 'N/A')[:20]}...")
            return result.get('access_token')
        else:
            print(f"   Error: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Login failed: {e}")
        return None

def test_me_endpoint(token):
    """Test /me endpoint with token"""
    if not token:
        print("❌ No token available for /me test")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
        print(f"✅ /me endpoint: {response.status_code}")
        if response.status_code == 200:
            user_data = response.json()
            print(f"   User: {user_data.get('first_name')} {user_data.get('last_name')}")
            print(f"   Email: {user_data.get('email')}")
            print(f"   Type: {user_data.get('user_type')}")
            return True
        else:
            print(f"   Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ /me endpoint failed: {e}")
        return False

def test_refresh_token(refresh_token):
    """Test refresh token endpoint"""
    if not refresh_token:
        print("❌ No refresh token available")
        return False
    
    try:
        data = {"refresh_token": refresh_token}
        response = requests.post(f"{BASE_URL}/auth/refresh", json=data)
        print(f"✅ Refresh token: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"   New access token: {result.get('access_token', 'N/A')[:20]}...")
            return result.get('access_token')
        else:
            print(f"   Error: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Refresh token failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Testing Wild Welcome Authentication API")
    print("=" * 50)
    
    # Test health endpoint
    if not test_health():
        print("❌ Backend is not running. Please start the backend first.")
        return
    
    print("\n📝 Testing Registration...")
    test_register()
    
    print("\n🔐 Testing Login...")
    login_result = test_login()
    if not login_result:
        print("❌ Login failed. Cannot continue with other tests.")
        return
    
    # Extract tokens
    try:
        login_data = requests.post(f"{BASE_URL}/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        }).json()
        access_token = login_data.get('access_token')
        refresh_token = login_data.get('refresh_token')
    except:
        print("❌ Could not extract tokens from login response")
        return
    
    print("\n👤 Testing /me endpoint...")
    test_me_endpoint(access_token)
    
    print("\n🔄 Testing refresh token...")
    test_refresh_token(refresh_token)
    
    print("\n✅ All tests completed!")

if __name__ == "__main__":
    main() 