from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.activity import Activity
from app.schemas.activity import ActivityCreate, ActivityResponse


router = APIRouter(
    prefix="/api/activities",
    tags=["Activities"]
)


@router.post("/", response_model=ActivityResponse)
def create_activity(
    activity: ActivityCreate,
    db: Session = Depends(get_db)
):
    new_activity = Activity(
        patient_id=activity.patient_id,
        activity_type=activity.activity_type,
        description=activity.description
    )

    db.add(new_activity)
    db.commit()
    db.refresh(new_activity)

    return new_activity


@router.get("/{patient_id}")
def get_activities(
    patient_id: int,
    db: Session = Depends(get_db)
):
    return db.query(Activity).filter(
        Activity.patient_id == patient_id
    ).all()