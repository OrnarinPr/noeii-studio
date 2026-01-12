from pydantic import BaseModel
from fastapi import APIRouter

from app.auth import issue_token

router = APIRouter()

class LoginBody(BaseModel):
    passcode: str

@router.post("/login")
def admin_login(body: LoginBody):
    token = issue_token(body.passcode)
    return {"token": token}
