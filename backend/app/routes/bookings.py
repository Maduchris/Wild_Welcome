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

router = APIRouter(prefix="/bookings", tags=["Bookings"])


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
    
    # Check if property is available for those dates
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
    
    # Insert booking
    result = await db.bookings.insert_one(booking_doc)
    
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
    # Build filter query
    filter_query = {"user_id": ObjectId(current_user.id)}
    
    if status_filter:
        filter_query["status"] = status_filter
    
    # Get bookings
    bookings = await db.bookings.find(filter_query).skip(skip).limit(limit).to_list(None)
    
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


@router.get("/landlord/requests", response_model=List[BookingResponse])
async def get_landlord_booking_requests(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status_filter: Optional[str] = Query(None),
    current_user: User = Depends(get_current_landlord),
    db = Depends(get_database)
):
    """Get booking requests for landlord's properties"""
    # Get landlord's properties
    landlord_properties = await db.properties.find(
        {"landlord_id": ObjectId(current_user.id)}
    ).to_list(None)
    
    property_ids = [prop["_id"] for prop in landlord_properties]
    
    # Build filter query
    filter_query = {"property_id": {"$in": property_ids}}
    
    if status_filter:
        filter_query["status"] = status_filter
    
    # Get bookings
    bookings = await db.bookings.find(filter_query).skip(skip).limit(limit).to_list(None)
    
    # Get bookings with details
    booking_responses = []
    for booking in bookings:
        booking_response = await get_booking_with_details(booking["_id"], db)
        booking_responses.append(booking_response)
    
    return booking_responses


@router.post("/{booking_id}/approve")
async def approve_booking(
    booking_id: str,
    message_data: dict = None,
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
    if message_data and message_data.get("response_message"):
        response_message = message_data.get("response_message")
    
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
    message_data: dict = None,
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
    if message_data and message_data.get("response_message"):
        response_message = message_data.get("response_message")
    
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
        user_email=user_data["email"] if user_data else None
    )
    
    return booking_response