# backend/config.py

from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Mental Health Early Detection API"

    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/mental_health"
    SECRET_KEY: str = "mysecretkey"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    class Config:
        env_file = ".env"

settings = Settings()