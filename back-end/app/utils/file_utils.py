import os
import shutil
import uuid
from fastapi import UploadFile
from pathlib import Path

# Create upload directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

async def save_upload_file(file: UploadFile) -> str:
    """Save an uploaded file and return the path"""
    if not file:
        return None
        
    # Create unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = UPLOAD_DIR / unique_filename
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return f"uploads/{unique_filename}"