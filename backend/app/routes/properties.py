from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Query
from app.database.mongodb import get_database
from app.models.property import Property, PropertyCreate, PropertyUpdate, PropertySearch
from app.models.user import User
from app.auth.dependencies import get_current_active_user, get_current_landlord, get_optional_current_user
from app.services.cloudinary_service import cloudinary_service
from bson import ObjectId
from datetime import datetime
from typing import Optional, List
import tempfile
import os

router = APIRouter(prefix="/properties", tags=["Properties"])


@router.get("/", response_model=List[Property])
async def get_properties(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    location: Optional[str] = Query(None),
    near_park: Optional[str] = Query(None),
    property_type: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    max_guests: Optional[int] = Query(None, ge=1),
    db = Depends(get_database),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """Get properties with filtering"""
    # Build filter query
    filter_query = {"is_active": True}
    
    if location:
        filter_query["$or"] = [
            {"location.address": {"$regex": location, "$options": "i"}},
            {"location.city": {"$regex": location, "$options": "i"}}
        ]
    
    if near_park:
        filter_query["location.near_park"] = {"$regex": near_park, "$options": "i"}
    
    if property_type:
        filter_query["property_type"] = property_type
    
    if min_price is not None:
        filter_query["price_per_night"] = {"$gte": min_price}
    
    if max_price is not None:
        if "price_per_night" in filter_query:
            filter_query["price_per_night"]["$lte"] = max_price
        else:
            filter_query["price_per_night"] = {"$lte": max_price}
    
    if max_guests:
        filter_query["max_guests"] = {"$gte": max_guests}
    
    # Get properties
    properties = await db.properties.find(filter_query).skip(skip).limit(limit).to_list(None)
    
    return [Property(**prop) for prop in properties]


@router.get("/search", response_model=List[Property])
async def search_properties(
    search_params: PropertySearch = Depends(),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db = Depends(get_database)
):
    """Advanced property search"""
    filter_query = {"is_active": True}
    
    # Build search query
    search_dict = search_params.dict(exclude_none=True)
    
    if "location" in search_dict:
        filter_query["$or"] = [
            {"location.address": {"$regex": search_dict["location"], "$options": "i"}},
            {"location.city": {"$regex": search_dict["location"], "$options": "i"}}
        ]
    
    if "near_park" in search_dict:
        filter_query["location.near_park"] = {"$regex": search_dict["near_park"], "$options": "i"}
    
    if "property_type" in search_dict:
        filter_query["property_type"] = search_dict["property_type"]
    
    if "max_guests" in search_dict:
        filter_query["max_guests"] = {"$gte": search_dict["max_guests"]}
    
    # Price range
    if "min_price" in search_dict:
        filter_query["price_per_night"] = {"$gte": search_dict["min_price"]}
    
    if "max_price" in search_dict:
        if "price_per_night" in filter_query:
            filter_query["price_per_night"]["$lte"] = search_dict["max_price"]
        else:
            filter_query["price_per_night"] = {"$lte": search_dict["max_price"]}
    
    # Amenities filter
    if "amenities" in search_dict:
        for amenity in search_dict["amenities"]:
            filter_query[f"amenities.{amenity}"] = True
    
    # TODO: Add availability check for check_in/check_out dates
    
    properties = await db.properties.find(filter_query).skip(skip).limit(limit).to_list(None)
    
    return [Property(**prop) for prop in properties]


@router.get("/{property_id}", response_model=Property)
async def get_property(
    property_id: str,
    db = Depends(get_database),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """Get single property by ID"""
    try:
        property_data = await db.properties.find_one({"_id": ObjectId(property_id)})
        if not property_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Property not found"
            )
        
        return Property(**property_data)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )


@router.post("/", response_model=Property)
async def create_property(
    property_data: PropertyCreate,
    current_user: User = Depends(get_current_landlord),
    db = Depends(get_database)
):
    """Create new property (landlords only)"""
    # Prepare property document
    property_doc = property_data.dict()
    property_doc["landlord_id"] = ObjectId(current_user.id)
    property_doc["created_at"] = datetime.utcnow()
    property_doc["updated_at"] = datetime.utcnow()
    
    # Insert property
    result = await db.properties.insert_one(property_doc)
    
    # Get created property
    created_property = await db.properties.find_one({"_id": result.inserted_id})
    
    return Property(**created_property)


@router.put("/{property_id}", response_model=Property)
async def update_property(
    property_id: str,
    property_update: PropertyUpdate,
    current_user: User = Depends(get_current_landlord),
    db = Depends(get_database)
):
    """Update property (landlords only)"""
    # Check if property exists and belongs to user
    property_data = await db.properties.find_one({
        "_id": ObjectId(property_id),
        "landlord_id": ObjectId(current_user.id)
    })
    
    if not property_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found or not owned by you"
        )
    
    # Prepare update data
    update_data = {k: v for k, v in property_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    # Update property
    await db.properties.update_one(
        {"_id": ObjectId(property_id)},
        {"$set": update_data}
    )
    
    # Get updated property
    updated_property = await db.properties.find_one({"_id": ObjectId(property_id)})
    
    return Property(**updated_property)


@router.delete("/{property_id}")
async def delete_property(
    property_id: str,
    current_user: User = Depends(get_current_landlord),
    db = Depends(get_database)
):
    """Delete property (landlords only)"""
    # Check if property exists and belongs to user
    property_data = await db.properties.find_one({
        "_id": ObjectId(property_id),
        "landlord_id": ObjectId(current_user.id)
    })
    
    if not property_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found or not owned by you"
        )
    
    # Soft delete - mark as inactive
    await db.properties.update_one(
        {"_id": ObjectId(property_id)},
        {"$set": {"is_active": False, "updated_at": datetime.utcnow()}}
    )
    
    return {"message": "Property deleted successfully"}


@router.post("/{property_id}/images")
async def upload_property_images(
    property_id: str,
    files: List[UploadFile] = File(...),
    current_user: User = Depends(get_current_landlord),
    db = Depends(get_database)
):
    """Upload property images"""
    # Check if property exists and belongs to user
    property_data = await db.properties.find_one({
        "_id": ObjectId(property_id),
        "landlord_id": ObjectId(current_user.id)
    })
    
    if not property_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found or not owned by you"
        )
    
    uploaded_urls = []
    
    for file in files:
        # Validate file type
        if not file.content_type.startswith("image/"):
            continue
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            tmp_file_path = tmp_file.name
        
        try:
            # Upload to Cloudinary
            image_url = cloudinary_service.upload_image(tmp_file_path, f"wild_welcome/properties/{property_id}")
            
            if image_url:
                uploaded_urls.append(image_url)
                
        finally:
            # Clean up temporary file
            if os.path.exists(tmp_file_path):
                os.unlink(tmp_file_path)
    
    if uploaded_urls:
        # Add new images to property
        await db.properties.update_one(
            {"_id": ObjectId(property_id)},
            {
                "$push": {"images": {"$each": uploaded_urls}},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
    
    return {"message": f"Uploaded {len(uploaded_urls)} images successfully", "urls": uploaded_urls}


@router.get("/landlord/my-properties", response_model=List[Property])
async def get_landlord_properties(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_landlord),
    db = Depends(get_database)
):
    """Get properties owned by current landlord"""
    properties = await db.properties.find(
        {"landlord_id": ObjectId(current_user.id)}
    ).skip(skip).limit(limit).to_list(None)
    
    return [Property(**prop) for prop in properties]