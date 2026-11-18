from pydantic import BaseModel
from typing import List

class Option(BaseModel):
    text: str
    score: int
    
class QuestionResponse(BaseModel):
    id: int
    question: str
    options:list

class AnswerInput(BaseModel):
    question_id: int
    answer_score: int


class AssessmentSubmission(BaseModel):
    answers: List[AnswerInput]


class AssessmentResultResponse(BaseModel):
    total_score: int
    risk_level: str