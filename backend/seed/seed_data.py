from app.database.database import SessionLocal, Base, engine

from app.models.patient import Patient
from app.models.memory import Memory
from app.models.reminder import Reminder
from app.models.game_result import GameResult
from app.models.activity import Activity


Base.metadata.create_all(bind=engine)

db = SessionLocal()


patient = db.query(Patient).filter(
    Patient.name == "Demo Patient"
).first()


if not patient:
    patient = Patient(
        name="Demo Patient",
        age=65,
        gender="Female"
    )

    db.add(patient)
    db.commit()
    db.refresh(patient)


if not db.query(Memory).filter(
    Memory.patient_id == patient.id
).first():

    db.add(Memory(
        patient_id=patient.id,
        title="Family",
        content="Patient enjoys spending time with family."
    ))

    db.add(Memory(
        patient_id=patient.id,
        title="Favorite Food",
        content="Patient likes simple home cooked meals."
    ))


if not db.query(Reminder).filter(
    Reminder.patient_id == patient.id
).first():

    db.add(Reminder(
        patient_id=patient.id,
        title="Morning Medicine",
        time="09:00 AM"
    ))

    db.add(Reminder(
        patient_id=patient.id,
        title="Evening Medicine",
        time="08:00 PM"
    ))


if not db.query(GameResult).filter(
    GameResult.patient_id == patient.id
).first():

    db.add(GameResult(
        patient_id=patient.id,
        game_name="Memory Match",
        score=80
    ))


if not db.query(Activity).filter(
    Activity.patient_id == patient.id
).first():

    db.add(Activity(
        patient_id=patient.id,
        activity_type="Memory Game",
        description="Completed a memory matching activity."
    ))


db.commit()

print("Demo data inserted successfully!")
print("Patient ID:", patient.id)

db.close()