#!/usr/bin/env python3
"""
Test JWT token creation and verification
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.auth.jwt import create_access_token, verify_access_token, create_refresh_token
from app.core.config import settings
from datetime import timedelta

def test_jwt():
    """Test JWT token creation and verification"""
    print("🔍 Testing JWT token creation and verification...")
    
    # Test access token
    data = {"sub": "test@example.com"}
    access_token = create_access_token(data)
    print(f"Access token created: {access_token[:20]}...")
    
    # Verify access token
    payload = verify_access_token(access_token)
    print(f"Access token verified: {payload}")
    
    # Test refresh token
    refresh_token = create_refresh_token(data)
    print(f"Refresh token created: {refresh_token[:20]}...")
    
    # Test token verification
    payload = verify_access_token(refresh_token)
    print(f"Refresh token as access token: {payload}")  # Should be None
    
    return access_token, refresh_token

if __name__ == "__main__":
    test_jwt() 