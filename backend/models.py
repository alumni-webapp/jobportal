import datetime
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "sqlite:///./jobportal.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class CachedJob(Base):
    __tablename__ = "cached_jobs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    job_id = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    company = Column(String, nullable=True)
    location = Column(String, nullable=True)
    salary = Column(String, nullable=True)
    work_type = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    requirements = Column(Text, nullable=True)
    url = Column(String, nullable=True)
    company_logo = Column(String, nullable=True)
    date_posted = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class ResumeSession(Base):
    __tablename__ = "resume_sessions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    session_id = Column(String, unique=True, index=True, nullable=False)
    filename = Column(String, nullable=True)
    parsed_data = Column(Text, nullable=True)  # JSON string
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


def init_db():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
