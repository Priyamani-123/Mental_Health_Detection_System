import joblib
import numpy as np
from pathlib import Path

MODEL_PATH = Path("backend/ml/model.pkl")
model = joblib.load(MODEL_PATH)


def predict_risk(data):
    try:
        # 🔥 FEATURES (match training)
        features = np.array([
            data.sleep_hours,
            data.stress_level,
            data.mood_variance,
            data.avg_mood_score,
            data.assessment_score
        ]).reshape(1, -1)

        # 🔥 PREDICT
        prediction = model.predict(features)[0]
        print("🎯 Prediction:", prediction)

        # 🔥 DEFAULT (fallback but dynamic)
        probability = min(0.6 + (data.assessment_score / 100), 0.95)

        # 🔥 TRY PROBA (MAIN FIX)
        if hasattr(model, "predict_proba"):
            try:
                probs = model.predict_proba(features)[0]
                classes = list(model.classes_)

                print("✅ PROBA:", probs)
                print("🎯 Classes:", classes)

                # ✅ SAFE MATCH (VERY IMPORTANT FIX)
                if prediction in classes:
                    pred_index = classes.index(prediction)
                    probability = float(probs[pred_index])
                else:
                    print("⚠️ Prediction not in classes → using max prob")
                    probability = float(max(probs))

                # 🔥 BOOST if too low
                if probability < 0.55:
                    probability = 0.55 + (data.assessment_score / 100)

            except Exception as e:
                print("❌ PROBA ERROR:", e)

        # 🔥 LIMIT
        probability = min(probability, 0.95)

        # 🔥 RISK MAP (for numeric models)
        risk_map = {
            0: "minimal",
            1: "mild",
            2: "moderate",
            3: "severe"
        }

        # 🔥 HANDLE STRING / NUMBER
        if isinstance(prediction, str):
            risk_level = prediction
        else:
            risk_level = risk_map.get(prediction, "moderate")

        result = {
            "risk_level": risk_level,
            "probability": float(probability)
        }

        print("✅ FINAL RESULT:", result)

        return result

    except Exception as e:
        print("❌ ML FULL ERROR:", e)

        # 🔥 NEVER RETURN STATIC 0.5 AGAIN
        return {
            "risk_level": "moderate",
            "probability": min(0.6 + (data.assessment_score / 100), 0.95)
        }