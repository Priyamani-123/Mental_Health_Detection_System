from sqlalchemy.orm import Session
from sqlalchemy import desc
from backend.models import User
from backend.assessment.models import AssessmentResult
from backend.mood.models import MoodEntry
from backend.report.service import generate_user_report


def get_student_dashboard(db: Session, student: User):
    if not student:
        return {"error": "Student not found" }

    # 🧠 Assessment Results
    assessments = db.query(AssessmentResult)\
        .filter(AssessmentResult.user_id == student.id)\
        .order_by(desc(AssessmentResult.created_at))\
        .all()

    total_assessments = len(assessments)
    latest_assessment = assessments[0] if total_assessments > 0 else None

    # 😊 Mood Data
    moods = db.query(MoodEntry)\
        .filter(MoodEntry.user_id == student.id)\
        .order_by(desc(MoodEntry.created_at))\
        .limit(5)\
        .all()

    # 📊 Reports (reuse your existing service)
    report = generate_user_report(db, student.id)

    # 🚨 Alert Logic
    alert = None
    if latest_assessment and latest_assessment.risk_level in ["moderate", "moderately_severe", "severe"]:
        alert = f"⚠️ Your risk level is {latest_assessment.risk_level}. Please consider seeking help."

    return {
        "message": f"Welcome {student.name}",

        # 👤 Profile
        "student_profile": {
            "id": student.id if student else None,
            "name": getattr(student, "name", ""),
            "email": getattr(student,"email",""),
            "age": getattr(student,"age",""),
            "gender": getattr(student,"gender",""),
            "department": getattr(student,"department",""),
            "year_of_study": getattr(student,"year_of_study","")
        },

        # 🧠 Mental Health Summary
        "mental_health_summary": {
            "total_assessments": total_assessments,
            "latest_score": latest_assessment.total_score if latest_assessment else None,
            "risk_level": latest_assessment.risk_level if latest_assessment else "Not Assessed"
        },

        # 📈 Recent Assessments
        "recent_assessments": [
            {
                "score": a.total_score,
                "risk": a.risk_level,
                "date": a.created_at
            } for a in assessments[:5]
        ],

        # 😊 Recent Mood Logs
        "recent_moods": [
            {
                "mood": m.mood_label,
                "score": m.mood_score,
                "date": m.created_at
            } for m in moods
        ],

        # 📊 Reports Summary
        "report_summary": report,

        # 🚨 Alert
        "alert": alert
    }