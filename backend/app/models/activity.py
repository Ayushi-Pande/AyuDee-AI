from sqlalchemy import Column, Integer, String, ForeignKey
from app.database.database import Base


class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    activity_type = Column(String, nullable=False)
    description = Column(String, nullable=False)