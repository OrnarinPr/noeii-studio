import os, time, pyotp
from fastapi import APIRouter, HTTPException, Header, status
from jose import jwt
from pydantic import BaseModel

from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent  # backend/
load_dotenv(dotenv_path=BASE_DIR / ".env", override=True)


router = APIRouter()

ADMIN_PASSCODE = os.getenv("ADMIN_PASSCODE")
ADMIN_TOTP_SECRET = os.getenv("ADMIN_TOTP_SECRET")
JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret")
ALG = "HS256"

print("ADMIN_PASSCODE =", repr(ADMIN_PASSCODE))
print("ADMIN_TOTP_SECRET =", repr(ADMIN_TOTP_SECRET))


class LoginReq(BaseModel):
    passcode: str
    otp: str

@router.post("/login")
def login(body: LoginReq):
    if not ADMIN_PASSCODE or not ADMIN_TOTP_SECRET:
        raise HTTPException(status_code=500, detail="Admin auth is not configured")

    if body.passcode != ADMIN_PASSCODE:
        raise HTTPException(status_code=401, detail="invalid passcode")

    if not pyotp.TOTP(ADMIN_TOTP_SECRET).verify(body.otp, valid_window=1):
        raise HTTPException(status_code=401, detail="invalid otp")

    payload = {"sub": "admin", "exp": int(time.time()) + 60 * 60 * 8}
    token = jwt.encode(payload, JWT_SECRET, algorithm=ALG)
    return {"token": token}
