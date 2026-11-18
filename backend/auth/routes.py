from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from backend.db import get_db
from backend.auth.schemas import LoginRequest, RegisterRequest, TokenResponse
from backend.auth.service import login_user, register_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    try:
        print("🔥 REGISTER HIT")
        print("PASSWORD:",data.password)
        print ("LENGTH:",len(data.password))

        result = register_user(
            db,
            data.name,
            data.email,
            data.password,
            data.role
        )

        print("✅ SUCCESS")
        return result

    except Exception as e:
        print("❌ ERROR:", str(e))
        return {"error": str(e)}


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    return login_user(db, data.email, data.password)