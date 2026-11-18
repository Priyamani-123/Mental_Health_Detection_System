import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib

# Dummy training data
X = np.array([
    [5,4,6],
    [2,1,2],
    [8,7,9],
    [3,2,3]
])

y = np.array(["Medium","Low","High","Low"])

model = RandomForestClassifier()
model.fit(X,y)

joblib.dump(model,"mental_model.pkl")

def predict_risk(depression, anxiety, stress):
    model = joblib.load("mental_model.pkl")
    prediction = model.predict([[depression, anxiety, stress]])
    return prediction[0]
