from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.database.mongodb import get_database
from app.models.review import Review, ReviewCreate, ReviewUpdate
from app.models.user import User
from app.auth.dependencies import get_current_active_user, get_optional_current_user
from bson import ObjectId
from datetime import datetime
from typing import Optional, List

router = APIRouter(prefix="/reviews", tags=["Reviews"])


@router.get("/", response_model=List[Review])
async def get_reviews(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    property_id: Optional[str] = Query(None),
    featured_only: bool = Query(False),
    approved_only: bool = Query(True),
    db = Depends(get_database)
):
    """Get reviews with filtering"""
    filter_query = {}
    
    if approved_only:
        filter_query["is_approved"] = True
    
    if featured_only:
        filter_query["is_featured"] = True
    
    if property_id:
        if property_id == "platform":
            # Platform reviews (no specific property)
            filter_query["property_id"] = None
        else:
            filter_query["property_id"] = property_id
    
    reviews = await db.reviews.find(filter_query).skip(skip).limit(limit).sort("created_at", -1).to_list(None)
    
    # Convert ObjectIds to strings
    converted_reviews = []
    for review in reviews:
        if "_id" in review:
            review["id"] = str(review["_id"])
            del review["_id"]
        converted_reviews.append(Review(**review))
    
    return converted_reviews


@router.get("/featured", response_model=List[Review])
async def get_featured_reviews(
    limit: int = Query(3, ge=1, le=10),
    db = Depends(get_database)
):
    """Get featured reviews for homepage"""
    filter_query = {
        "is_approved": True,
        "is_featured": True
    }
    
    reviews = await db.reviews.find(filter_query).limit(limit).sort("created_at", -1).to_list(None)
    
    # Convert ObjectIds to strings
    converted_reviews = []
    for review in reviews:
        if "_id" in review:
            review["id"] = str(review["_id"])
            del review["_id"]
        converted_reviews.append(Review(**review))
    
    return converted_reviews


@router.post("/", response_model=Review)
async def create_review(
    review_data: ReviewCreate,
    current_user: User = Depends(get_current_active_user),
    db = Depends(get_database)
):
    """Create a new review"""
    # Check if user already reviewed this property
    existing_review = await db.reviews.find_one({
        "user_id": current_user.id,
        "property_id": review_data.property_id
    })
    
    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already reviewed this property"
        )
    
    # If reviewing a specific property, verify it exists
    if review_data.property_id:
        property_exists = await db.properties.find_one({"_id": ObjectId(review_data.property_id)})
        if not property_exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Property not found"
            )
    
    # Create review document
    review_doc = review_data.dict()
    review_doc["user_id"] = current_user.id
    review_doc["user_name"] = f"{current_user.first_name} {current_user.last_name[0]}."  # e.g., "John D."
    review_doc["created_at"] = datetime.utcnow()
    review_doc["updated_at"] = datetime.utcnow()
    review_doc["is_approved"] = False  # Reviews need approval
    
    # Insert review
    result = await db.reviews.insert_one(review_doc)
    
    # Get created review
    created_review = await db.reviews.find_one({"_id": result.inserted_id})
    
    # Convert ObjectId to string
    if "_id" in created_review:
        created_review["id"] = str(created_review["_id"])
        del created_review["_id"]
    
    return Review(**created_review)


@router.put("/{review_id}", response_model=Review)
async def update_review(
    review_id: str,
    review_update: ReviewUpdate,
    current_user: User = Depends(get_current_active_user),
    db = Depends(get_database)
):
    """Update a review (only by the author)"""
    # Check if review exists and belongs to user
    review_data = await db.reviews.find_one({
        "_id": ObjectId(review_id),
        "user_id": current_user.id
    })
    
    if not review_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found or not owned by you"
        )
    
    # Prepare update data
    update_data = {k: v for k, v in review_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    # If content is updated, mark as needing approval again
    if "comment" in update_data or "rating" in update_data:
        update_data["is_approved"] = False
    
    # Update review
    await db.reviews.update_one(
        {"_id": ObjectId(review_id)},
        {"$set": update_data}
    )
    
    # Get updated review
    updated_review = await db.reviews.find_one({"_id": ObjectId(review_id)})
    
    # Convert ObjectId to string
    if "_id" in updated_review:
        updated_review["id"] = str(updated_review["_id"])
        del updated_review["_id"]
    
    return Review(**updated_review)


@router.delete("/{review_id}")
async def delete_review(
    review_id: str,
    current_user: User = Depends(get_current_active_user),
    db = Depends(get_database)
):
    """Delete a review (only by the author)"""
    # Check if review exists and belongs to user
    review_data = await db.reviews.find_one({
        "_id": ObjectId(review_id),
        "user_id": current_user.id
    })
    
    if not review_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found or not owned by you"
        )
    
    # Delete review
    await db.reviews.delete_one({"_id": ObjectId(review_id)})
    
    return {"message": "Review deleted successfully"}


# Admin endpoints for managing reviews
@router.put("/{review_id}/approve")
async def approve_review(
    review_id: str,
    current_user: User = Depends(get_current_active_user),
    db = Depends(get_database)
):
    """Approve a review (admin only - for now any user can approve)"""
    # TODO: Add admin role check
    
    review_data = await db.reviews.find_one({"_id": ObjectId(review_id)})
    
    if not review_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )
    
    # Approve review
    await db.reviews.update_one(
        {"_id": ObjectId(review_id)},
        {"$set": {"is_approved": True, "updated_at": datetime.utcnow()}}
    )
    
    return {"message": "Review approved successfully"}


@router.put("/{review_id}/feature")
async def feature_review(
    review_id: str,
    current_user: User = Depends(get_current_active_user),
    db = Depends(get_database)
):
    """Feature a review (admin only - for now any user can feature)"""
    # TODO: Add admin role check
    
    review_data = await db.reviews.find_one({"_id": ObjectId(review_id)})
    
    if not review_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )
    
    # Feature review (and approve if not already)
    await db.reviews.update_one(
        {"_id": ObjectId(review_id)},
        {
            "$set": {
                "is_featured": True,
                "is_approved": True,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return {"message": "Review featured successfully"}