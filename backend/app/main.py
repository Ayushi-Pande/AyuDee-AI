from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database.database import Base, engine

from app.models.patient import Patient
from app.models.memory import Memory
from app.models.reminder import Reminder
from app.models.game_result import GameResult
from app.models.activity import Activity

from app.routes.patients import router as patients_router
from app.routes.memories import router as memories_router
from app.routes.reminders import router as reminders_router
from app.routes.games import router as games_router
from app.routes.activities import router as activities_router
from app.routes.dashboard import router as dashboard_router
from app.routes.analytics import router as analytics_router
from app.routes.chat import router as chat_router


app = FastAPI(
    title="AyuDee AI",
    version="1.0.0"
)


Base.metadata.create_all(bind=engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(patients_router)
app.include_router(memories_router)
app.include_router(reminders_router)
app.include_router(games_router)
app.include_router(activities_router)
app.include_router(dashboard_router)
app.include_router(analytics_router)
app.include_router(chat_router)


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "message": "AyuDee AI backend is running"
    }