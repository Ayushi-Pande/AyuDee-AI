from pydantic import BaseModel


class ActivityCreate(BaseModel):
    patient_id: int
    activity_type: str
    description: str


class ActivityResponse(BaseModel):
    id: int
    patient_id: int
    activity_type: str
    description: str

    class Config:
        from_attributes = True