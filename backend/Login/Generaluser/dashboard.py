from sqlalchemy.orm import Session
from sqlalchemy import desc
from backend.models import User
from backend.assessment.models import AssessmentResult
from backend.mood.models import MoodEntry


def get_general_dashboard(db: Session, user: User):

    # 🔥 PROFILE (same key as student/staff)
    profile = {
        "name": user.name,
        "email": user.email
    }

    # 🔥 ALL ASSESSMENTS
    assessments = db.query(AssessmentResult)\
        .filter(AssessmentResult.user_id == user.id)\
        .order_by(desc(AssessmentResult.created_at))\
        .all()

    total = len(assessments)
    latest = assessments[0] if total > 0 else None

    # 🔥 MOODS
    moods = db.query(MoodEntry)\
        .filter(MoodEntry.user_id == user.id)\
        .order_by(desc(MoodEntry.created_at))\
        .all()

    # 🔥 CALCULATIONS
    avg_score = (
        sum(a.total_score for a in assessments) / total
        if total > 0 else None
    )

    risk = latest.risk_level if latest else "Not Assessed"

    # ✅ FINAL RESPONSE (SAME FORMAT AS STUDENT & STAFF)
    return {
        "message": "Welcome General User 🙋",

        "student_profile": profile,   # 🔥 SAME KEY

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