from fastapi import APIRouter
from ml_model import predict_risk
from dl_model import predict_sentiment

router = APIRouter()

@router.post("/assess")
def assess(depression: float, anxiety: float, stress: float, text: str):

    risk = predict_risk(depression, anxiety, stress)
    sentiment = predict_sentiment(text)

    return {
        "risk_level": risk,
        "sentiment": sentiment
    }
