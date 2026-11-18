from sqlalchemy.orm import Session
from backend.mood.models import MoodEntry


def create_mood_entry(db: Session, user_id: int, mood_score: int, mood_label: str, notes: str | None):

    entry = MoodEntry(
        user_id=user_id,
        mood_score=mood_score,
        mood_label=mood_label,
        notes=notes
    )

    db.add(entry)
    db.commit()
    db.refresh(entry)

    return entry


def get_user_mood_history(db: Session, user_id: int):

    moods = db.query(MoodEntry)\
        .filter(MoodEntry.user_id == user_id)\
        .order_by(MoodEntry.created_at.desc())\
        .all()

    return moods