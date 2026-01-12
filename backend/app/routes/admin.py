import base64
import io
import pyotp
import qrcode
from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel

from app.core.config import settings
from app.core.security import create_jwt_token, require_admin

router = APIRouter()


class LoginIn(BaseModel):
    otp: str


class TokenOut(BaseModel):
    token: str


class SetupOut(BaseModel):
    secret: str
    otpauth_url: str
    qr_png_base64: str


def _require_setup_key(x_setup_key: str | None) -> None:
    if not x_setup_key or x_setup_key != settings.admin_setup_key:
        raise HTTPException(status_code=401, detail="Unauthorized (setup)")


def _get_totp() -> pyotp.TOTP:
    if not settings.mfa_secret:
        raise HTTPException(status_code=400, detail="MFA not configured (missing MFA_SECRET)")
    return pyotp.TOTP(settings.mfa_secret)


@router.post("/login", response_model=TokenOut)
def login(payload: LoginIn):
    otp = (payload.otp or "").strip().replace(" ", "")
    if not otp.isdigit() or len(otp) != 6:
        raise HTTPException(status_code=400, detail="OTP must be 6 digits")

    totp = _get_totp()
    if not totp.verify(otp, valid_window=1):
        raise HTTPException(status_code=401, detail="Invalid OTP")

    return TokenOut(token=create_jwt_token())


@router.get("/me")
def me(authorization: str | None = Header(default=None)):
    require_admin(authorization)
    return {"ok": True}


@router.post("/mfa/setup", response_model=SetupOut)
def mfa_setup(x_setup_key: str | None = Header(default=None)):
    _require_setup_key(x_setup_key)

    secret = pyotp.random_base32()
    totp = pyotp.TOTP(secret)

    otpauth_url = totp.provisioning_uri(
        name=settings.mfa_account,
        issuer_name=settings.mfa_issuer,
    )

    qr = qrcode.QRCode(border=2, box_size=8)
    qr.add_data(otpauth_url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")

    buf = io.BytesIO()
    img.save(buf, format="PNG")
    qr_b64 = base64.b64encode(buf.getvalue()).decode("utf-8")

    return SetupOut(secret=secret, otpauth_url=otpauth_url, qr_png_base64=qr_b64)
