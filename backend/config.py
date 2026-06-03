import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-phishguard-key-change-in-prod")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 day

    # Fallback to local SQLite inside backend directory if database URI not supplied
    DEFAULT_SQLITE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "phishguard.db")
    DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DEFAULT_SQLITE_PATH}")

    # SQLAlchemy config
    if DATABASE_URL.startswith("sqlite"):
        SQLALCHEMY_CONNECT_ARGS = {"check_same_thread": False}
    else:
        SQLALCHEMY_CONNECT_ARGS = {}
