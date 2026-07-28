import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from backend.config import settings

logger = logging.getLogger(__name__)

DATABASE_URL = settings.DATABASE_URL
CONNECT_ARGS = {}

if DATABASE_URL.startswith("sqlite"):
    CONNECT_ARGS = {"check_same_thread": False}

try:
    if DATABASE_URL.startswith("postgresql"):
        engine = create_engine(DATABASE_URL, pool_pre_ping=True, future=True)
        with engine.connect() as conn:
            pass
    else:
        engine = create_engine(DATABASE_URL, connect_args=CONNECT_ARGS, future=True)
except Exception as exc:
    logger.warning(
        f"Could not connect to primary database ({DATABASE_URL}): {exc}. Falling back to SQLite."
    )
    DATABASE_URL = settings.SQLITE_FALLBACK_URL
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False}, future=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)

class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
