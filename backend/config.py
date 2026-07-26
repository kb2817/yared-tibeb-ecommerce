from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://user:password@localhost/yared_tibeb"
    JWT_SECRET_KEY: str = "yared_tibeb_secret_key_2026_super_secure"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days

    class Config:
        env_file = ".env"

settings = Settings()
