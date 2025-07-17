#!/usr/bin/env python3
"""
Test database connection and User model
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import asyncio
from app.database.mongodb import get_database
from app.models.user import User
from bson import ObjectId

async def test_db():
    """Test database connection and User model"""
    print("🔍 Testing database connection and User model...")
    
    try:
        # Get database
        db = await get_database()
        print("✅ Database connection successful")
        
        # Find a user
        user_data = await db.users.find_one({"email": "test@example.com"})
        if user_data:
            print(f"✅ User found: {user_data['email']}")
            
            # Convert _id to id
            if "_id" in user_data:
                user_data["id"] = str(user_data["_id"])
                del user_data["_id"]
            
            print(f"User data after conversion: {user_data}")
            
            # Try to create User model
            try:
                user = User(**user_data)
                print(f"✅ User model created successfully: {user.email}")
                print(f"User ID: {user.id}")
                print(f"User type: {type(user.id)}")
            except Exception as e:
                print(f"❌ Error creating User model: {e}")
                import traceback
                traceback.print_exc()
        else:
            print("❌ No user found")
            
    except Exception as e:
        print(f"❌ Database error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_db()) 