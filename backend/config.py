from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/yared_tibeb"
    SQLITE_FALLBACK_URL: str = "sqlite:///./yared_tibeb.db"
    JWT_SECRET_KEY: str = "yared_tibeb_secret_key_2026_ethiopian_heritage_fashion_super_secure"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "*"
    ]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
