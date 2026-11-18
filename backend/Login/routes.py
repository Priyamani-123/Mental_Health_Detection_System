from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.db import get_db
from backend.auth.schemas import LoginRequest, TokenResponse
from backend.Login.service import login_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    try:
        result = login_user(db,data.email, data.password)
        print("LOGIN RESULT:",result)
        return result
    except Exception as e:
        print("LOGIN ERROR:",str(e))
        raise
    