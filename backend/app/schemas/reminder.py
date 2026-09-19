from pydantic import BaseModel


class ReminderCreate(BaseModel):
    patient_id: int
    title: str
    time: str


class ReminderUpdate(BaseModel):
    title: str
    time: str


class ReminderStatusUpdate(BaseModel):
    status: str


class ReminderResponse(BaseModel):
    id: int
    patient_id: int
    title: str
    time: str
    status: str

    class Config:
        from_attributes = True