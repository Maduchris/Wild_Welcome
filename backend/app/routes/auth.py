from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.database.mongodb import get_database
from app.models.user import UserCreate, UserLogin, User, Token, UserInDB
from app.auth.jwt import verify_password, get_password_hash, create_access_token, verify_token
from app.auth.dependencies import get_current_user
from app.services.email_service import email_service
from datetime import timedelta
from app.core.config import settings
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["Authentication"])


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
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


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
    return current_user


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