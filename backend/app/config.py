import os
from dataclasses import dataclass
from dotenv import load_dotenv

load_dotenv()


@dataclass(frozen=True)
class Settings:
    host: str = os.getenv("HOST", "127.0.0.1")
    port: int = int(os.getenv("PORT", "8000"))

    jwt_secret: str = os.getenv("JWT_SECRET", "change_me")
    jwt_expire_minutes: int = int(os.getenv("JWT_EXPIRE_MINUTES", "240"))

    mfa_issuer: str = os.getenv("MFA_ISSUER", "NOEII_STUDIO")
    mfa_account: str = os.getenv("MFA_ACCOUNT", "admin@noeii")

    # Base32 secret for TOTP (Google Authenticator). Must be kept server-side only.
    mfa_secret: str = os.getenv("MFA_SECRET", "")

    # Guard for setup endpoints (QR provisioning).
    admin_setup_key: str = os.getenv("ADMIN_SETUP_KEY", "change_me_setup_key")


settings = Settings()
