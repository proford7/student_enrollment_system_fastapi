from jose import jwt
from datetime import datetime, timedelta
from config.settings import settings

def create_token(data: dict):
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(
        hours=settings.ACCESS_TOKEN_EXPIRE_HOURS
    )

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )

def create_verification_token(email: str):
    # Verification tokens last for 24 hours
    payload = {"email": email, "type": "verification"}
    payload["exp"] = datetime.utcnow() + timedelta(hours=24)

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )


def verify_token(token: str):
    return jwt.decode(
        token,
        settings.SECRET_KEY,
        algorithms=[settings.ALGORITHM]
    )