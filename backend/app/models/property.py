from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from app.models.user import PyObjectId


class Location(BaseModel):
    address: str
    city: str
    country: str = "Rwanda"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    near_park: Optional[str] = None  # Volcanoes National Park, Akagera National Park


class Amenities(BaseModel):
    wifi: bool = False
    parking: bool = False
    kitchen: bool = False
    ac: bool = False
    heating: bool = False
    washer: bool = False
    dryer: bool = False
    tv: bool = False
    workspace: bool = False
    balcony: bool = False
    garden: bool = False
    pool: bool = False
    gym: bool = False
    wildlife_viewing: bool = False
    photography_equipment: bool = False
    guided_tours: bool = False


class PropertyBase(BaseModel):
    title: str
    description: str
    property_type: str = Field(..., pattern="^(room|apartment|house|lodge)$")
    max_guests: int = Field(..., ge=1, le=20)
    bedrooms: int = Field(..., ge=1, le=10)
    bathrooms: int = Field(..., ge=1, le=10)
    price_per_night: float = Field(..., ge=0)
    security_deposit: Optional[float] = Field(None, ge=0)
    location: Location
    amenities: Amenities
    images: List[str] = []
    is_active: bool = True
    is_featured: bool = False


class PropertyCreate(PropertyBase):
    pass


class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    property_type: Optional[str] = None
    max_guests: Optional[int] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    price_per_night: Optional[float] = None
    security_deposit: Optional[float] = None
    location: Optional[Location] = None
    amenities: Optional[Amenities] = None
    images: Optional[List[str]] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None


class PropertyInDB(PropertyBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    landlord_id: PyObjectId
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class Property(PropertyBase):
    id: str = Field(...)
    landlord_id: str = Field(...)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class PropertySearch(BaseModel):
    location: Optional[str] = None
    near_park: Optional[str] = None
    max_guests: Optional[int] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    property_type: Optional[str] = None
    amenities: Optional[List[str]] = None
    check_in: Optional[datetime] = None
    check_out: Optional[datetime] = None