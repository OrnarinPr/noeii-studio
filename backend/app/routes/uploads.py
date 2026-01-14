from pathlib import Path
import uuid

from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status
from app.auth import require_admin

router = APIRouter()

# Always resolve uploads directory relative to this file location:
# backend/app/routes/uploads.py -> backend/app/storage/uploads
BASE_DIR = Path(__file__).resolve().parents[1]  # .../app
UPLOAD_DIR = BASE_DIR / "storage" / "uploads"
ALLOWED_EXT = {".png", ".jpg", ".jpeg", ".webp"}


@router.post("/")
async def upload_image(
    file: UploadFile = File(...),
    _=Depends(require_admin),
):
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXT:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Unsupported file type. Use PNG, JPG, JPEG, or WEBP.",
        )

    name = f"{uuid.uuid4().hex}{ext}"
    out_path = UPLOAD_DIR / name

    content = await file.read()
    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Empty file.",
        )

    out_path.write_bytes(content)

    # This matches: app.mount("/uploads", StaticFiles(directory="app/storage/uploads"), ...)
    return {"url": f"/uploads/{name}"}
