from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId
from app.models.user import PyObjectId


class BookingBase(BaseModel):
    property_id: PyObjectId
    check_in: datetime
    check_out: datetime
    guests: int = Field(..., ge=1)
    total_price: float = Field(..., ge=0)
    special_requests: Optional[str] = None
    status: str = Field(default="pending", pattern="^(pending|confirmed|cancelled|completed)$")


class BookingCreate(BookingBase):
    pass


class BookingUpdate(BaseModel):
    check_in: Optional[datetime] = None
    check_out: Optional[datetime] = None
    guests: Optional[int] = None
    total_price: Optional[float] = None
    special_requests: Optional[str] = None
    status: Optional[str] = None


class BookingInDB(BookingBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class Booking(BookingBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class BookingResponse(BaseModel):
    id: str
    property_id: str
    user_id: str
    check_in: datetime
    check_out: datetime
    guests: int
    total_price: float
    special_requests: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime
    
    # Property and user details for responses
    property_title: Optional[str] = None
    property_location: Optional[str] = None
    user_name: Optional[str] = None
    user_email: Optional[str] = None