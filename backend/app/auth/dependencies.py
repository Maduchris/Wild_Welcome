from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.auth.jwt import verify_token
from app.database.mongodb import get_database
from app.models.user import User
from bson import ObjectId
from typing import Optional

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db = Depends(get_database)
) -> User:
    """Get current authenticated user"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = verify_token(credentials.credentials)
        if payload is None:
            raise credentials_exception
            
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
            
    except Exception:
        raise credentials_exception
    
    # Get user from database
    user_data = await db.users.find_one({"email": email})
    if user_data is None:
        raise credentials_exception
    
    # Convert ObjectId to string for the User model
    if "_id" in user_data:
        user_data["id"] = str(user_data["_id"])
        del user_data["_id"]  # Remove the original _id field
        
    return User(**user_data)


async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """Get current active user"""
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


async def get_current_landlord(current_user: User = Depends(get_current_active_user)) -> User:
    """Get current landlord user"""
    if current_user.user_type != "landlord":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user


async def get_optional_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db = Depends(get_database)
) -> Optional[User]:
    """Get current user if authenticated, otherwise None"""
    if not credentials:
        return None
        
    try:
        payload = verify_token(credentials.credentials)
        if payload is None:
            return None
            
        email: str = payload.get("sub")
        if email is None:
            return None
            
        user_data = await db.users.find_one({"email": email})
        if user_data is None:
            return None
        
        # Convert ObjectId to string for the User model
        if "_id" in user_data:
            user_data["id"] = str(user_data["_id"])
            del user_data["_id"]  # Remove the original _id field
            
        return User(**user_data)
    except Exception:
        return None