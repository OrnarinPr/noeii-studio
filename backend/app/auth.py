import os
import secrets
from fastapi import Header, HTTPException

ADMIN_PASSCODE = os.getenv("ADMIN_PASSCODE", "1234")  # change later
TOKENS: set[str] = set()

def issue_token(passcode: str) -> str:
    if passcode != ADMIN_PASSCODE:
        raise HTTPException(status_code=401, detail="Invalid passcode")
    token = secrets.token_urlsafe(32)
    TOKENS.add(token)
    return token

def require_admin(authorization: str | None = Header(default=None)) -> None:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.split(" ", 1)[1].strip()
    if token not in TOKENS:
        raise HTTPException(status_code=401, detail="Invalid token")
