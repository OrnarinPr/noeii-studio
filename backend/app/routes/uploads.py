import os
import uuid
from fastapi import APIRouter, Depends, File, UploadFile
from app.auth import require_admin

router = APIRouter()

UPLOAD_DIR = os.path.join("app", "storage", "uploads")

@router.post("")
async def upload_image(file: UploadFile = File(...), _=Depends(require_admin)):
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in [".png", ".jpg", ".jpeg", ".webp"]:
        return {"error": "Unsupported file type"}

    name = f"{uuid.uuid4().hex}{ext}"
    out_path = os.path.join(UPLOAD_DIR, name)

    content = await file.read()
    with open(out_path, "wb") as f:
        f.write(content)

    return {"url": f"/uploads/{name}"}
