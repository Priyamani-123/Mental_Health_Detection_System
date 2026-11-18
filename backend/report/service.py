from sqlalchemy.orm import Session
from backend.assessment.models import AssessmentResult
from backend.mood.models import MoodEntry
from backend.users.models import User


def generate_user_report(db: Session, user_id: int):

    user = db.query(User).filter(User.id == user_id).first()

    latest_assessment = (
        db.query(AssessmentResult)
        .filter(AssessmentResult.user_id == user_id)
        .order_by(AssessmentResult.created_at.desc())
        .first()
    )

    moods = (
        db.query(MoodEntry)
        .filter(MoodEntry.user_id == user_id)
        .order_by(MoodEntry.created_at.desc())
        .limit(7)
        .all()
    )

    mood_scores = [m.mood_score for m in moods]

    avg_mood = sum(mood_scores) / len(mood_scores) if mood_scores else None

    return {
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        },
        "latest_assessment": {
            "score": latest_assessment.total_score if latest_assessment else None,
            "risk_level": latest_assessment.risk_level if latest_assessment else None,
            "date": latest_assessment.created_at if latest_assessment else None
        },
        "mood_summary": {
            "entries": len(mood_scores),
            "average_mood_score": avg_mood
        }
    }


def generate_staff_overview(db: Session):

    students = db.query(User).filter(User.role == "student").all()

    reports = []

    for student in students:

        latest = (
            db.query(AssessmentResult)
            .filter(AssessmentResult.user_id == student.id)
            .order_by(AssessmentResult.created_at.desc())
            .first()
        )

        reports.append({
            "student_id": student.id,
            "name": student.name,
            "risk_level": latest.risk_level if latest else None,
            "score": latest.total_score if latest else None
        })

    return reports