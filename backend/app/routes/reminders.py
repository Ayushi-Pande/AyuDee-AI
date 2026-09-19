from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.reminder import Reminder
from app.schemas.reminder import (
    ReminderCreate,
    ReminderUpdate,
    ReminderStatusUpdate,
    ReminderResponse
)


router = APIRouter(
    prefix="/api/reminders",
    tags=["Reminders"]
)


@router.post("/", response_model=ReminderResponse)
def create_reminder(
    reminder: ReminderCreate,
    db: Session = Depends(get_db)
):
    new_reminder = Reminder(
        patient_id=reminder.patient_id,
        title=reminder.title,
        time=reminder.time
    )

    db.add(new_reminder)
    db.commit()
    db.refresh(new_reminder)

    return new_reminder


@router.get("/{patient_id}")
def get_reminders(
    patient_id: int,
    db: Session = Depends(get_db)
):
    return db.query(Reminder).filter(
        Reminder.patient_id == patient_id
    ).all()


@router.put("/{reminder_id}", response_model=ReminderResponse)
def update_reminder(
    reminder_id: int,
    reminder: ReminderUpdate,
    db: Session = Depends(get_db)
):
    existing = db.query(Reminder).filter(
        Reminder.id == reminder_id
    ).first()

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Reminder not found"
        )

    existing.title = reminder.title
    existing.time = reminder.time

    db.commit()
    db.refresh(existing)

    return existing


@router.delete("/{reminder_id}")
def delete_reminder(
    reminder_id: int,
    db: Session = Depends(get_db)
):
    existing = db.query(Reminder).filter(
        Reminder.id == reminder_id
    ).first()

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Reminder not found"
        )

    db.delete(existing)
    db.commit()

    return {
        "message": "Reminder deleted successfully"
    }


@router.patch(
    "/{reminder_id}/status",
    response_model=ReminderResponse
)
def update_reminder_status(
    reminder_id: int,
    data: ReminderStatusUpdate,
    db: Session = Depends(get_db)
):
    existing = db.query(Reminder).filter(
        Reminder.id == reminder_id
    ).first()

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Reminder not found"
        )

    existing.status = data.status

    db.commit()
    db.refresh(existing)

    return existing