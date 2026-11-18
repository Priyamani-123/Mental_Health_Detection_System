from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from backend.users.models import User
from backend.utils.security import verify_password, hash_password
from backend.utils.jwt import create_access_token, create_refresh_token


# 🔐 REGISTER USER
def register_user(db: Session, name: str, email: str, password: str, role: str):

    existing_user = db.query(User).filter(User.email == email).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_password = hash_password(password)

    new_user = User(
        name=name,
        email=email,
        password=hashed_password,
        role=role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully"
    }


# 🔐 AUTHENTICATE USER
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


# 🔐 LOGIN USER
def login_user(db: Session, email: str, password: str):

    user = authenticate_user(db, email, password)

    # ✅ IMPORTANT: sub must be email
    access_token = create_access_token(
        {
            "sub": user.email,
            "role": user.role
        }
    )

    # ✅ keep refresh separate
    refresh_token = create_refresh_token(
        {
            "sub": user.email   # 🔥 FIX (id kakunda email use cheyyi)
        }
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }