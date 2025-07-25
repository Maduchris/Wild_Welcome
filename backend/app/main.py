from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.mongodb import connect_to_mongo, close_mongo_connection
from app.routes import auth, users, properties, bookings, reviews

# Create FastAPI app
app = FastAPI(
    title="Wild Welcome API",
    description="API for Wild Welcome - Property rental platform for wildlife photographers and eco-tourists",
    version="1.0.0"
)

# Add CORS middleware - Allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,  # Must be False with allow_origins=["*"]
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(properties.router, prefix="/api")
app.include_router(bookings.router, prefix="/api")
app.include_router(reviews.router, prefix="/api")

# Database connection events
@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

# Root endpoint
@app.get("/")
@app.get("/api/")
async def root():
    return {
        "message": "Welcome to Wild Welcome API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running"
    }

# Health check endpoint
@app.get("/health")
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": "2025-01-20", "service": "Wild Welcome API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)