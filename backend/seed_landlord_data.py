#!/usr/bin/env python3
"""
Seed script for Wild Welcome - Rwanda Wildlife Tourism Platform
Creates realistic data for landlord: kehindekehinde894@icloud.com
"""

import asyncio
import sys
import os
from datetime import datetime, timedelta
from typing import List, Dict, Any
import bcrypt
from bson import ObjectId

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__)))

from app.database.mongodb import get_database
from app.models.user import User
from app.models.property import Property
from app.models.booking import Booking
from app.models.review import Review

# Landlord credentials
LANDLORD_EMAIL = "kehindekehinde894@icloud.com"
LANDLORD_PASSWORD = "!PASSword123"

# Realistic property data for Rwanda wildlife tourism
PROPERTIES_DATA = [
    {
        "title": "Luxury Safari Lodge Near Volcanoes National Park",
        "description": "Experience the magic of Rwanda's mountain gorillas from this stunning eco-lodge. Located just 15 minutes from Volcanoes National Park, this premium accommodation offers breathtaking views of the Virunga Mountains and exceptional wildlife photography opportunities. The lodge features sustainable architecture with local materials, private terraces overlooking the forest, and expert guided tours to see the endangered mountain gorillas.",
        "property_type": "lodge",
        "max_guests": 4,
        "bedrooms": 2,
        "bathrooms": 2,
        "price_per_night": 450.00,
        "security_deposit": 900.00,
        "location": {
            "address": "Kinigi Sector, Musanze District",
            "city": "Musanze",
            "country": "Rwanda",
            "latitude": -1.4875,
            "longitude": 29.4864,
            "near_park": "Volcanoes National Park"
        },
        "amenities": {
            "wifi": True,
            "parking": True,
            "kitchen": True,
            "ac": False,
            "heating": True,
            "washer": True,
            "dryer": True,
            "tv": True,
            "workspace": True,
            "balcony": True,
            "garden": True,
            "pool": False,
            "gym": False,
            "wildlife_viewing": True,
            "photography_equipment": True,
            "guided_tours": True
        },
        "images": [
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1551918120-9739cb430c6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        ],
        "is_featured": True
    },
    {
        "title": "Traditional Rwandan House with Mountain Views",
        "description": "Immerse yourself in authentic Rwandan culture while staying in this beautifully restored traditional house. Located in the hills of Musanze, this property offers panoramic views of the Virunga Mountains and is perfect for photographers seeking to capture Rwanda's stunning landscapes. The house features traditional architecture with modern amenities, a beautiful garden with local flora, and easy access to both Volcanoes National Park and local communities.",
        "property_type": "house",
        "max_guests": 6,
        "bedrooms": 3,
        "bathrooms": 2,
        "price_per_night": 180.00,
        "security_deposit": 360.00,
        "location": {
            "address": "Musanze Hill, Nyakinama Sector",
            "city": "Musanze",
            "country": "Rwanda",
            "latitude": -1.4991,
            "longitude": 29.6336,
            "near_park": "Volcanoes National Park"
        },
        "amenities": {
            "wifi": True,
            "parking": True,
            "kitchen": True,
            "ac": False,
            "heating": False,
            "washer": False,
            "dryer": False,
            "tv": False,
            "workspace": False,
            "balcony": True,
            "garden": True,
            "pool": False,
            "gym": False,
            "wildlife_viewing": True,
            "photography_equipment": False,
            "guided_tours": True
        },
        "images": [
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1520637836862-4d197d17c8a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        ],
        "is_featured": False
    },
    {
        "title": "Akagera Safari Camp - Wildlife Photography Paradise",
        "description": "Located on the shores of Lake Ihema within Akagera National Park, this exclusive safari camp offers unparalleled access to Rwanda's big five and diverse wildlife. Perfect for serious wildlife photographers and nature enthusiasts, the camp provides specialized photography hides, early morning game drive access, and expert guides familiar with animal behavior patterns. Each tent is equipped with power for charging camera equipment and comfortable amenities after long days in the field.",
        "property_type": "lodge",
        "max_guests": 2,
        "bedrooms": 1,
        "bathrooms": 1,
        "price_per_night": 620.00,
        "security_deposit": 1200.00,
        "location": {
            "address": "Lake Ihema, Akagera National Park",
            "city": "Kayonza",
            "country": "Rwanda",
            "latitude": -2.4833,
            "longitude": 30.7500,
            "near_park": "Akagera National Park"
        },
        "amenities": {
            "wifi": False,
            "parking": True,
            "kitchen": False,
            "ac": False,
            "heating": False,
            "washer": False,
            "dryer": False,
            "tv": False,
            "workspace": False,
            "balcony": True,
            "garden": False,
            "pool": False,
            "gym": False,
            "wildlife_viewing": True,
            "photography_equipment": True,
            "guided_tours": True
        },
        "images": [
            "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1549366021-9f761d040a94?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1571310807071-bc59ba1e5abf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        ],
        "is_featured": True
    },
    {
        "title": "Cozy Mountain Cottage for Nature Lovers",
        "description": "Escape to this charming mountain cottage nestled in the foothills of the Virunga Mountains. This intimate retreat is perfect for couples or solo travelers seeking a peaceful base for exploring Rwanda's natural wonders. Wake up to the sounds of forest birds and enjoy your morning coffee on the private deck while watching for golden monkeys in the nearby trees. The cottage offers easy access to hiking trails, bird watching spots, and cultural village visits.",
        "property_type": "house",
        "max_guests": 3,
        "bedrooms": 2,
        "bathrooms": 1,
        "price_per_night": 95.00,
        "security_deposit": 190.00,
        "location": {
            "address": "Shingiro Sector, Musanze District",
            "city": "Musanze",
            "country": "Rwanda",
            "latitude": -1.5255,
            "longitude": 29.5947,
            "near_park": "Volcanoes National Park"
        },
        "amenities": {
            "wifi": True,
            "parking": False,
            "kitchen": True,
            "ac": False,
            "heating": True,
            "washer": False,
            "dryer": False,
            "tv": False,
            "workspace": True,
            "balcony": True,
            "garden": True,
            "pool": False,
            "gym": False,
            "wildlife_viewing": True,
            "photography_equipment": False,
            "guided_tours": False
        },
        "images": [
            "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        ],
        "is_featured": False
    },
    {
        "title": "Modern Eco-Lodge with Lake Kivu Views",
        "description": "This contemporary eco-lodge combines modern comfort with environmental sustainability, offering stunning views over Lake Kivu. Built with local materials and renewable energy systems, the lodge provides a luxurious yet responsible stay. Perfect for photographers interested in both wildlife and landscape photography, with easy access to boat trips on Lake Kivu, visits to local coffee farms, and day trips to nearby national parks. The property features a professional photo editing station and equipment storage.",
        "property_type": "lodge",
        "max_guests": 4,
        "bedrooms": 2,
        "bathrooms": 2,
        "price_per_night": 280.00,
        "security_deposit": 560.00,
        "location": {
            "address": "Kibuye Peninsula, Lake Kivu",
            "city": "Karongi",
            "country": "Rwanda",
            "latitude": -2.0605,
            "longitude": 29.3486,
            "near_park": "Nyungwe National Park"
        },
        "amenities": {
            "wifi": True,
            "parking": True,
            "kitchen": True,
            "ac": False,
            "heating": True,
            "washer": True,
            "dryer": True,
            "tv": True,
            "workspace": True,
            "balcony": True,
            "garden": True,
            "pool": True,
            "gym": False,
            "wildlife_viewing": True,
            "photography_equipment": True,
            "guided_tours": True
        },
        "images": [
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        ],
        "is_featured": True
    },
    {
        "title": "Budget-Friendly Room Near Kigali City Center",
        "description": "Comfortable and affordable accommodation in the heart of Kigali, perfect for travelers looking to explore Rwanda's capital before heading out on safari adventures. This modern room in a quiet residential area offers great value for money while providing easy access to the city's attractions, restaurants, and the Genocide Memorial. Ideal for budget-conscious photographers and travelers who need a convenient base in the city.",
        "property_type": "room",
        "max_guests": 2,
        "bedrooms": 1,
        "bathrooms": 1,
        "price_per_night": 45.00,
        "security_deposit": 90.00,
        "location": {
            "address": "Kacyiru Sector, Gasabo District",
            "city": "Kigali",
            "country": "Rwanda",
            "latitude": -1.9441,
            "longitude": 30.0619,
            "near_park": "Akagera National Park"
        },
        "amenities": {
            "wifi": True,
            "parking": False,
            "kitchen": False,
            "ac": False,
            "heating": False,
            "washer": False,
            "dryer": False,
            "tv": True,
            "workspace": True,
            "balcony": False,
            "garden": False,
            "pool": False,
            "gym": False,
            "wildlife_viewing": False,
            "photography_equipment": False,
            "guided_tours": False
        },
        "images": [
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        ],
        "is_featured": False
    }
]

# Sample users for bookings
SAMPLE_USERS_DATA = [
    {
        "email": "sarah.photographer@gmail.com",
        "first_name": "Sarah",
        "last_name": "Wilson",
        "phone": "+1-555-0123",
        "user_type": "user",
        "profile_image": "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
        "hashed_password": bcrypt.hashpw("password123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
        "is_active": True,
        "is_verified": True
    },
    {
        "email": "james.explorer@outlook.com",
        "first_name": "James",
        "last_name": "Martinez",
        "phone": "+44-20-7946-0958",
        "user_type": "user", 
        "profile_image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
        "hashed_password": bcrypt.hashpw("password123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
        "is_active": True,
        "is_verified": True
    },
    {
        "email": "emma.wildlife@yahoo.com",
        "first_name": "Emma",
        "last_name": "Thompson",
        "phone": "+61-2-9374-4000",
        "user_type": "user",
        "profile_image": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
        "hashed_password": bcrypt.hashpw("password123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
        "is_active": True,
        "is_verified": True
    },
    {
        "email": "michael.naturalist@gmail.com",
        "first_name": "Michael",
        "last_name": "Chen",
        "phone": "+1-415-555-0198",
        "user_type": "user",
        "profile_image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
        "hashed_password": bcrypt.hashpw("password123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
        "is_active": True,
        "is_verified": True
    }
]

async def create_or_update_landlord(db):
    """Create or update the landlord user"""
    print("🏠 Creating/updating landlord account...")
    
    landlord_data = {
        "email": LANDLORD_EMAIL,
        "first_name": "Kehinde",
        "last_name": "Oladele",
        "phone": "+250-788-123-456",
        "user_type": "landlord",
        "profile_image": "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
        "hashed_password": bcrypt.hashpw(LANDLORD_PASSWORD.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
        "is_active": True,
        "is_verified": True,
        "favourites": [],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Check if landlord exists
    existing_landlord = await db.users.find_one({"email": LANDLORD_EMAIL})
    
    if existing_landlord:
        # Update existing landlord
        await db.users.update_one(
            {"email": LANDLORD_EMAIL},
            {"$set": {
                "first_name": landlord_data["first_name"],
                "last_name": landlord_data["last_name"],
                "phone": landlord_data["phone"],
                "profile_image": landlord_data["profile_image"],
                "updated_at": datetime.utcnow()
            }}
        )
        landlord_id = existing_landlord["_id"]
        print(f"✅ Updated existing landlord: {LANDLORD_EMAIL}")
    else:
        # Create new landlord
        result = await db.users.insert_one(landlord_data)
        landlord_id = result.inserted_id
        print(f"✅ Created new landlord: {LANDLORD_EMAIL}")
    
    return landlord_id

async def create_sample_users(db):
    """Create sample users for bookings"""
    print("👥 Creating sample users...")
    
    user_ids = []
    for user_data in SAMPLE_USERS_DATA:
        # Add timestamps
        user_data["created_at"] = datetime.utcnow()
        user_data["updated_at"] = datetime.utcnow()
        user_data["favourites"] = []
        
        # Check if user exists
        existing_user = await db.users.find_one({"email": user_data["email"]})
        
        if existing_user:
            user_ids.append(existing_user["_id"])
            print(f"✅ User already exists: {user_data['email']}")
        else:
            result = await db.users.insert_one(user_data)
            user_ids.append(result.inserted_id)
            print(f"✅ Created user: {user_data['email']}")
    
    return user_ids

async def create_properties(db, landlord_id):
    """Create realistic properties for the landlord"""
    print("🏡 Creating properties...")
    
    property_ids = []
    for i, property_data in enumerate(PROPERTIES_DATA):
        # Add landlord and timestamps
        property_data["landlord_id"] = landlord_id
        property_data["is_active"] = True
        property_data["created_at"] = datetime.utcnow() - timedelta(days=30-i*3)  # Stagger creation dates
        property_data["updated_at"] = datetime.utcnow()
        
        # Insert property
        result = await db.properties.insert_one(property_data)
        property_ids.append(result.inserted_id)
        print(f"✅ Created property: {property_data['title']}")
    
    return property_ids

async def create_bookings(db, property_ids, user_ids):
    """Create realistic bookings"""
    print("📅 Creating bookings...")
    
    booking_scenarios = [
        {
            "property_index": 0,  # Luxury Safari Lodge
            "user_index": 0,      # Sarah
            "days_ahead": 45,
            "duration": 5,
            "guests": 2,
            "status": "confirmed",
            "special_requests": "Early morning gorilla trekking preferred. Need photography equipment storage."
        },
        {
            "property_index": 2,  # Akagera Safari Camp
            "user_index": 1,      # James
            "days_ahead": 30,
            "duration": 7,
            "guests": 2,
            "status": "confirmed", 
            "special_requests": "Professional wildlife photographer - need access to photography hides."
        },
        {
            "property_index": 1,  # Traditional House
            "user_index": 2,      # Emma
            "days_ahead": 15,
            "duration": 3,
            "guests": 4,
            "status": "pending",
            "special_requests": "Interested in cultural village visits and traditional cooking classes."
        },
        {
            "property_index": 4,  # Eco-Lodge Lake Kivu
            "user_index": 3,      # Michael
            "days_ahead": 60,
            "duration": 4,
            "guests": 2,
            "status": "confirmed",
            "special_requests": "Need workspace for photo editing and equipment charging facilities."
        },
        {
            "property_index": 3,  # Mountain Cottage
            "user_index": 0,      # Sarah (return customer)
            "days_ahead": 90,
            "duration": 6,
            "guests": 1,
            "status": "pending",
            "special_requests": "Solo photographer retreat - need quiet workspace and early morning access."
        },
        {
            "property_index": 5,  # Kigali Room
            "user_index": 2,      # Emma
            "days_ahead": 7,
            "duration": 2,
            "guests": 1,
            "status": "confirmed",
            "special_requests": "Layover before safari - need late check-in and early checkout."
        }
    ]
    
    for scenario in booking_scenarios:
        check_in = datetime.utcnow() + timedelta(days=scenario["days_ahead"])
        check_out = check_in + timedelta(days=scenario["duration"])
        
        property_data = PROPERTIES_DATA[scenario["property_index"]]
        total_price = property_data["price_per_night"] * scenario["duration"]
        
        booking_data = {
            "property_id": property_ids[scenario["property_index"]],
            "user_id": user_ids[scenario["user_index"]],
            "check_in": check_in,
            "check_out": check_out,
            "guests": scenario["guests"],
            "total_price": total_price,
            "special_requests": scenario["special_requests"],
            "status": scenario["status"],
            "created_at": datetime.utcnow() - timedelta(days=scenario["days_ahead"]+5),
            "updated_at": datetime.utcnow()
        }
        
        await db.bookings.insert_one(booking_data)
        print(f"✅ Created booking: {property_data['title']} for {SAMPLE_USERS_DATA[scenario['user_index']]['first_name']}")

async def create_reviews(db, property_ids, user_ids):
    """Create realistic reviews"""
    print("⭐ Creating reviews...")
    
    reviews_data = [
        {
            "property_index": 0,
            "user_index": 0,
            "rating": 5,
            "comment": "Absolutely incredible experience! The gorilla trekking from this lodge was a dream come true. The staff arranged everything perfectly and the views from our room were breathtaking. Perfect for wildlife photography!",
            "is_featured": True
        },
        {
            "property_index": 2,
            "user_index": 1,
            "rating": 5,
            "comment": "As a professional wildlife photographer, I can't recommend this safari camp enough. The photography hides provided exceptional access to wildlife, and I captured some of my best shots here. The guides knew exactly where and when to find the animals.",
            "is_featured": True
        },
        {
            "property_index": 4,
            "user_index": 3,
            "rating": 4,
            "comment": "Beautiful eco-lodge with stunning lake views. The photo editing station was a great touch for photographers. Very peaceful and well-designed. Only minor issue was occasional wifi connectivity.",
            "is_featured": False
        },
        {
            "property_index": 1,
            "user_index": 2,
            "rating": 5,
            "comment": "Staying in this traditional house was like stepping into authentic Rwandan culture. The hosts were incredibly welcoming and taught us so much about local traditions. The mountain views are spectacular!",
            "is_featured": True
        },
        {
            "property_index": 5,
            "user_index": 2,
            "rating": 4,
            "comment": "Great value accommodation in Kigali. Perfect for a night or two before heading out to the national parks. Clean, comfortable, and the host provided excellent recommendations for the city.",
            "is_featured": False
        }
    ]
    
    for review_data in reviews_data:
        user_data = SAMPLE_USERS_DATA[review_data["user_index"]]
        
        review = {
            "user_id": str(user_ids[review_data["user_index"]]),
            "property_id": str(property_ids[review_data["property_index"]]),
            "user_name": f"{user_data['first_name']} {user_data['last_name'][0]}.",
            "rating": review_data["rating"],
            "comment": review_data["comment"],
            "is_featured": review_data["is_featured"],
            "is_approved": True,
            "created_at": datetime.utcnow() - timedelta(days=10),
            "updated_at": datetime.utcnow()
        }
        
        await db.reviews.insert_one(review)
        print(f"✅ Created review: {review_data['rating']} stars from {user_data['first_name']}")
    
    # Create a couple of general platform reviews
    platform_reviews = [
        {
            "user_id": str(user_ids[0]),
            "property_id": None,
            "user_name": "Sarah W.",
            "rating": 5,
            "comment": "Wild Welcome made planning my Rwanda photography trip so easy! The selection of wildlife-focused accommodations is unmatched. Every property I stayed at was perfect for photographers.",
            "is_featured": True,
            "is_approved": True,
            "created_at": datetime.utcnow() - timedelta(days=5),
            "updated_at": datetime.utcnow()
        },
        {
            "user_id": str(user_ids[1]),
            "property_id": None,
            "user_name": "James M.",
            "rating": 5,
            "comment": "The best platform for finding authentic wildlife experiences in Rwanda. The hosts really understand what nature photographers need!",
            "is_featured": True,
            "is_approved": True,
            "created_at": datetime.utcnow() - timedelta(days=8),
            "updated_at": datetime.utcnow()
        }
    ]
    
    for review in platform_reviews:
        await db.reviews.insert_one(review)
        print(f"✅ Created platform review: {review['rating']} stars")

async def update_user_favorites(db, property_ids, user_ids):
    """Add some properties to user favorites"""
    print("❤️ Updating user favorites...")
    
    # Sarah likes luxury properties
    await db.users.update_one(
        {"_id": user_ids[0]},
        {"$set": {"favourites": [str(property_ids[0]), str(property_ids[2]), str(property_ids[4])]}}
    )
    
    # James likes safari experiences
    await db.users.update_one(
        {"_id": user_ids[1]},
        {"$set": {"favourites": [str(property_ids[2]), str(property_ids[0])]}}
    )
    
    # Emma likes cultural experiences
    await db.users.update_one(
        {"_id": user_ids[2]},
        {"$set": {"favourites": [str(property_ids[1]), str(property_ids[3])]}}
    )
    
    print("✅ Updated user favorites")

async def main():
    """Main seeding function"""
    print("🌍 Starting Wild Welcome data seeding for Rwanda...")
    print("="*60)
    
    # Connect to database
    db = await get_database()
    
    try:
        # Create/update landlord
        landlord_id = await create_or_update_landlord(db)
        
        # Create sample users
        user_ids = await create_sample_users(db)
        
        # Create properties
        property_ids = await create_properties(db, landlord_id)
        
        # Create bookings
        await create_bookings(db, property_ids, user_ids)
        
        # Create reviews  
        await create_reviews(db, property_ids, user_ids)
        
        # Update user favorites
        await update_user_favorites(db, property_ids, user_ids)
        
        print("="*60)
        print("🎉 DATA SEEDING COMPLETED SUCCESSFULLY!")
        print("="*60)
        print(f"📊 Summary:")
        print(f"   • Landlord: {LANDLORD_EMAIL}")
        print(f"   • Properties created: {len(property_ids)}")
        print(f"   • Sample users: {len(user_ids)}")
        print(f"   • Bookings created: 6")
        print(f"   • Reviews created: 7")
        print("="*60)
        print("🔑 Landlord Login:")
        print(f"   Email: {LANDLORD_EMAIL}")
        print(f"   Password: {LANDLORD_PASSWORD}")
        print("="*60)
        
    except Exception as e:
        print(f"❌ Error during seeding: {str(e)}")
        raise

if __name__ == "__main__":
    asyncio.run(main())