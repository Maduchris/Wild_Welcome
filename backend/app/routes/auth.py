from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.database.mongodb import get_database
from app.models.user import UserCreate, UserLogin, User, Token, UserInDB, TokenRefresh
from app.auth.jwt import verify_password, get_password_hash, create_access_token, create_refresh_token, verify_token
from app.auth.dependencies import get_current_user
from app.auth.rate_limiter import check_login_rate_limit, check_register_rate_limit, check_password_reset_rate_limit
from app.services.email_service import email_service
from datetime import timedelta
from app.core.config import settings
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=dict)
async def register(user: UserCreate, db = Depends(get_database)):
    """Register a new user"""
    # Check rate limit
    await check_register_rate_limit(user.email)
    
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
    print("[DEBUG] Login attempt for:", user_credentials.email)
    # Check rate limit
    await check_login_rate_limit(user_credentials.email)
    
    # Find user
    user = await db.users.find_one({"email": user_credentials.email})
    print("[DEBUG] User found:", user)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is deactivated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    if not verify_password(user_credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    print("[DEBUG] Access token generated:", access_token[:20], "...")
    
    # Create refresh token
    refresh_token_expires = timedelta(days=settings.refresh_token_expire_days)
    refresh_token = create_refresh_token(
        data={"sub": user["email"]}, expires_delta=refresh_token_expires
    )
    print("[DEBUG] Refresh token generated:", refresh_token[:20], "...")
    
    return {
        "access_token": access_token, 
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.post("/refresh", response_model=Token)
async def refresh_token(refresh_data: TokenRefresh, db = Depends(get_database)):
    """Refresh access token using refresh token"""
    try:
        # Verify refresh token
        payload = verify_token(refresh_data.refresh_token)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        email = payload.get("sub")
        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Check if user still exists and is active
        user = await db.users.find_one({"email": email})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        if not user.get("is_active", True):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Account is deactivated",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Create new access token
        access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
        access_token = create_access_token(
            data={"sub": email}, expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )


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
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    """Get current user profile"""
    print("[DEBUG] /me endpoint called. Current user:", current_user)
    return current_user


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """Logout user (optional - can be handled client-side)"""
    # In a more advanced implementation, you could blacklist the token
    # For now, we'll just return success
    return {"message": "Logged out successfully"}


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


@router.post("/verify-email")
async def verify_email(token: str, db = Depends(get_database)):
    """Verify email address using token"""
    # Verify token
    payload = verify_token(token)
    if not payload or payload.get("type") != "email_verification":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token"
        )
    
    email = payload.get("sub")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token"
        )
    
    # Update user verification status
    await db.users.update_one(
        {"email": email},
        {"$set": {"is_verified": True, "updated_at": datetime.utcnow()}}
    )
    
    return {"message": "Email verified successfully"}


@router.post("/resend-verification")
async def resend_verification_email(email: str, db = Depends(get_database)):
    """Resend email verification"""
    user = await db.users.find_one({"email": email})
    if not user:
        # Don't reveal if email exists or not
        return {"message": "If email exists, verification email has been sent"}
    
    if user.get("is_verified", False):
        return {"message": "Email is already verified"}
    
    # Create verification token
    verification_token = create_access_token(
        data={"sub": user["email"], "type": "email_verification"},
        expires_delta=timedelta(hours=24)
    )
    
    # Send verification email
    await email_service.send_verification_email(user["email"], verification_token)
    
    return {"message": "If email exists, verification email has been sent"}