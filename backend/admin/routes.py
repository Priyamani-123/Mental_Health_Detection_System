from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.db import get_db
from backend.auth.deps import require_admin
from backend.models import User
from backend.assessment.models import AssessmentResult

from sqlalchemy import desc

router = APIRouter(
    prefix="/admin",
    tags=["Admin Dashboard"]
)


# 🔥 FULL DASHBOARD (ALL FEATURES)
@router.get("/dashboard")
def admin_dashboard(
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    try:

        # ✅ STATISTICS
        total_users = db.query(User).count()
        total_students = db.query(User).filter(User.role == "student").count()
        total_staff = db.query(User).filter(User.role == "staff").count()
        total_general = db.query(User).filter(User.role == "general").count()
        total_assessments = db.query(AssessmentResult).count()

        high_risk_count = db.query(AssessmentResult)\
            .filter(AssessmentResult.risk_level.in_(["moderate", "severe"]))\
            .count()

        # ✅ ALL USERS
        users = db.query(User).all()

        all_users = [
            {
                "id": u.id,
                "name": u.name,
                "email": u.email,
                "role": u.role,
                "active": u.is_active
            }
            for u in users
        ]

        # ✅ HIGH RISK USERS (LATEST ONLY)
        high_risk_users = []

        for user in users:
            latest = db.query(AssessmentResult)\
                .filter(AssessmentResult.user_id == user.id)\
                .order_by(desc(AssessmentResult.created_at))\
                .first()

            if latest and latest.risk_level in ["moderate", "severe"]:
                high_risk_users.append({
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                    "role": user.role,
                    "score": latest.total_score,
                    "risk": latest.risk_level,
                    "date": latest.created_at
                })

        return {
            "message": "Welcome Admin 👑",

            "statistics": {
                "total_users": total_users,
                "students": total_students,
                "staff": total_staff,
                "general": total_general,
                "assessments_completed": total_assessments,
                "high_risk_count": high_risk_count
            },

            "high_risk_users": high_risk_users,

            "all_users": all_users
        }

    except Exception as e:
        print("❌ ADMIN ERROR:", str(e))
        raise HTTPException(status_code=500, detail="Admin dashboard failed")


# 🔥 DEACTIVATE USER (OPTIONAL FEATURE)
@router.put("/deactivate/{user_id}")
def deactivate_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_active = False
    db.commit()

    return {"message": "User deactivated successfully"}