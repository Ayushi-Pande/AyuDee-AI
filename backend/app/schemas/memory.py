from pydantic import BaseModel


class MemoryCreate(BaseModel):
    patient_id: int
    title: str
    content: str


class MemoryUpdate(BaseModel):
    title: str
    content: str


class MemoryResponse(BaseModel):
    id: int
    patient_id: int
    title: str
    content: str

    class Config:
        from_attributes = True