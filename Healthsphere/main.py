from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Dict

app = FastAPI(title="SIH 2026 Health Triage API")
app.mount("/static", StaticFiles(directory="."), name="static")

@app.get("/")
async def read_index():
    return FileResponse("index.html")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Questions dataset (10 targeted Yes/No questions)
TRIAGE_QUESTIONS = [
    {"id": "q1", "text": "Is the pain or discomfort spreading to your jaw, neck, arm, or back?"},
    {"id": "q2", "text": "Are you experiencing severe difficulty breathing or gasping for air?"},
    {"id": "q3", "text": "Is your fever higher than 102°F (38.9°C) or lasting longer than 3 days?"},
    {"id": "q4", "text": "Do you feel sudden dizziness, confusion, or loss of balance?"},
    {"id": "q5", "text": "Are you experiencing severe abdominal pain that prevents you from standing straight?"},
    {"id": "q6", "text": "Have you noticed any persistent nausea, vomiting, or inability to keep fluids down?"},
    {"id": "q7", "text": "Are you experiencing profuse cold sweats or chills?"},
    {"id": "q8", "text": "Do you have a persistent dry cough or coughing up blood?"},
    {"id": "q9", "text": "Are you experiencing intense headache accompanied by sensitivity to light or stiff neck?"},
    {"id": "q10", "text": "Have you had a history of heart disease, hypertension, or high cholesterol?"}
]

class InitialCheck(BaseModel):
    symptoms: List[str]

class QuestionResponse(BaseModel):
    symptoms: List[str]
    answers: Dict[str, str] # e.g. {"q1": "yes", "q2": "no"}

@app.post("/api/questions")
def get_questions(data: InitialCheck):
    # Returns the 10 diagnostic questions
    return {"questions": TRIAGE_QUESTIONS}

@app.post("/api/predict")
def predict_disease(data: QuestionResponse):
    yes_count = sum(1 for v in data.answers.values() if v.lower() == "yes")
    symptoms = [s.lower() for s in data.symptoms]

    # Simple logic mapping for hackathon demo
    if any(s in symptoms for s in ["chest pain", "shortness of breath"]) and (data.answers.get("q1") == "yes" or data.answers.get("q2") == "yes"):
        disease = "Cardiovascular Risk (Angina / Potential Heart Event)"
        specialist = "Cardiologist"
        emergency = True
        advice = "Sit down, rest immediately, call 108 emergency services."
    elif any(s in symptoms for s in ["fever", "cough", "headache"]) and (data.answers.get("q3") == "yes" or data.answers.get("q8") == "yes"):
        disease = "Acute Respiratory Infection / Influenza"
        specialist = "General Physician / Pulmonologist"
        emergency = False
        advice = "Stay hydrated, take adequate rest, isolate if fever persists."
    elif any(s in symptoms for s in ["stomach pain", "nausea"]) and (data.answers.get("q5") == "yes" or data.answers.get("q6") == "yes"):
        disease = "Acute Gastroenteritis / Digestive Infection"
        specialist = "Gastroenterologist"
        emergency = False
        advice = "Consume ORS fluids, eat light foods, consult a gastroenterologist."
    else:
        disease = "General Viral / Stress Syndrome"
        specialist = "General Physician"
        emergency = False
        advice = "Monitor symptoms, rest well, and seek medical consultation if symptoms worsen."

    confidence = min(95, 40 + (yes_count * 5.5) + (len(symptoms) * 5))

    return {
        "predicted_disease": disease,
        "confidence_score": f"{round(confidence)}%",
        "recommended_specialist": specialist,
        "emergency_alert": emergency,
        "advice": advice
    }
