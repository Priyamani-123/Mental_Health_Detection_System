from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.db import get_db
from backend.auth.deps import get_current_user, require_staff
from backend.report.service import generate_user_report, generate_staff_overview

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


@router.get("/my-report")
def my_report(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    return generate_user_report(db, current_user.id)


@router.get("/staff-overview")
def staff_report(
    current_user=Depends(require_staff),
    db: Session = Depends(get_db)
):

    return generate_staff_overview(db)