from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.database.mongodb import get_database
from app.models.booking import Booking, BookingCreate, BookingUpdate, BookingResponse
from app.models.user import User
from app.auth.dependencies import get_current_active_user, get_current_landlord
from app.services.email_service import email_service
from app.services.sms_service import sms_service
from bson import ObjectId
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class PaginatedBookingResponse(BaseModel):
    items: List[BookingResponse]
    total: int
    page: int
    per_page: int
    total_pages: int

router = APIRouter(prefix="/bookings", tags=["Bookings"])


@router.get("/debug/all")
async def debug_get_all_bookings(
    current_user: User = Depends(get_current_active_user),
    db = Depends(get_database)
):
    """DEBUG: Get all bookings in database (temporary endpoint)"""
    # Get all bookings
    all_bookings = await db.bookings.find({}).to_list(None)
    
    # Get all users for reference
    all_users = await db.users.find({}).to_list(None)
    
    result = {
        "total_bookings": len(all_bookings),
        "current_user_id": current_user.id,
        "current_user_email": current_user.email,
        "bookings": []
    }
    
    for booking in all_bookings:
        # Find user for this booking
        user = next((u for u in all_users if u["_id"] == booking["user_id"]), None)
        
        result["bookings"].append({
            "booking_id": str(booking["_id"]),
            "user_id": str(booking["user_id"]),
            "user_email": user["email"] if user else "Unknown",
            "property_id": str(booking["property_id"]),
            "status": booking["status"],
            "created_at": booking["created_at"],
            "matches_current_user": str(booking["user_id"]) == current_user.id
        })
    
    return result


@router.post("/", response_model=BookingResponse)
async def create_booking(
    booking_data: BookingCreate,
    current_user: User = Depends(get_current_active_user),
    db = Depends(get_database)
):
    """Create new booking"""
    # Check if property exists
    property_data = await db.properties.find_one({"_id": ObjectId(booking_data.property_id)})
    if not property_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    
    # Check if user already has a pending or confirmed booking for this property
    user_existing_booking = await db.bookings.find_one({
        "property_id": ObjectId(booking_data.property_id),
        "user_id": ObjectId(current_user.id),
        "status": {"$in": ["pending", "confirmed"]}
    })
    
    if user_existing_booking:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already have a pending or confirmed booking for this property"
        )
    
    # Check if property is available for those dates (from any user)
    existing_booking = await db.bookings.find_one({
        "property_id": ObjectId(booking_data.property_id),
        "status": {"$in": ["pending", "confirmed"]},
        "$or": [
            {
                "check_in": {"$lte": booking_data.check_in},
                "check_out": {"$gt": booking_data.check_in}
            },
            {
                "check_in": {"$lt": booking_data.check_out},
                "check_out": {"$gte": booking_data.check_out}
            },
            {
                "check_in": {"$gte": booking_data.check_in},
                "check_out": {"$lte": booking_data.check_out}
            }
        ]
    })
    
    if existing_booking:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Property is not available for selected dates"
        )
    
    # Check guest capacity
    if booking_data.guests > property_data["max_guests"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Number of guests exceeds property capacity"
        )
    
    # Create booking document
    booking_doc = booking_data.dict()
    booking_doc["user_id"] = ObjectId(current_user.id)
    booking_doc["property_id"] = ObjectId(booking_data.property_id)
    booking_doc["created_at"] = datetime.utcnow()
    booking_doc["updated_at"] = datetime.utcnow()
    
    print(f"DEBUG: Creating booking for user {current_user.id} ({current_user.email})")
    print(f"DEBUG: Booking document user_id: {booking_doc['user_id']}")
    print(f"DEBUG: Property ID: {booking_doc['property_id']}")
    
    # Insert booking
    result = await db.bookings.insert_one(booking_doc)
    print(f"DEBUG: Booking created with ID: {result.inserted_id}")
    
    # Get created booking with property and user details
    booking_response = await get_booking_with_details(result.inserted_id, db)
    
    # Send confirmation email
    booking_details = {
        "property_title": property_data["title"],
        "check_in": booking_data.check_in.strftime("%Y-%m-%d"),
        "check_out": booking_data.check_out.strftime("%Y-%m-%d"),
        "guests": booking_data.guests,
        "total_price": booking_data.total_price
    }
    
    await email_service.send_booking_confirmation(
        current_user.email,
        f"{current_user.first_name} {current_user.last_name}",
        booking_details
    )
    
    # Send SMS if phone number available
    if current_user.phone:
        await sms_service.send_booking_confirmation_sms(
            current_user.phone,
            booking_details
        )
    
    return booking_response


