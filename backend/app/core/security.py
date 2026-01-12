from datetime import datetime, timedelta, timezone
from jose import jwt
from fastapi import Header, HTTPException

from .config import settings


def create_jwt_token() -> str:
    now = datetime.now(timezone.utc)
    exp = now + timedelta(minutes=settings.jwt_expire_minutes)
    payload = {"sub": "admin", "iat": int(now.timestamp()), "exp": int(exp.timestamp())}
    return jwt.encode(payload, settings.jwt_secret, algorithm="HS256")


def verify_jwt_token(token: str) -> bool:
    try:
        jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
        return True
    except Exception:
        return False


def require_admin(authorization: str | None = Header(default=None)) -> None:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.split(" ", 1)[1].strip()
    if not verify_jwt_token(token):
        raise HTTPException(status_code=401, detail="Invalid token")
