from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.db import get_db
from backend.auth.deps import require_general
from backend.Login.Generaluser.dashboard import get_general_dashboard

router = APIRouter(prefix="/general", tags=["General"])

@router.get("/dashboard")
def general_dashboard(
    current_user = Depends(require_general),   # 🔥 IMPORTANT
    db: Session = Depends(get_db)
):
    return get_general_dashboard(db, current_user)