from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class MoodCreate(BaseModel):
    mood_score: int
    mood_label: str
    notes: Optional[str] = None


class MoodResponse(BaseModel):
    id: int
    mood_score: int
    mood_label: str
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True