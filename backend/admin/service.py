from sqlalchemy.orm import Session
from sqlalchemy import desc
from backend.models import User
from backend.assessment.models import AssessmentResult


# 🔥 SYSTEM STATS (IMPROVED)
def get_system_statistics(db: Session):

    total_users = db.query(User).count()

    total_students = db.query(User).filter(User.role == "student").count()
    total_staff = db.query(User).filter(User.role == "staff").count()
    total_general = db.query(User).filter(User.role == "general").count()

    total_assessments = db.query(AssessmentResult).count()

    high_risk_count = db.query(AssessmentResult)\
        .filter(AssessmentResult.risk_level.in_(["moderate", "severe"]))\
        .count()

    return {
        "total_users": total_users,
        "students": total_students,
        "staff": total_staff,
        "general": total_general,
        "assessments_completed": total_assessments,
        "high_risk_count": high_risk_count
    }


# 🔥 ALL USERS (CLEAN)
def list_users(db: Session):

    users = db.query(User).all()

    return [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "active": u.is_active
        }
        for u in users
    ]


# 🔥 DEACTIVATE USER
def deactivate_user(db: Session, user_id: int):

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        return {"error": "User not found"}

    user.is_active = False
    db.commit()

    return {"message": "User deactivated successfully"}


# 🔥 HIGH RISK USERS (FINAL FIXED 🔥)
def get_high_risk_users(db: Session):

    users = db.query(User).all()

    high_risk_list = []

    for user in users:

        # 🔥 GET LATEST ASSESSMENT
        latest = db.query(AssessmentResult)\
            .filter(AssessmentResult.user_id == user.id)\
            .order_by(desc(AssessmentResult.created_at))\
            .first()

        if latest and latest.risk_level in ["moderate", "severe"]:
            high_risk_list.append({
                "user_id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "score": latest.total_score,
                "risk_level": latest.risk_level,
                "date": latest.created_at
            })

    return high_risk_list


# 🔥 FULL ADMIN DASHBOARD (ALL-IN-ONE 🔥)
def get_admin_dashboard(db: Session):

    stats = get_system_statistics(db)
    users = list_users(db)
    high_risk = get_high_risk_users(db)

    return {
        "message": "Welcome Admin 👑",

        "statistics": stats,

        "high_risk_users": high_risk,

        "all_users": users
    }