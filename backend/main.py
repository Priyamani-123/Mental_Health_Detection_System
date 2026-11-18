from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Mental Health Early Detection API", description="API for mental health early detection system")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
from backend.models import User
from backend.db import Base, engine
from backend.auth.routes import router as auth_router
from backend.Login.Student.routes import router as student_router
from backend.Login.Staff.routes import router as staff_router
from backend.Login.Generaluser.routes import router as general_router
from backend.assessment.routes import router as assessment_router
from backend.mood.routes import router as mood_router
from backend.ml.routes import router as ml_router
from backend.report.routes import router as reports_router
from backend.admin.routes import router as admin_router
from backend.models import User

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(student_router)
app.include_router(staff_router)
app.include_router(general_router)
app.include_router(assessment_router)
app.include_router(mood_router)
app.include_router(ml_router)
app.include_router(reports_router)
app.include_router(admin_router)

@app.get("/admin/users")
def get_admin_users():
    return[
        {
            "id": 1,
            "name": "Test User",
            "email": "test@gmail.com",
            "role": "admin",
            "status":"active",
        }

    ]