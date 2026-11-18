from sqlalchemy.orm import Session
from backend.assessment.models import AssessmentResult


# 🔥 ROLE BASED QUESTIONS
def fetch_questions(db: Session, role: str):

    student_questions = [
        {"id": 1, "question": "Do you feel stressed about studies?"},
        {"id": 2, "question": "Do you feel anxious before exams?"},
        {"id": 3, "question": "Do you feel pressure from academics?"},
        {"id": 4, "question": "Do you have trouble concentrating in class?"},
        {"id": 5, "question": "Do you feel overwhelmed with assignments?"},
        {"id": 6, "question": "Do you feel tired during study hours?"},
        {"id": 7, "question": "Do you lose interest in studies?"},
        {"id": 8, "question": "Do you feel nervous while presenting?"},
        {"id": 9, "question": "Do you feel lonely in college?"},
        {"id": 10, "question": "Do you feel pressure from parents?"},
        {"id": 11, "question": "Do you feel distracted easily?"},
        {"id": 12, "question": "Do you feel low confidence?"},
        {"id": 13, "question": "Do you feel comparison stress?"},
        {"id": 14, "question": "Do you have sleep issues?"},
        {"id": 15, "question": "Do you feel burnout?"}
    ]

    staff_questions = [
        {"id": 101, "question": "Do you feel work pressure?"},
        {"id": 102, "question": "Do you feel stressed managing tasks?"},
        {"id": 103, "question": "Do you feel job insecurity?"},
        {"id": 104, "question": "Do you feel exhausted at work?"},
        {"id": 105, "question": "Do you feel lack of recognition?"},
        {"id": 106, "question": "Do you feel overwhelmed by workload?"},
        {"id": 107, "question": "Do you struggle with deadlines?"},
        {"id": 108, "question": "Do you feel work-life imbalance?"},
        {"id": 109, "question": "Do you feel low motivation?"},
        {"id": 110, "question": "Do you feel irritated at work?"},
        {"id": 111, "question": "Do you feel burnout?"},
        {"id": 112, "question": "Do you feel unsupported?"},
        {"id": 113, "question": "Do you feel mental fatigue?"},
        {"id": 114, "question": "Do you feel stressed about performance?"},
        {"id": 115, "question": "Do you feel overwhelmed daily?"}
    ]

    general_questions = [
        {"id": 201, "question": "Do you feel stressed daily?"},
        {"id": 202, "question": "Do you feel anxious frequently?"},
        {"id": 203, "question": "Do you feel lonely?"},
        {"id": 204, "question": "Do you feel tired often?"},
        {"id": 205, "question": "Do you feel low energy?"},
        {"id": 206, "question": "Do you feel nervous?"},
        {"id": 207, "question": "Do you feel hopeless?"},
        {"id": 208, "question": "Do you feel irritated easily?"},
        {"id": 209, "question": "Do you feel emotional instability?"},
        {"id": 210, "question": "Do you feel overwhelmed?"},
        {"id": 211, "question": "Do you feel disconnected?"},
        {"id": 212, "question": "Do you feel mood swings?"},
        {"id": 213, "question": "Do you feel stressed about life?"},
        {"id": 214, "question": "Do you feel burnout?"},
        {"id": 215, "question": "Do you feel mental pressure?"}
    ]

    options = [
        {"text": "Never", "score": 0},
        {"text": "Sometimes", "score": 1},
        {"text": "Often", "score": 2},
        {"text": "Always", "score": 3},
    ]

    if role == "student":
        questions = student_questions
    elif role == "staff":
        questions = staff_questions
    else:
        questions = general_questions

    return [
        {
            "id": q["id"],
            "question": q["question"],
            "options": options
        }
        for q in questions
    ]


# 🔥 RISK CALCULATION (CONSISTENT WITH FRONTEND COLORS)
def calculate_risk(score: int):
    if score <= 15:
        return "low"
    elif score <= 30:
        return "moderate"
    else:
        return "severe"


# 🔥 FINAL SUBMIT (FULL FIXED)
def submit_assessment(db: Session, user_id: int, answers):

    # 🔥 SAFE SCORE (handles both dict & object)
    total_score = 0
    for a in answers:
        if isinstance(a, dict):
            total_score += a.get("answer_score", 0)
        else:
            total_score += getattr(a, "answer_score", 0)

    # 🔥 RISK
    risk_level = calculate_risk(total_score)

    # 🔥 SAVE TO DB
    result = AssessmentResult(
        user_id=user_id,
        total_score=total_score,
        risk_level=risk_level
    )

    db.add(result)
    db.commit()
    db.refresh(result)

    print("✅ SAVED TO DB:", result.id)

    return {
        "total_score": total_score,
        "risk_level": risk_level
    }