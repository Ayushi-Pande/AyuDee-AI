from pydantic import BaseModel


class ChatRequest(BaseModel):
    patient_id: int
    message: str


class ChatResponse(BaseModel):
    response: str