from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from app.database.mongodb import get_database
from app.models.user import User, UserUpdate
from app.auth.dependencies import get_current_active_user
from app.services.cloudinary_service import cloudinary_service
from bson import ObjectId
from datetime import datetime
import tempfile
import os

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/profile", response_model=User)
async def get_user_profile(current_user: User = Depends(get_current_active_user)):
    """Get current user profile"""
    return current_user


@router.put("/profile", response_model=User)
async def update_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db = Depends(get_database)
):
    """Update user profile"""
    # Prepare update data
    update_data = {k: v for k, v in user_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    # Update user
    await db.users.update_one(
        {"_id": ObjectId(current_user.id)},
        {"$set": update_data}
    )
    
    # Get updated user
    updated_user = await db.users.find_one({"_id": ObjectId(current_user.id)})
    return User(**updated_user)


@router.post("/upload-avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db = Depends(get_database)
):
    """Upload user avatar"""
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image"
        )
    
    # Create temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp_file:
        content = await file.read()
        tmp_file.write(content)
        tmp_file_path = tmp_file.name
    
    try:
        # Upload to Cloudinary
        image_url = cloudinary_service.upload_image(tmp_file_path, "wild_welcome/avatars")
        
        if not image_url:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to upload image"
            )
        
        # Delete old avatar if exists
        if current_user.profile_image:
            old_public_id = cloudinary_service.get_public_id_from_url(current_user.profile_image)
            if old_public_id:
                cloudinary_service.delete_image(old_public_id)
        
        # Update user profile
        await db.users.update_one(
            {"_id": ObjectId(current_user.id)},
            {"$set": {"profile_image": image_url, "updated_at": datetime.utcnow()}}
        )
        
        return {"message": "Avatar uploaded successfully", "image_url": image_url}
        
    finally:
        # Clean up temporary file
        if os.path.exists(tmp_file_path):
            os.unlink(tmp_file_path)


@router.delete("/account")
async def delete_user_account(
    current_user: User = Depends(get_current_active_user),
    db = Depends(get_database)
):
    """Delete user account"""
    # Soft delete - just deactivate the account
    await db.users.update_one(
        {"_id": ObjectId(current_user.id)},
        {"$set": {"is_active": False, "updated_at": datetime.utcnow()}}
    )
    
    # TODO: Cancel all active bookings
    # TODO: Deactivate all properties if landlord
    
    return {"message": "Account deleted successfully"}


@router.get("/favourites")
async def get_user_favourites(
    current_user: User = Depends(get_current_active_user),
    db = Depends(get_database)
):
    """Get user's favourite properties"""
    # Get user favourites (assuming we store them in user document)
    user_data = await db.users.find_one({"_id": ObjectId(current_user.id)})
    favourite_ids = user_data.get("favourites", [])
    
    if not favourite_ids:
        return {"favourites": []}
    
    # Get favourite properties
    properties = await db.properties.find(
        {"_id": {"$in": [ObjectId(pid) for pid in favourite_ids]}}
    ).to_list(None)
    
    # Convert ObjectId to string for JSON serialization
    for prop in properties:
        if prop.get("_id"):
            prop["id"] = str(prop["_id"])
            del prop["_id"]
        if prop.get("landlord_id"):
            prop["landlord_id"] = str(prop["landlord_id"])
    
    return {"favourites": properties}


@router.post("/favourites/{property_id}")
async def add_to_favourites(
    property_id: str,
    current_user: User = Depends(get_current_active_user),
    db = Depends(get_database)
):
    """Add property to favourites"""
    # Check if property exists
    property_exists = await db.properties.find_one({"_id": ObjectId(property_id)})
    if not property_exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    
    # Add to favourites
    await db.users.update_one(
        {"_id": ObjectId(current_user.id)},
        {"$addToSet": {"favourites": property_id}}
    )
    
    return {"message": "Property added to favourites"}


@router.delete("/favourites/{property_id}")
async def remove_from_favourites(
    property_id: str,
    current_user: User = Depends(get_current_active_user),
    db = Depends(get_database)
):
    """Remove property from favourites"""
    # Remove from favourites
    await db.users.update_one(
        {"_id": ObjectId(current_user.id)},
        {"$pull": {"favourites": property_id}}
    )
    
    return {"message": "Property removed from favourites"}