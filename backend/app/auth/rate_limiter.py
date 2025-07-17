from fastapi import HTTPException, status
from datetime import datetime, timedelta
from typing import Dict, Tuple
import asyncio
from collections import defaultdict

# In-memory storage for rate limiting (in production, use Redis)
rate_limit_storage: Dict[str, list] = defaultdict(list)

class RateLimiter:
    def __init__(self, max_requests: int, window_seconds: int):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
    
    async def check_rate_limit(self, identifier: str) -> bool:
        """Check if the request is within rate limits"""
        now = datetime.utcnow()
        window_start = now - timedelta(seconds=self.window_seconds)
        
        # Get requests for this identifier
        requests = rate_limit_storage[identifier]
        
        # Remove old requests outside the window
        requests = [req_time for req_time in requests if req_time > window_start]
        rate_limit_storage[identifier] = requests
        
        # Check if we're within the limit
        if len(requests) >= self.max_requests:
            return False
        
        # Add current request
        requests.append(now)
        rate_limit_storage[identifier] = requests
        
        return True

# Rate limiters for different endpoints
login_rate_limiter = RateLimiter(max_requests=5, window_seconds=300)  # 5 attempts per 5 minutes
register_rate_limiter = RateLimiter(max_requests=3, window_seconds=3600)  # 3 attempts per hour
password_reset_rate_limiter = RateLimiter(max_requests=3, window_seconds=3600)  # 3 attempts per hour

async def check_login_rate_limit(email: str):
    """Check rate limit for login attempts"""
    if not await login_rate_limiter.check_rate_limit(f"login:{email}"):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many login attempts. Please try again later."
        )

async def check_register_rate_limit(email: str):
    """Check rate limit for registration attempts"""
    if not await register_rate_limiter.check_rate_limit(f"register:{email}"):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many registration attempts. Please try again later."
        )

async def check_password_reset_rate_limit(email: str):
    """Check rate limit for password reset attempts"""
    if not await password_reset_rate_limiter.check_rate_limit(f"password_reset:{email}"):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many password reset attempts. Please try again later."
        ) 