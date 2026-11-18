# backend/auth/service.py

from sqlalchemy.orm import Session
from fastapi import HTTPException
from backend.models import User
from backend.utils.security import hash_password, verify_password
from backend.utils.jwt import create_access_token

def register_user(db: Session, name: str, email: str, password: str, role: str):

    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        name=name,
        email=email,
        password=hash_password(password),
        role=role
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def login_user(db: Session, email: str, password: str):

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.email, "role": user.role})

    return {"access_token": token, "token_type": "bearer"}