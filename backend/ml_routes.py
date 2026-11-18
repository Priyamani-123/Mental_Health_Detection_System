# backend/ml/routes.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.db import get_db
from backend.ml_predictor import predict_stress

router = APIRouter(prefix="/ml", tags=["ML"])

@router.post("/predict")
def predict(data: dict, db: Session = Depends(get_db)):

    features = data.get("features")

    result = predict_stress(features)

    return {
        "success": True,
        "data": result
    }