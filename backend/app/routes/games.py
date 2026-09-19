from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.game_result import GameResult
from app.schemas.game import GameResultCreate, GameResultResponse


router = APIRouter(
    prefix="/api/game-results",
    tags=["Game Results"]
)


@router.post("/", response_model=GameResultResponse)
def create_game_result(
    result: GameResultCreate,
    db: Session = Depends(get_db)
):
    new_result = GameResult(
        patient_id=result.patient_id,
        game_name=result.game_name,
        score=result.score
    )

    db.add(new_result)
    db.commit()
    db.refresh(new_result)

    return new_result


@router.get("/{patient_id}")
def get_game_results(
    patient_id: int,
    db: Session = Depends(get_db)
):
    return db.query(GameResult).filter(
        GameResult.patient_id == patient_id
    ).all()