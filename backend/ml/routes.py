from fastapi import APIRouter, Depends
from backend.ml.schemas import PredictionInput, PredictionResponse
from .predictor import predict_risk
from backend.auth.deps import get_current_user

router = APIRouter(
    prefix="/ml",
    tags=["AI Prediction"]
)


@router.post("/predict-risk", response_model=PredictionResponse)
def predict_mental_health_risk(
    data: PredictionInput,
    current_user=Depends(get_current_user)
):
    print("📥 INPUT:", data)

    result = predict_risk(data)

    print("📤 OUTPUT:", result)

    return result