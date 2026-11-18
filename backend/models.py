# backend/users/model.py

from sqlalchemy import Column, Integer, String, Boolean
from backend.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True)
    password = Column(String, nullable=False)
    age = Column(Integer,nullable=True)
    gender = Column(String,nullable=True)
    role = Column(String, nullable=False)  # student, staff, general, admin
    is_active = Column(Boolean, default=True)
    
    class Questions(Base):
        __tablename__ = "questions"
        
        id = Column(Integer,primary_key=True, index=True)
        question_text = Column(String,nullable=False)