from sqlalchemy.orm import Session
from sqlalchemy import desc
from backend.models import User
from backend.assessment.models import AssessmentResult
from backend.mood.models import MoodEntry


def get_staff_dashboard(db: Session, staff: User):

    # 🔥 PROFILE
    profile = {
        "name": staff.name,
        "email": staff.email
    }

    # 🔥 ASSESSMENTS
    assessments = db.query(AssessmentResult)\
        .filter(AssessmentResult.user_id == staff.id)\
        .order_by(desc(AssessmentResult.created_at))\
        .all()

    total = len(assessments)

    latest = assessments[0] if total > 0 else None

    # 🔥 MOODS
    moods = db.query(MoodEntry)\
        .filter(MoodEntry.user_id == staff.id)\
        .order_by(desc(MoodEntry.created_at))\
        .all()

    # 🔥 SAFE CALCULATIONS
    avg_score = None
    if total > 0:
        avg_score = sum(a.total_score or 0 for a in assessments) / total

    risk = latest.risk_level if latest else "Not Assessed"
    latest_score = latest.total_score if latest else None

    # ✅ FINAL RESPONSE
    return {
        "message": "Welcome Staff 👩‍🏫",

        "student_profile": profile,

        "mental_health_summary": {
            "total_assessments": total,
            "latest_score": latest_score,
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
        ] if total > 0 else [],

        "moods": [
            {
                "mood_label": m.mood_label,
                "mood_score": m.mood_score,
                "created_at": m.created_at
            }
            for m in moods[:3]
        ] if len(moods) > 0 else []
    }