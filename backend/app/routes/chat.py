from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.memory import Memory
from app.models.reminder import Reminder
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.companion_service import generate_response


router = APIRouter(
    prefix="/api/chat",
    tags=["Chat"]
)


@router.post("/", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    memories = db.query(Memory).filter(
        Memory.patient_id == request.patient_id
    ).all()

    reminders = db.query(Reminder).filter(
        Reminder.patient_id == request.patient_id
    ).all()

    response = generate_response(
        request.message,
        memories,
        reminders
    )

    return {
        "response": response
    }