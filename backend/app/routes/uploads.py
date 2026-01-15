from pathlib import Path
import uuid
import os

from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status
from supabase import create_client, Client
from app.auth import require_admin

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise RuntimeError("Supabase env vars are not set")

supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
)

router = APIRouter()

ALLOWED_EXT = {".png", ".jpg", ".jpeg", ".webp"}
BUCKET = "images"


@router.post("/")
async def upload_image(
    file: UploadFile = File(...),
    _=Depends(require_admin),
):
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXT:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Unsupported file type. Use PNG, JPG, JPEG, or WEBP.",
        )

    content = await file.read()
    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Empty file.",
        )

    name = f"{uuid.uuid4().hex}{ext}"

    res = supabase.storage.from_(BUCKET).upload(
        name,
        content,
        {
            "content-type": file.content_type or "application/octet-stream"
        },
    )

    if res.get("error"):
        raise HTTPException(
            status_code=500,
            detail=res["error"]["message"],
        )

    public_url = supabase.storage.from_(BUCKET).get_public_url(name)

    return {
        "path": name,
        "url": public_url,
    }