@router.get("/", response_model=List[BookingResponse])
async def get_user_bookings(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status_filter: Optional[str] = Query(None),
    current_user: User = Depends(get_current_active_user),
    db = Depends(get_database)
):
    """Get user's bookings"""
    print(f"DEBUG: Getting bookings for user {current_user.id} ({current_user.email})")
    
    # Build filter query
    filter_query = {"user_id": ObjectId(current_user.id)}
    print(f"DEBUG: Filter query: {filter_query}")
    
    if status_filter:
        filter_query["status"] = status_filter
        print(f"DEBUG: Status filter applied: {status_filter}")
    
    # Get bookings
    bookings = await db.bookings.find(filter_query).skip(skip).limit(limit).to_list(None)
    print(f"DEBUG: Found {len(bookings)} bookings for user")
    
    # Get bookings with details
    booking_responses = []
    for booking in bookings:
        booking_response = await get_booking_with_details(booking["_id"], db)
        booking_responses.append(booking_response)
    
    return booking_responses


@router.get("/{booking_id}", response_model=BookingResponse)
async def get_booking(
    booking_id: str,
    current_user: User = Depends(get_current_active_user),
    db = Depends(get_database)
):
    """Get single booking by ID"""
    try:
        booking_data = await db.bookings.find_one({"_id": ObjectId(booking_id)})
        if not booking_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found"
            )
        
        # Check if user owns this booking or is the landlord
        if (booking_data["user_id"] != ObjectId(current_user.id) and 
            current_user.user_type != "landlord"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this booking"
            )
        
        # If landlord, check if they own the property
        if current_user.user_type == "landlord":
            property_data = await db.properties.find_one({
                "_id": booking_data["property_id"],
                "landlord_id": ObjectId(current_user.id)
            })
            if not property_data:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Not authorized to view this booking"
                )
        
        return await get_booking_with_details(ObjectId(booking_id), db)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )


@router.put("/{booking_id}", response_model=BookingResponse)
async def update_booking(
    booking_id: str,
    booking_update: BookingUpdate,
    current_user: User = Depends(get_current_active_user),
    db = Depends(get_database)
):
    """Update booking (user can update their own bookings)"""
    # Check if booking exists and belongs to user
    booking_data = await db.bookings.find_one({
        "_id": ObjectId(booking_id),
        "user_id": ObjectId(current_user.id)
    })
    
    if not booking_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found or not owned by you"
        )
    
    # Check if booking can be updated (only pending bookings)
    if booking_data["status"] not in ["pending"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot update confirmed or cancelled bookings"
        )
    
    # Prepare update data
    update_data = {k: v for k, v in booking_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    # Update booking
    await db.bookings.update_one(
        {"_id": ObjectId(booking_id)},
        {"$set": update_data}
    )
    
    return await get_booking_with_details(ObjectId(booking_id), db)


@router.delete("/{booking_id}")
async def cancel_booking(
    booking_id: str,
    current_user: User = Depends(get_current_active_user),
    db = Depends(get_database)
):
    """Cancel booking"""
    # Check if booking exists and belongs to user
    booking_data = await db.bookings.find_one({
        "_id": ObjectId(booking_id),
        "user_id": ObjectId(current_user.id)
    })
    
    if not booking_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found or not owned by you"
        )
    
    # Check if booking can be cancelled
    if booking_data["status"] in ["cancelled", "completed"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot cancel this booking"
        )
    
    # Cancel booking
    await db.bookings.update_one(
        {"_id": ObjectId(booking_id)},
        {"$set": {"status": "cancelled", "updated_at": datetime.utcnow()}}
    )
    
    return {"message": "Booking cancelled successfully"}


