from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from backend.users.models import User
from backend.utils.security import verify_password
from backend.utils.jwt import create_access_token, create_refresh_token


def authenticate_user(db: Session, email: str, password: str):

    user = db.query(User).filter(User.email == email).first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if not verify_password(password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    return user


def login_user(db: Session, email: str, password: str):

    user = authenticate_user(db, email, password)

    access_token = create_access_token(
        {"sub": user.email, "role": user.role}
    )

    refresh_token = create_refresh_token(
        {"sub": str(user.id)}
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }