from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ReviewBase(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: str = Field(..., min_length=10, max_length=500)
    is_featured: bool = False
    is_approved: bool = False


class ReviewCreate(ReviewBase):
    property_id: Optional[str] = None  # Optional - can be general platform review


class ReviewUpdate(BaseModel):
    rating: Optional[int] = Field(None, ge=1, le=5)
    comment: Optional[str] = Field(None, min_length=10, max_length=500)
    is_featured: Optional[bool] = None
    is_approved: Optional[bool] = None


class Review(ReviewBase):
    id: str = Field(...)
    user_id: str = Field(...)
    property_id: Optional[str] = None
    user_name: str = Field(...)  # User's name for display
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True


class ReviewInDB(ReviewBase):
    user_id: str = Field(...)
    property_id: Optional[str] = None
    user_name: str = Field(...)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)