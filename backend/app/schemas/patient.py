from pydantic import BaseModel


class PatientCreate(BaseModel):
    name: str
    age: int | None = None
    gender: str | None = None


class PatientResponse(BaseModel):
    id: int
    name: str
    age: int | None = None
    gender: str | None = None

    class Config:
        from_attributes = True