@router.get("/landlord/requests", response_model=PaginatedBookingResponse)
async def get_landlord_booking_requests(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status_filter: Optional[str] = Query(None),
    current_user: User = Depends(get_current_landlord),
    db = Depends(get_database)
):
    """Get booking requests for landlord's properties with pagination"""
    print(f"DEBUG: Getting booking requests for landlord {current_user.id} ({current_user.email})")
    
    # Get landlord's properties
    landlord_properties = await db.properties.find(
        {"landlord_id": ObjectId(current_user.id)}
    ).to_list(None)
    
    property_ids = [prop["_id"] for prop in landlord_properties]
    print(f"DEBUG: Landlord has {len(landlord_properties)} properties with IDs: {property_ids}")
    
    # Build filter query
    filter_query = {"property_id": {"$in": property_ids}}
    
    if status_filter:
        filter_query["status"] = status_filter
        
    print(f"DEBUG: Filter query: {filter_query}")
    
    # Get bookings sorted by creation date (newest first)
    bookings = await db.bookings.find(filter_query).sort("created_at", -1).skip(skip).limit(limit).to_list(None)
    print(f"DEBUG: Found {len(bookings)} bookings for landlord after pagination")
    
    # Debug each booking
    for i, booking in enumerate(bookings):
        print(f"DEBUG: Booking {i+1}: ID={booking['_id']}, user_id={booking['user_id']}, property_id={booking['property_id']}, status={booking['status']}")
    
    # Optimize: Get all related data in bulk instead of individual queries
    user_ids = list(set([booking["user_id"] for booking in bookings]))
    property_ids = list(set([booking["property_id"] for booking in bookings]))
    
    print(f"DEBUG: Fetching bulk data for {len(user_ids)} users and {len(property_ids)} properties")
    
    # Fetch properties first to get landlord IDs
    properties_cursor = db.properties.find({"_id": {"$in": property_ids}})
    properties_list = await properties_cursor.to_list(None)
    
    # Add landlord IDs to user_ids for bulk fetch
    landlord_ids = [prop["landlord_id"] for prop in properties_list if prop.get("landlord_id")]
    all_user_ids = list(set(user_ids + landlord_ids))
    
    print(f"DEBUG: Total user IDs to fetch: {len(all_user_ids)} (including {len(landlord_ids)} landlords)")
    
    # Fetch all users (tenants + landlords) in bulk
    users_cursor = db.users.find({"_id": {"$in": all_user_ids}})
    users_list = await users_cursor.to_list(None)
    
    # Create lookup dictionaries for fast access
    users_dict = {user["_id"]: user for user in users_list}
    properties_dict = {prop["_id"]: prop for prop in properties_list}
    
    print(f"DEBUG: Loaded {len(users_dict)} users and {len(properties_dict)} properties")
    
    # Build booking responses efficiently
    booking_responses = []
    for booking in bookings:
        user_data = users_dict.get(booking["user_id"])
        property_data = properties_dict.get(booking["property_id"])
        
        # Get landlord data if needed
        landlord_data = None
        if property_data and property_data.get("landlord_id"):
            landlord_data = users_dict.get(property_data["landlord_id"])
        
        # Create response efficiently without additional DB calls
        booking_response = BookingResponse(
            id=str(booking["_id"]),
            property_id=str(booking["property_id"]),
            user_id=str(booking["user_id"]),
            check_in=booking["check_in"],
            check_out=booking["check_out"],
            guests=booking["guests"],
            total_price=booking["total_price"],
            special_requests=booking.get("special_requests"),
            status=booking["status"],
            created_at=booking["created_at"],
            updated_at=booking["updated_at"],
            property_title=property_data["title"] if property_data else None,
            property_location=property_data["location"]["address"] if property_data and property_data.get("location") else None,
            user_name=f"{user_data['first_name']} {user_data['last_name']}" if user_data else None,
            user_email=user_data["email"] if user_data else None,
            user_phone=user_data.get("phone") if user_data else None,
            landlord_name=f"{landlord_data['first_name']} {landlord_data['last_name']}" if landlord_data else None,
            landlord_email=landlord_data["email"] if landlord_data else None
        )
        
        booking_responses.append(booking_response)
        print(f"DEBUG: Added booking response: {booking_response.id} - {booking_response.user_name}")
    
    # Get total count for pagination
    total_count = await db.bookings.count_documents(filter_query)
    
    # Calculate pagination metadata
    current_page = (skip // limit) + 1
    total_pages = (total_count + limit - 1) // limit  # Ceiling division
    
    print(f"DEBUG: Returning {len(booking_responses)} booking responses out of {total_count} total")
    
    return PaginatedBookingResponse(
        items=booking_responses,
        total=total_count,
        page=current_page,
        per_page=limit,
        total_pages=total_pages
    )


class BookingApprovalRequest(BaseModel):
    message_data: Optional[dict] = None

@router.post("/{booking_id}/approve")
async def approve_booking(
    booking_id: str,
    request: BookingApprovalRequest,
    current_user: User = Depends(get_current_landlord),
    db = Depends(get_database)
):
    """Approve booking request (landlords only)"""
    # Check if booking exists and belongs to landlord's property
    booking_data = await db.bookings.find_one({"_id": ObjectId(booking_id)})
    
    if not booking_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Check if landlord owns the property
    property_data = await db.properties.find_one({
        "_id": booking_data["property_id"],
        "landlord_id": ObjectId(current_user.id)
    })
    
    if not property_data:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to approve this booking"
        )
    
    # Check if booking is pending
    if booking_data["status"] != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending bookings can be approved"
        )
    
    # Get response message if provided
    response_message = ""
    if request.message_data and request.message_data.get("response_message"):
        response_message = request.message_data.get("response_message")
    
    # Approve booking
    update_data = {
        "status": "confirmed", 
        "updated_at": datetime.utcnow()
    }
    if response_message:
        update_data["landlord_response"] = response_message
    
    await db.bookings.update_one(
        {"_id": ObjectId(booking_id)},
        {"$set": update_data}
    )
    
    return {"message": "Booking approved successfully"}


