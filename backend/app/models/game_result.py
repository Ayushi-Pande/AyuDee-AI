from sqlalchemy import Column, Integer, String, Float, ForeignKey
from app.database.database import Base


class GameResult(Base):
    __tablename__ = "game_results"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    game_name = Column(String, nullable=False)
    score = Column(Float, nullable=False)