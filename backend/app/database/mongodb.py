from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings


class MongoDB:
    client: AsyncIOMotorClient = None
    database = None


mongo_db = MongoDB()


async def connect_to_mongo():
    """Create database connection"""
    mongo_db.client = AsyncIOMotorClient(settings.mongodb_url)
    mongo_db.database = mongo_db.client[settings.database_name]
    print(f"Connected to MongoDB: {settings.database_name}")


async def close_mongo_connection():
    """Close database connection"""
    if mongo_db.client:
        mongo_db.client.close()
        print("Disconnected from MongoDB")


async def get_database():
    """Get database instance"""
    return mongo_db.database