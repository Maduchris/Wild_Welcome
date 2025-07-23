from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "wild_welcome"
    
    # JWT
    secret_key: str = "your-super-secret-key-change-this-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 30
    
    # Cloudinary
    cloudinary_cloud_name: str
    cloudinary_api_key: str
    cloudinary_api_secret: str
    
    # Email
    email_host: str = "smtp.gmail.com"
    email_port: int = 587
    email_host_user: str
    email_host_password: str
    email_use_tls: bool = True
    
    # SMS
    gupshup_api_key: str
    gupshup_app_name: str
    gupshup_base_url: str = "https://api.gupshup.io/sm/api/v1"
    
    # CORS
    frontend_url: str = "http://localhost:3000"
    
    # Google OAuth
    google_client_id: Optional[str] = None
    
    class Config:
        env_file = ".env"


settings = Settings()