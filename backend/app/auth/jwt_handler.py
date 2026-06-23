from jose import jwt, JWTError
from datetime import datetime, timedelta
from app.config.settings import (JWT_SECRET_KEY, JWT_ALGORITHM)


def create_access_token(data: dict):
    payload = data.copy()

    payload["exp"] = (datetime.utcnow() + timedelta(hours=1))

    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    
    return token


def verify_token(token: str):
    try:
        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM]
        )
        return payload

    except JWTError:
        return None