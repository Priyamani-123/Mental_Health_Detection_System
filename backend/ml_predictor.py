# backend/ml/predictor.py

import joblib
import os
import numpy as np

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")

model = joblib.load(MODEL_PATH)

def predict_stress(features: list):

    data = np.array(features).reshape(1, -1)
    prediction = model.predict(data)
    probability = model.predict_proba(data)

    return {
        "stress_level": int(prediction[0]),
        "confidence": float(max(probability[0]))
    }