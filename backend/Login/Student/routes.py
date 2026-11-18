from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.db import get_db
from backend.auth.deps import require_student
from backend.Login.Student.dashboard import get_student_dashboard

router = APIRouter(
    prefix="/student",
    tags=["Student Dashboard"]
)

@router.get("/dashboard")
def student_dashboard(
    current_user = Depends(require_student),
    db: Session = Depends(get_db)
):
    return get_student_dashboard(db, current_user)