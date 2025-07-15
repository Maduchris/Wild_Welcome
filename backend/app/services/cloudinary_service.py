import cloudinary
import cloudinary.uploader
import cloudinary.api
from app.core.config import settings
from typing import Optional
import os

# Configure Cloudinary
cloudinary.config(
    cloud_name=settings.cloudinary_cloud_name,
    api_key=settings.cloudinary_api_key,
    api_secret=settings.cloudinary_api_secret,
    secure=True
)


class CloudinaryService:
    @staticmethod
    def upload_image(file_path: str, folder: str = "wild_welcome") -> Optional[str]:
        """Upload image to Cloudinary"""
        try:
            result = cloudinary.uploader.upload(
                file_path,
                folder=folder,
                resource_type="image",
                quality="auto:good",
                fetch_format="auto"
            )
            return result.get("secure_url")
        except Exception as e:
            print(f"Error uploading to Cloudinary: {e}")
            return None

    @staticmethod
    def upload_multiple_images(file_paths: list, folder: str = "wild_welcome") -> list:
        """Upload multiple images to Cloudinary"""
        uploaded_urls = []
        for file_path in file_paths:
            url = CloudinaryService.upload_image(file_path, folder)
            if url:
                uploaded_urls.append(url)
        return uploaded_urls

    @staticmethod
    def delete_image(public_id: str) -> bool:
        """Delete image from Cloudinary"""
        try:
            result = cloudinary.uploader.destroy(public_id)
            return result.get("result") == "ok"
        except Exception as e:
            print(f"Error deleting from Cloudinary: {e}")
            return False

    @staticmethod
    def get_public_id_from_url(url: str) -> Optional[str]:
        """Extract public_id from Cloudinary URL"""
        try:
            # Extract public_id from URL
            parts = url.split('/')
            if 'wild_welcome' in parts:
                index = parts.index('wild_welcome')
                filename = parts[index + 1].split('.')[0]
                return f"wild_welcome/{filename}"
            return None
        except Exception as e:
            print(f"Error extracting public_id: {e}")
            return None


cloudinary_service = CloudinaryService()