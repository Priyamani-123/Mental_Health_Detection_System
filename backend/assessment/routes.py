from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.db import get_db
from backend.auth.deps import get_current_user
from .service import fetch_questions, submit_assessment
from .schemas import (
    QuestionResponse,
    AssessmentSubmission,
    AssessmentResultResponse
)

router = APIRouter(
    prefix="/assessment",
    tags=["Assessment"]
)


# ✅ GET QUESTIONS (ROLE BASED)
@router.get("/questions", response_model=list[QuestionResponse])
def get_questions(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        return fetch_questions(db, current_user.role)
    except Exception as e:
        print("❌ QUESTIONS ERROR:", str(e))
        raise HTTPException(status_code=500, detail="Failed to fetch questions")


# ✅ SUBMIT ASSESSMENT (FINAL)
@router.post("/submit", response_model=AssessmentResultResponse)
def submit_assessment_answers(
    data: AssessmentSubmission,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        print("🔥 USER ID:", current_user.id)
        print("🔥 RECEIVED ANSWERS:", data.answers)

        result = submit_assessment(
            db=db,
            user_id=current_user.id,
            answers=data.answers
        )

        print("✅ FINAL RESULT:", result)

        return result

    except Exception as e:
        print("❌ SUBMIT ERROR:", str(e))
        raise HTTPException(status_code=500, detail="Assessment submission failed")