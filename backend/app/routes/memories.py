from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.memory import Memory
from app.schemas.memory import (
    MemoryCreate,
    MemoryUpdate,
    MemoryResponse
)


router = APIRouter(
    prefix="/api/memories",
    tags=["Memories"]
)


@router.post("/", response_model=MemoryResponse)
def create_memory(
    memory: MemoryCreate,
    db: Session = Depends(get_db)
):
    new_memory = Memory(
        patient_id=memory.patient_id,
        title=memory.title,
        content=memory.content
    )

    db.add(new_memory)
    db.commit()
    db.refresh(new_memory)

    return new_memory


@router.get("/{patient_id}")
def get_memories(
    patient_id: int,
    db: Session = Depends(get_db)
):
    return db.query(Memory).filter(
        Memory.patient_id == patient_id
    ).all()


@router.put("/{memory_id}", response_model=MemoryResponse)
def update_memory(
    memory_id: int,
    memory: MemoryUpdate,
    db: Session = Depends(get_db)
):
    existing = db.query(Memory).filter(
        Memory.id == memory_id
    ).first()

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Memory not found"
        )

    existing.title = memory.title
    existing.content = memory.content

    db.commit()
    db.refresh(existing)

    return existing


@router.delete("/{memory_id}")
def delete_memory(
    memory_id: int,
    db: Session = Depends(get_db)
):
    existing = db.query(Memory).filter(
        Memory.id == memory_id
    ).first()

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Memory not found"
        )

    db.delete(existing)
    db.commit()

    return {
        "message": "Memory deleted successfully"
    }