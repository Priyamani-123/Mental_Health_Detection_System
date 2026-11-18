from pydantic import BaseModel


class PredictionInput(BaseModel):
    assessment_score: int
    avg_mood_score: float
    mood_variance: float
    sleep_hours: float   # ✅ FIXED
    stress_level: int


class PredictionResponse(BaseModel):
    risk_level: str
    probability: float