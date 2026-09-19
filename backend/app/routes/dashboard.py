from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.patient import Patient
from app.models.memory import Memory
from app.models.reminder import Reminder
from app.models.game_result import GameResult
from app.models.activity import Activity


router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"]
)


@router.get("/patient/{patient_id}")
def get_patient_dashboard(
    patient_id: int,
    db: Session = Depends(get_db)
):
    patient = db.query(Patient).filter(
        Patient.id == patient_id
    ).first()

    if not patient:
        return {
            "error": "Patient not found"
        }

    memories = db.query(Memory).filter(
        Memory.patient_id == patient_id
    ).all()

    reminders = db.query(Reminder).filter(
        Reminder.patient_id == patient_id
    ).all()

    game_results = db.query(GameResult).filter(
        GameResult.patient_id == patient_id
    ).all()

    activities = db.query(Activity).filter(
        Activity.patient_id == patient_id
    ).all()

    return {
        "patient": {
            "id": patient.id,
            "name": patient.name,
            "age": patient.age,
            "gender": patient.gender
        },
        "memories": memories,
        "reminders": reminders,
        "game_results": game_results,
        "activities": activities
    }