@router.post("/{booking_id}/reject")
async def reject_booking(
    booking_id: str,
    request: BookingApprovalRequest,
    current_user: User = Depends(get_current_landlord),
    db = Depends(get_database)
):
    """Reject booking request (landlords only)"""
    # Check if booking exists and belongs to landlord's property
    booking_data = await db.bookings.find_one({"_id": ObjectId(booking_id)})
    
    if not booking_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Check if landlord owns the property
    property_data = await db.properties.find_one({
        "_id": booking_data["property_id"],
        "landlord_id": ObjectId(current_user.id)
    })
    
    if not property_data:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to reject this booking"
        )
    
    # Check if booking is pending
    if booking_data["status"] != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending bookings can be rejected"
        )
    
    # Get response message if provided
    response_message = ""
    if request.message_data and request.message_data.get("response_message"):
        response_message = request.message_data.get("response_message")
    
    # Reject booking
    update_data = {
        "status": "cancelled", 
        "updated_at": datetime.utcnow()
    }
    if response_message:
        update_data["landlord_response"] = response_message
    
    await db.bookings.update_one(
        {"_id": ObjectId(booking_id)},
        {"$set": update_data}
    )
    
    return {"message": "Booking rejected successfully"}


async def get_booking_with_details(booking_id: ObjectId, db) -> BookingResponse:
    """Get booking with property and user details"""
    # Get booking
    booking = await db.bookings.find_one({"_id": booking_id})
    
    # Get property details
    property_data = await db.properties.find_one({"_id": booking["property_id"]})
    
    # Get user details
    user_data = await db.users.find_one({"_id": booking["user_id"]})
    
    # Get landlord details if property exists
    landlord_data = None
    if property_data and property_data.get("landlord_id"):
        landlord_data = await db.users.find_one({"_id": property_data["landlord_id"]})
    
    # Create response
    booking_response = BookingResponse(
        id=str(booking["_id"]),
        property_id=str(booking["property_id"]),
        user_id=str(booking["user_id"]),
        check_in=booking["check_in"],
        check_out=booking["check_out"],
        guests=booking["guests"],
        total_price=booking["total_price"],
        special_requests=booking.get("special_requests"),
        status=booking["status"],
        created_at=booking["created_at"],
        updated_at=booking["updated_at"],
        property_title=property_data["title"] if property_data else None,
        property_location=property_data["location"]["address"] if property_data else None,
        user_name=f"{user_data['first_name']} {user_data['last_name']}" if user_data else None,
        user_email=user_data["email"] if user_data else None,
        user_phone=user_data.get("phone") if user_data else None,
        landlord_name=f"{landlord_data['first_name']} {landlord_data['last_name']}" if landlord_data else None,
        landlord_email=landlord_data["email"] if landlord_data else None
    )
    
    return booking_response