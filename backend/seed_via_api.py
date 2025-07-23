#!/usr/bin/env python3
"""
Seed script for Wild Welcome - Rwanda Wildlife Tourism Platform
Uses API endpoints to create realistic data for landlord: kehindekehinde894@icloud.com
"""

import asyncio
import aiohttp
import json
from datetime import datetime, timedelta
from typing import List, Dict, Any

# API Base URL
BASE_URL = "http://localhost:8000/api"

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

# Sample users for creating bookings and reviews
SAMPLE_USERS_DATA = [
    {
        "email": "sarah.photographer@gmail.com",
        "password": "password123",
        "first_name": "Sarah",
        "last_name": "Wilson",
        "phone": "+1-555-0123",
        "user_type": "user"
    },
    {
        "email": "james.explorer@outlook.com",
        "password": "password123",
        "first_name": "James",
        "last_name": "Martinez",
        "phone": "+44-20-7946-0958",
        "user_type": "user"
    },
    {
        "email": "emma.wildlife@yahoo.com",
        "password": "password123",
        "first_name": "Emma",
        "last_name": "Thompson",
        "phone": "+61-2-9374-4000",
        "user_type": "user"
    },
    {
        "email": "michael.naturalist@gmail.com",
        "password": "password123",
        "first_name": "Michael",
        "last_name": "Chen",
        "phone": "+1-415-555-0198",
        "user_type": "user"
    }
]

async def login_user(session: aiohttp.ClientSession, email: str, password: str) -> str:
    """Login user and return access token"""
    login_data = {
        "email": email,
        "password": password
    }
    
    async with session.post(f"{BASE_URL}/auth/login", json=login_data) as resp:
        if resp.status == 200:
            result = await resp.json()
            return result["access_token"]
        else:
            text = await resp.text()
            raise Exception(f"Login failed for {email}: {resp.status} - {text}")

async def create_user(session: aiohttp.ClientSession, user_data: dict) -> dict:
    """Create a new user account"""
    async with session.post(f"{BASE_URL}/auth/register", json=user_data) as resp:
        if resp.status == 200:
            result = await resp.json()
            print(f"✅ Created user: {user_data['email']}")
            return result
        else:
            text = await resp.text()
            if "already registered" in text.lower():
                print(f"✅ User already exists: {user_data['email']}")
                return {"message": "User already exists"}
            else:
                raise Exception(f"Failed to create user {user_data['email']}: {resp.status} - {text}")

async def create_property(session: aiohttp.ClientSession, token: str, property_data: dict) -> dict:
    """Create a property using the landlord's token"""
    headers = {"Authorization": f"Bearer {token}"}
    
    async with session.post(f"{BASE_URL}/properties/", json=property_data, headers=headers) as resp:
        if resp.status == 200:
            result = await resp.json()
            print(f"✅ Created property: {property_data['title']}")
            return result
        else:
            text = await resp.text()
            raise Exception(f"Failed to create property: {resp.status} - {text}")

async def create_booking(session: aiohttp.ClientSession, token: str, booking_data: dict) -> dict:
    """Create a booking using user's token"""
    headers = {"Authorization": f"Bearer {token}"}
    
    async with session.post(f"{BASE_URL}/bookings/", json=booking_data, headers=headers) as resp:
        if resp.status == 200:
            result = await resp.json()
            print(f"✅ Created booking for property: {booking_data['property_id']}")
            return result
        else:
            text = await resp.text()
            raise Exception(f"Failed to create booking: {resp.status} - {text}")

async def create_review(session: aiohttp.ClientSession, token: str, review_data: dict) -> dict:
    """Create a review using user's token"""
    headers = {"Authorization": f"Bearer {token}"}
    
    async with session.post(f"{BASE_URL}/reviews/", json=review_data, headers=headers) as resp:
        if resp.status == 200:
            result = await resp.json()
            print(f"✅ Created review: {review_data['rating']} stars")
            return result
        else:
            text = await resp.text()
            raise Exception(f"Failed to create review: {resp.status} - {text}")

