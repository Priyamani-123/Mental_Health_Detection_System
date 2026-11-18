# AI-Based Mental Health Early Detection System

## Project Overview

The AI-Based Mental Health Early Detection System is a web-based application that uses Machine Learning techniques to identify potential mental health risks at an early stage. It analyzes user assessment responses and mood-related information to predict risk levels and provide suitable recommendations.

## Problem Statement

Mental health problems can sometimes remain unnoticed because people may not recognize early warning signs. This project aims to provide an early risk screening system using questionnaires, mood tracking, and Machine Learning predictions.

## Technologies Used

### Frontend
- React.js
- HTML
- CSS
- JavaScript

### Backend
- Python
- FastAPI

### Machine Learning
- Machine Learning
- Random Forest Classifier
- Scikit-learn
- Pandas
- NumPy
- Joblib

### Database
- SQL

## Main Features

### 1. User Authentication
- User Registration
- User Login
- Forgot Password
- Logout

### 2. Student Dashboard
- Mental Health Assessment
- Mood Tracking
- View Assessment Results
- View Risk Prediction
- Get Recommendations

### 3. Assessment Module
- Questionnaire-based assessment
- Collect user responses
- Calculate assessment scores
- Submit assessment results

### 4. Mood Tracking Module
- Record daily mood
- Monitor mood changes
- Analyze mood-related information

### 5. Machine Learning Module
- Process assessment and mood-related features
- Analyze user information using a Random Forest model
- Predict potential risk levels
- Display prediction results

### 6. Admin and Staff Dashboard
- Manage application information
- View relevant user analytics
- Monitor assessment results

## System Workflow

1. User registers and logs into the application.
2. User completes the mental health assessment.
3. User enters mood-related information.
4. Backend processes the collected data.
5. Machine Learning model analyzes the input features.
6. System predicts a potential risk level.
7. Results and recommendations are displayed to the user.

## Machine Learning Features

The model uses features such as:

- Sleep Hours
- Stress Level
- Mood Variance
- Average Mood Score
- Assessment Score

The system uses a Random Forest Classifier to predict risk categories such as Minimal, Mild, Moderate, and Severe.

## Project Structure

```text
Mental_Health_Detection_System/
│
├── backend/
│   ├── auth/
│   ├── assessment/
│   ├── mood/
│   ├── report/
│   ├── admin/
│   └── main.py
│
├── frontend/
│   └── React application files
│
├── Dataset/
│
├── main.py
├── assessment.py
├── auth.py
├── database.py
├── ml_model.py
├── mental_model.pkl
├── mental_health.db
└── .gitignore
```

## How to Run the Project

### Backend
1. Open the project in VS Code.
2. Create and activate a Python virtual environment.
3. Install the required Python dependencies.
4. Start the FastAPI backend server.

### Frontend
1. Open the frontend folder.
2. Install the required npm dependencies.
3. Start the React development server.

## Future Enhancements

- Improve prediction accuracy with more
