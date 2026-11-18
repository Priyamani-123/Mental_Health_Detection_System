from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.db import get_db
from backend.auth.deps import get_current_user
from .schemas import MoodCreate, MoodResponse
from .service import create_mood_entry, get_user_mood_history

router = APIRouter(
    prefix="/mood",
    tags=["Mood Tracking"]
)


@router.post("/", response_model=MoodResponse)
def log_mood(
    data: MoodCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if data.mood_score < 1 or data.mood_score > 5:
        raise HTTPException(status_code=400,detail="Invalid mood score")

    return create_mood_entry(
        db,
        user_id=current_user.id,
        mood_score=data.mood_score,
        mood_label=data.mood_label,
        notes=data.notes
    )


@router.get("/history", response_model=list[MoodResponse])
def mood_history(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    return get_user_mood_history(db, current_user.id)