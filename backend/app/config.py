from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    frontend_origin: str = "http://localhost:5173"
    database_url: str = "sqlite:///./ayudee.db"

    class Config:
        env_file = ".env"


settings = Settings()