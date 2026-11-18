from datetime import datetime, timedelta
from jose import jwt, JWTError
from backend.config import settings

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES


# 🔐 ACCESS TOKEN
def create_access_token(data: dict):
    to_encode = data.copy()

    # ✅ MUST: sub undali (email)
    if "sub" not in to_encode:
        raise ValueError("Token must contain 'sub' field")

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt


# 🔄 REFRESH TOKEN
def create_refresh_token(data: dict):
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(days=7)

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt


# 🔓 DECODE TOKEN
def decode_access_token(token: str):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except JWTError as e:
        print("JWT Decode Error:", str(e))  # 🔥 debug
        return None