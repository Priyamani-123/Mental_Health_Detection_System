from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.db import Base


class AssessmentQuestion(Base):
    __tablename__ = "assessment_questions"

    id = Column(Integer, primary_key=True, index=True)
    question_text = Column(String, nullable=False)
    category = Column(String, nullable=False)


class AssessmentResult(Base):
    __tablename__ = "assessment_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    total_score = Column(Integer, nullable=False)
    risk_level = Column(String, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class AssessmentResponse(Base):
    __tablename__ = "assessment_responses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("assessment_questions.id"), nullable=False)

    answer_score = Column(Integer, nullable=False)