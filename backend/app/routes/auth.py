from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.database.mongodb import get_database
from app.models.user import UserCreate, UserLogin, User, Token, UserInDB
from pydantic import BaseModel
from app.auth.jwt import verify_password, get_password_hash, create_access_token, verify_token, create_refresh_token, create_refresh_token_expiry, is_refresh_token_expired
from app.auth.dependencies import get_current_user
from app.services.email_service import email_service
from datetime import timedelta
from app.core.config import settings
from bson import ObjectId
from datetime import datetime
from google.auth.transport import requests
from google.oauth2 import id_token
import logging

router = APIRouter(prefix="/auth", tags=["Authentication"])


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


@router.post("/register", response_model=dict)
async def register(user: UserCreate, db = Depends(get_database)):
    """Register a new user"""
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    hashed_password = get_password_hash(user.password)
    
    # Create user document
    user_data = {
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "phone": user.phone,
        "user_type": user.user_type,
        "profile_image": user.profile_image,
        "is_active": True,
        "is_verified": False,
        "hashed_password": hashed_password,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Insert user
    result = await db.users.insert_one(user_data)
    
    # Send welcome email
    await email_service.send_welcome_email(
        user.email, 
        f"{user.first_name} {user.last_name}"
    )
    
    return {"message": "User registered successfully", "user_id": str(result.inserted_id)}


@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin, db = Depends(get_database)):
    """Login user"""
    # Find user
    user = await db.users.find_one({"email": user_credentials.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    if not verify_password(user_credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create tokens
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    
    refresh_token = create_refresh_token()
    refresh_token_expiry = create_refresh_token_expiry()
    
    # Store refresh token in database
    await db.users.update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "refresh_token": refresh_token,
                "refresh_token_expires_at": refresh_token_expiry,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db = Depends(get_database)
):
    """OAuth2 compatible token login"""
    user = await db.users.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    
    refresh_token = create_refresh_token()
    refresh_token_expiry = create_refresh_token_expiry()
    
    # Store refresh token in database
    await db.users.update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "refresh_token": refresh_token,
                "refresh_token_expires_at": refresh_token_expiry,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.post("/refresh", response_model=Token)
async def refresh_access_token(refresh_token: str, db = Depends(get_database)):
    """Refresh access token using refresh token"""
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token is required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Find user with this refresh token
    user = await db.users.find_one({"refresh_token": refresh_token})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if refresh token is expired
    if not user.get("refresh_token_expires_at") or is_refresh_token_expired(user["refresh_token_expires_at"]):
        # Clear expired refresh token
        await db.users.update_one(
            {"_id": user["_id"]},
            {"$unset": {"refresh_token": "", "refresh_token_expires_at": ""}}
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate new tokens
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    
    new_refresh_token = create_refresh_token()
    new_refresh_token_expiry = create_refresh_token_expiry()
    
    # Update refresh token in database
    await db.users.update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "refresh_token": new_refresh_token,
                "refresh_token_expires_at": new_refresh_token_expiry,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    }


@router.get("/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    """Get current user profile"""
    return current_user


@router.post("/change-password")
async def change_password(
    password_data: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db = Depends(get_database)
):
    """Change user password"""
    # Get current user from database to verify current password
    user_doc = await db.users.find_one({"email": current_user.email})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check if user has a password (Google users might not have one)
    if not user_doc.get("hashed_password"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot change password for social login accounts"
        )
    
    # Verify current password
    if not verify_password(password_data.current_password, user_doc["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Hash new password
    new_hashed_password = get_password_hash(password_data.new_password)
    
    # Update password in database
    await db.users.update_one(
        {"email": current_user.email},
        {
            "$set": {
                "hashed_password": new_hashed_password,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return {"message": "Password changed successfully"}


@router.post("/forgot-password")
async def forgot_password(email: str, db = Depends(get_database)):
    """Send password reset email"""
    user = await db.users.find_one({"email": email})
    if not user:
        # Don't reveal if email exists or not
        return {"message": "If email exists, password reset link has been sent"}
    
    # Create reset token (valid for 30 minutes)
    reset_token = create_access_token(
        data={"sub": user["email"], "type": "password_reset"},
        expires_delta=timedelta(minutes=30)
    )
    
    # Send reset email
    await email_service.send_password_reset(user["email"], reset_token)
    
    return {"message": "If email exists, password reset link has been sent"}


@router.post("/reset-password")
async def reset_password(token: str, new_password: str, db = Depends(get_database)):
    """Reset password using token"""
    # Verify token
    payload = verify_token(token)
    if not payload or payload.get("type") != "password_reset":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token"
        )
    
    email = payload.get("sub")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token"
        )
    
    # Update password
    hashed_password = get_password_hash(new_password)
    await db.users.update_one(
        {"email": email},
        {"$set": {"hashed_password": hashed_password, "updated_at": datetime.utcnow()}}
    )
    
    return {"message": "Password reset successfully"}


@router.post("/google", response_model=Token)
async def google_login(token: dict, db = Depends(get_database)):
    """Login with Google OAuth token"""
    try:
        # Verify the Google token
        google_token = token.get("token")
        if not google_token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Google token is required"
            )
        
        # Verify token with Google
        try:
            idinfo = id_token.verify_oauth2_token(
                google_token, 
                requests.Request(), 
                settings.google_client_id if hasattr(settings, 'google_client_id') else None
            )
            
            # Get user info from Google token
            email = idinfo.get('email')
            first_name = idinfo.get('given_name', '')
            last_name = idinfo.get('family_name', '')
            profile_image = idinfo.get('picture', '')
            
            if not email:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email not found in Google token"
                )
                
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid Google token"
            )
        
        # Check if user exists
        user = await db.users.find_one({"email": email})
        
        if not user:
            # Create new user from Google info
            user_data = {
                "email": email,
                "first_name": first_name,
                "last_name": last_name,
                "phone": "",
                "user_type": "user",
                "profile_image": profile_image,
                "is_active": True,
                "is_verified": True,  # Google accounts are pre-verified
                "hashed_password": "",  # No password for Google users
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            result = await db.users.insert_one(user_data)
            user = await db.users.find_one({"_id": result.inserted_id})
            
            # Send welcome email
            await email_service.send_welcome_email(
                email, 
                f"{first_name} {last_name}"
            )
        
        # Create tokens
        access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
        access_token = create_access_token(
            data={"sub": user["email"]}, expires_delta=access_token_expires
        )
        
        refresh_token = create_refresh_token()
        refresh_token_expiry = create_refresh_token_expiry()
        
        # Store refresh token in database
        await db.users.update_one(
            {"_id": user["_id"]},
            {
                "$set": {
                    "refresh_token": refresh_token,
                    "refresh_token_expires_at": refresh_token_expiry,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }
        
    except Exception as e:
        logging.error(f"Google login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google login failed"
        )


@router.get("/stats")
async def get_platform_stats(db = Depends(get_database)):
    """Get platform statistics"""
    try:
        # Count active properties
        properties_count = await db.properties.count_documents({"is_active": True})
        
        # Count total users
        users_count = await db.users.count_documents({"is_active": True})
        
        # Count landlords
        landlords_count = await db.users.count_documents({
            "user_type": "landlord", 
            "is_active": True
        })
        
        # Count completed bookings (as a proxy for happy tenants)
        bookings_count = await db.bookings.count_documents({"status": "approved"})
        
        return {
            "available_properties": properties_count,
            "total_users": users_count,
            "happy_tenants": bookings_count,
            "trusted_landlords": landlords_count
        }
    except Exception as e:
        logging.error(f"Stats error: {str(e)}")
        # Return default stats if database query fails
        return {
            "available_properties": 0,
            "total_users": 0,
            "happy_tenants": 0,
            "trusted_landlords": 0
        }