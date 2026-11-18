from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from backend.db import Base

class User(Base):
    __tablename__ = "users"
    __table_args__ = {"extend_existing": True}  # To avoid warnings if table already exists

    id = Column(Integer, primary_key=True, index=True)

    # Basic Details
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)

    # Role (student / staff / general / admin)
    role = Column(String(20), nullable=False, default="student")

    # Profile Info (Mental Health System specific)
    age = Column(Integer, nullable=True)
    gender = Column(String(20), nullable=True)
    department = Column(String(100), nullable=True)   # for students/staff
    year_of_study = Column(String(20), nullable=True) # for students

    # Account Status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)

    # Audit Fields
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())