# app/routes/admin_auth.py
import os, time, pyotp
from fastapi import APIRouter, HTTPException, Header
from jose import jwt
from pydantic import BaseModel

router = APIRouter()

ADMIN_PASSCODE = os.getenv("ADMIN_PASSCODE")
ADMIN_TOTP_SECRET = os.getenv("ADMIN_TOTP_SECRET")
JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret")
ALG = "HS256"

class LoginReq(BaseModel):
    passcode: str
    otp: str   # 6 digits

@router.post("/login")
def login(body: LoginReq):
    if body.passcode != ADMIN_PASSCODE:
        raise HTTPException(401, "invalid passcode")

    if not pyotp.TOTP(ADMIN_TOTP_SECRET).verify(body.otp, valid_window=1):
        raise HTTPException(401, "invalid otp")

    payload = {
        "sub": "admin",
        "exp": int(time.time()) + 60 * 60 * 8,
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=ALG)
    return {"token": token}

@router.get("/me")
def me(authorization: str | None = Header(default=None)):
    if not authorization:
        raise HTTPException(401)

    token = authorization.replace("Bearer ", "")
    jwt.decode(token, JWT_SECRET, algorithms=[ALG])
    return {"ok": True}
