"""
PostgreSQL ORM Models — Rehearsal Room

Why PostgreSQL for these entities:
  - users / auth: relational integrity, ACID compliance for sign-up / login flows
  - question_bank: FK to roles_subjects, cached deduplicated per (subject, role) hash
  - sessions: FK to user, stores metadata + status; joined to scores
  - session_scores: one-to-one with sessions, aggregate engagement metrics
"""
import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Boolean, Column, DateTime, Enum, Float, ForeignKey,
    Integer, String, Text, UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


def _now():
    return datetime.now(timezone.utc)


def _uuid():
    return str(uuid.uuid4())


# ── Users ─────────────────────────────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"

    id            = Column(UUID(as_uuid=False), primary_key=True, default=_uuid)
    email         = Column(String(255), unique=True, nullable=False, index=True)
    display_name  = Column(String(120), nullable=False)
    hashed_pw     = Column(String(255), nullable=False)
    is_active     = Column(Boolean, default=True, nullable=False)
    created_at    = Column(DateTime(timezone=True), default=_now, nullable=False)
    updated_at    = Column(DateTime(timezone=True), default=_now, onupdate=_now)

    sessions      = relationship("Session", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User id={self.id} email={self.email}>"


# ── Roles / Subjects ──────────────────────────────────────────────────────────

class RoleSubject(Base):
    """
    Catalogue of available interview tracks (e.g., "Data Structures & Algorithms",
    "Machine Learning Engineer", "Frontend Developer").
    """
    __tablename__ = "roles_subjects"

    id          = Column(Integer, primary_key=True, autoincrement=True)
    name        = Column(String(120), unique=True, nullable=False)
    category    = Column(
        Enum("behavioral", "technical", "viva", name="question_category"),
        nullable=False,
    )
    description = Column(Text, nullable=True)

    questions   = relationship("QuestionBank", back_populates="role_subject")


# ── Question Bank ─────────────────────────────────────────────────────────────

class QuestionBank(Base):
    """
    Generated (or seeded) questions cached per (role_subject_id, content_hash).
    Avoids re-generating identical questions on repeated requests.
    """
    __tablename__ = "question_bank"
    __table_args__ = (
        UniqueConstraint("role_subject_id", "content_hash", name="uq_question_hash"),
    )

    id              = Column(UUID(as_uuid=False), primary_key=True, default=_uuid)
    role_subject_id = Column(Integer, ForeignKey("roles_subjects.id"), nullable=False)
    question_type   = Column(
        Enum("behavioral", "technical", "dsa", "viva", name="q_type"),
        nullable=False,
    )
    difficulty      = Column(
        Enum("easy", "medium", "hard", name="difficulty_level"),
        nullable=False,
        default="medium",
    )
    question_text   = Column(Text, nullable=False)
    ideal_answer    = Column(Text, nullable=True)   # AI-generated ideal answer / solution
    starter_code    = Column(Text, nullable=True)   # For DSA/coding questions
    content_hash    = Column(String(64), nullable=False)  # SHA-256 of question_text
    created_at      = Column(DateTime(timezone=True), default=_now)

    role_subject    = relationship("RoleSubject", back_populates="questions")


# ── Sessions ──────────────────────────────────────────────────────────────────

class Session(Base):
    """
    One mock interview session per row. Links user to a set of questions.
    Metadata lives here; transcript + frame data live in MongoDB.
    """
    __tablename__ = "sessions"

    id              = Column(UUID(as_uuid=False), primary_key=True, default=_uuid)
    user_id         = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False, index=True)
    role_subject_id = Column(Integer, ForeignKey("roles_subjects.id"), nullable=True)
    status          = Column(
        Enum("in_progress", "completed", "abandoned", name="session_status"),
        default="in_progress",
        nullable=False,
    )
    session_type    = Column(
        Enum("behavioral", "technical", "dsa", "viva", "mixed", name="session_type_enum"),
        nullable=False,
        default="mixed",
    )
    started_at      = Column(DateTime(timezone=True), default=_now, nullable=False)
    finished_at     = Column(DateTime(timezone=True), nullable=True)
    duration_secs   = Column(Integer, nullable=True)

    user            = relationship("User", back_populates="sessions")
    scores          = relationship("SessionScore", back_populates="session", uselist=False,
                                   cascade="all, delete-orphan")


# ── Session Scores ────────────────────────────────────────────────────────────

class SessionScore(Base):
    """
    Aggregate engagement and performance metrics for a completed session.
    One-to-one with Session. Updated incrementally via WebSocket handler,
    finalized when session completes.
    """
    __tablename__ = "session_scores"

    id                  = Column(UUID(as_uuid=False), primary_key=True, default=_uuid)
    session_id          = Column(
        UUID(as_uuid=False), ForeignKey("sessions.id"), unique=True, nullable=False
    )

    # Engagement metrics (averaged over session)
    eye_contact_pct     = Column(Float, nullable=True)   # 0.0 – 1.0
    avg_blink_rate      = Column(Float, nullable=True)   # blinks / minute
    smile_frequency     = Column(Float, nullable=True)   # smiles / minute
    head_steadiness     = Column(Float, nullable=True)   # 0.0 (unstable) – 1.0 (steady)
    avg_engagement      = Column(Float, nullable=True)   # composite 0–100

    # Performance metrics
    questions_attempted = Column(Integer, default=0)
    questions_correct   = Column(Integer, default=0)
    avg_answer_time_s   = Column(Float, nullable=True)   # average per question
    code_pass_rate      = Column(Float, nullable=True)   # coding questions only

    # Coaching
    nudges_received     = Column(Integer, default=0)

    updated_at          = Column(DateTime(timezone=True), default=_now, onupdate=_now)

    session             = relationship("Session", back_populates="scores")
