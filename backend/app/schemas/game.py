from pydantic import BaseModel


class GameResultCreate(BaseModel):
    patient_id: int
    game_name: str
    score: float


class GameResultResponse(BaseModel):
    id: int
    patient_id: int
    game_name: str
    score: float

    class Config:
        from_attributes = True