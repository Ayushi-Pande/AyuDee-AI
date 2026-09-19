from sqlalchemy import Column, Integer, String, ForeignKey
from app.database.database import Base


class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    title = Column(String, nullable=False)
    time = Column(String, nullable=False)
    status = Column(String, default="pending")