async def main():
    """Main seeding function"""
    print("🌍 Starting Wild Welcome data seeding via API...")
    print("="*60)
    
    async with aiohttp.ClientSession() as session:
        try:
            # 1. Login as landlord
            print("🔐 Logging in as landlord...")
            landlord_token = await login_user(session, LANDLORD_EMAIL, LANDLORD_PASSWORD)
            print(f"✅ Landlord logged in successfully")
            
            # 2. Create sample users
            print("\n👥 Creating sample users...")
            user_tokens = []
            for user_data in SAMPLE_USERS_DATA:
                await create_user(session, user_data)
                # Login to get token
                token = await login_user(session, user_data["email"], user_data["password"])
                user_tokens.append(token)
            
            # 3. Create properties as landlord
            print(f"\n🏡 Creating {len(PROPERTIES_DATA)} properties...")
            property_ids = []
            for property_data in PROPERTIES_DATA:
                property_result = await create_property(session, landlord_token, property_data)
                property_ids.append(property_result["id"])
            
            # 4. Skip bookings for now due to API issues
            print(f"\n⏭️  Skipping bookings creation (API issues)")
            booking_scenarios = []  # Empty for now
            
            # 5. Create reviews
            print(f"\n⭐ Creating reviews...")
            reviews_data = [
                {
                    "property_index": 0,
                    "user_index": 0,
                    "rating": 5,
                    "comment": "Absolutely incredible experience! The gorilla trekking from this lodge was a dream come true. The staff arranged everything perfectly and the views from our room were breathtaking. Perfect for wildlife photography!"
                },
                {
                    "property_index": 2,
                    "user_index": 1,
                    "rating": 5,
                    "comment": "As a professional wildlife photographer, I can't recommend this safari camp enough. The photography hides provided exceptional access to wildlife, and I captured some of my best shots here. The guides knew exactly where and when to find the animals."
                },
                {
                    "property_index": 4,
                    "user_index": 3,
                    "rating": 4,
                    "comment": "Beautiful eco-lodge with stunning lake views. The photo editing station was a great touch for photographers. Very peaceful and well-designed. Only minor issue was occasional wifi connectivity."
                },
                {
                    "property_index": 1,
                    "user_index": 2,
                    "rating": 5,
                    "comment": "Staying in this traditional house was like stepping into authentic Rwandan culture. The hosts were incredibly welcoming and taught us so much about local traditions. The mountain views are spectacular!"
                },
                {
                    "property_index": 5,
                    "user_index": 2,
                    "rating": 4,
                    "comment": "Great value accommodation in Kigali. Perfect for a night or two before heading out to the national parks. Clean, comfortable, and the host provided excellent recommendations for the city."
                }
            ]
            
            for review_data in reviews_data:
                review = {
                    "property_id": property_ids[review_data["property_index"]],
                    "rating": review_data["rating"],
                    "comment": review_data["comment"]
                }
                
                user_token = user_tokens[review_data["user_index"]]
                await create_review(session, user_token, review)
            
            # Create platform reviews (no property_id)
            platform_reviews = [
                {
                    "user_index": 0,
                    "rating": 5,
                    "comment": "Wild Welcome made planning my Rwanda photography trip so easy! The selection of wildlife-focused accommodations is unmatched. Every property I stayed at was perfect for photographers."
                },
                {
                    "user_index": 1,
                    "rating": 5,
                    "comment": "The best platform for finding authentic wildlife experiences in Rwanda. The hosts really understand what nature photographers need!"
                }
            ]
            
            for review_data in platform_reviews:
                review = {
                    "rating": review_data["rating"],
                    "comment": review_data["comment"]
                }
                
                user_token = user_tokens[review_data["user_index"]]
                await create_review(session, user_token, review)
            
            print("="*60)
            print("🎉 DATA SEEDING COMPLETED SUCCESSFULLY!")
            print("="*60)
            print(f"📊 Summary:")
            print(f"   • Landlord: {LANDLORD_EMAIL}")
            print(f"   • Properties created: {len(property_ids)}")
            print(f"   • Sample users: {len(SAMPLE_USERS_DATA)}")
            print(f"   • Bookings created: {len(booking_scenarios)}")
            print(f"   • Reviews created: {len(reviews_data) + len(platform_reviews)}")
            print("="*60)
            print("🔑 Landlord Login:")
            print(f"   Email: {LANDLORD_EMAIL}")
            print(f"   Password: {LANDLORD_PASSWORD}")
            print("="*60)
            print("🎯 Sample User Logins (all password: password123):")
            for user in SAMPLE_USERS_DATA:
                print(f"   • {user['first_name']} {user['last_name']}: {user['email']}")
            print("="*60)
            
        except Exception as e:
            print(f"❌ Error during seeding: {str(e)}")
            raise

if __name__ == "__main__":
    asyncio.run(main())