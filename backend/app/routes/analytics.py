from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.game_result import GameResult
from app.models.activity import Activity
from app.services.analytics_service import calculate_analytics


router = APIRouter(
    prefix="/api/analytics",
    tags=["Analytics"]
)


@router.get("/{patient_id}")
def get_analytics(
    patient_id: int,
    db: Session = Depends(get_db)
):
    game_results = db.query(GameResult).filter(
        GameResult.patient_id == patient_id
    ).all()

    activities = db.query(Activity).filter(
        Activity.patient_id == patient_id
    ).all()

    return calculate_analytics(
        game_results,
        activities
    )