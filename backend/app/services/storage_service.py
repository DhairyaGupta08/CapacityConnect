"""File storage service abstraction supporting local storage and S3."""
import os
import uuid
from typing import Any

from app.core.config import settings


class StorageService:
    @staticmethod
    def get_upload_url(filename: str, content_type: str = "application/pdf") -> dict[str, Any]:
        """Generate upload endpoint / metadata for file uploads."""
        file_ext = os.path.splitext(filename)[1]
        unique_name = f"{uuid.uuid4()}{file_ext}"

        if settings.STORAGE_BACKEND == "local":
            upload_dir = os.path.join(settings.LOCAL_STORAGE_DIR, "uploads")
            os.makedirs(upload_dir, exist_ok=True)
            return {
                "upload_url": f"/api/storage/upload?key={unique_name}",
                "file_key": unique_name,
                "public_url": f"/uploads/{unique_name}",
            }
        else:
            # S3 presigned URL generation placeholder
            return {
                "upload_url": f"https://{settings.S3_BUCKET}.s3.amazonaws.com/{unique_name}",
                "file_key": unique_name,
                "public_url": f"https://{settings.S3_BUCKET}.s3.amazonaws.com/{unique_name}",
            }
