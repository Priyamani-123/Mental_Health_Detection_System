from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer

from backend.db import get_db
from backend.users.models import User
from backend.config import settings

# 🔐 Token extractor
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# 🔥 GET CURRENT USER
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        email: str = payload.get("sub")
        role: str = payload.get("role")   # 🔥 EXTRA CHECK

        if email is None or role is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token decode failed"
        )

    user = db.query(User).filter(User.email == email).first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    return user


# 🔐 ROLE BASED ACCESS (FINAL)

def require_student(current_user: User = Depends(get_current_user)):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students allowed")
    return current_user


def require_staff(current_user: User = Depends(get_current_user)):
    if current_user.role != "staff":
        raise HTTPException(status_code=403, detail="Only staff allowed")
    return current_user


def require_general(current_user: User = Depends(get_current_user)):
    if current_user.role != "general":
        raise HTTPException(status_code=403, detail="Only general users allowed")
    return current_user


def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admin allowed")
    return current_user