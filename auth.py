from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.hash import bcrypt
from database import SessionLocal
from backend.models import User

router = APIRouter()

@router.post("/register")
def register(email: str, password: str):
    db = SessionLocal()
    hashed_pw = bcrypt.hash(password)
    user = User(email=email, password=hashed_pw)
    db.add(user)
    db.commit()
    return {"message": "User registered successfully"}

@router.post("/login")
def login(email: str, password: str):
    db = SessionLocal()
    user = db.query(User).filter(User.email == email).first()
    if not user or not bcrypt.verify(password, user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    return {"message": "Login successful"}
