from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session
from sqlalchemy import desc

from backend.db import get_db
from backend.auth.deps import require_staff
from backend.models import User
from backend.assessment.models import AssessmentResult
from backend.mood.models import MoodEntry

router = APIRouter(
    prefix="/staff",
    tags=["Staff Dashboard"]
)

# ✅ GET DASHBOARD
@router.get("/dashboard")
def staff_dashboard(
    current_user: User = Depends(require_staff),
    db: Session = Depends(get_db)
):
    return get_staff_dashboard(db, current_user)


# ✅ 🔥 ADD THIS (IMPORTANT)
@router.post("/submit-assessment")
def submit_staff_assessment(
    answers: dict = Body(...),
    current_user: User = Depends(require_staff),
    db: Session = Depends(get_db)
):
    print("🔥 STAFF ID:", current_user.id)

    score = sum(answers.values())

    if score <= 10:
        risk = "low"
    elif score <= 20:
        risk = "moderate"
    else:
        risk = "severe"

    result = AssessmentResult(
        user_id=current_user.id,
        total_score=score,
        risk_level=risk
    )

    db.add(result)
    db.commit()
    db.refresh(result)

    print("✅ SAVED:", result.id)

    return {
        "message": "Assessment submitted",
        "score": score,
        "risk": risk
    }


# ✅ SERVICE FUNCTION
def get_staff_dashboard(db: Session, staff: User):

    profile = {
        "name": staff.name,
        "email": staff.email
    }

    assessments = db.query(AssessmentResult)\
        .filter(AssessmentResult.user_id == staff.id)\
        .order_by(desc(AssessmentResult.created_at))\
        .all()

    total = len(assessments)
    latest = assessments[0] if total > 0 else None

    moods = db.query(MoodEntry)\
        .filter(MoodEntry.user_id == staff.id)\
        .order_by(desc(MoodEntry.created_at))\
        .all()

    avg_score = (
        sum(a.total_score for a in assessments) / total
        if total > 0 else None
    )

    risk = latest.risk_level if latest else "Not Assessed"

    return {
        "message": "Welcome Staff 👩‍🏫",

        "student_profile": profile,

        "mental_health_summary": {
            "total_assessments": total,
            "latest_score": latest.total_score if latest else None,
            "risk_level": risk
        },

        "report_summary": {
            "average_score": avg_score,
            "risk_trend": risk
        },

        "recent_assessments": [
            {
                "score": a.total_score,
                "risk": a.risk_level
            }
            for a in assessments[:3]
        ],

        "moods": [
            {
                "mood_label": m.mood_label,
                "mood_score": m.mood_score,
                "created_at": m.created_at
            }
            for m in moods[:3]
        ]
    }