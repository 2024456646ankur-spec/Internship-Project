"""
Pydantic request/response schemas — shared across routers
"""
from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Any, Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field, field_validator


# ── Enums ─────────────────────────────────────────────────────────────────────

class QuestionCategory(str, Enum):
    behavioral = "behavioral"
    technical  = "technical"
    dsa        = "dsa"
    viva       = "viva"

class Difficulty(str, Enum):
    easy   = "easy"
    medium = "medium"
    hard   = "hard"

class SessionType(str, Enum):
    behavioral = "behavioral"
    technical  = "technical"
    dsa        = "dsa"
    viva       = "viva"
    mixed      = "mixed"

class SessionStatus(str, Enum):
    in_progress = "in_progress"
    completed   = "completed"
    abandoned   = "abandoned"


# ── Auth Schemas ──────────────────────────────────────────────────────────────

class RegisterIn(BaseModel):
    email:        EmailStr
    display_name: str   = Field(min_length=2, max_length=120)
    password:     str   = Field(min_length=8)

class LoginIn(BaseModel):
    email:    EmailStr
    password: str

class TokenOut(BaseModel):
    access_token:  str
    refresh_token: str
    token_type:    str = "bearer"

class UserOut(BaseModel):
    id:           str
    email:        str
    display_name: str
    is_active:    bool
    created_at:   datetime

    model_config = {"from_attributes": True}


# ── Question Schemas ──────────────────────────────────────────────────────────

class QuestionGenerateIn(BaseModel):
    role_subject_id:  Optional[int]   = None
    subject_freetext: Optional[str]   = None  # fallback if no role_subject
    session_type:     SessionType     = SessionType.mixed
    difficulty:       Difficulty      = Difficulty.medium
    count:            int             = Field(default=5, ge=1, le=20)
    resume_text:      Optional[str]   = None  # mammoth-parsed resume text

class QuestionOut(BaseModel):
    id:             str
    question_text:  str
    question_type:  QuestionCategory
    difficulty:     Difficulty
    ideal_answer:   Optional[str]     = None
    starter_code:   Optional[str]     = None

    model_config = {"from_attributes": True}


# ── Session Schemas ───────────────────────────────────────────────────────────

class SessionCreateIn(BaseModel):
    role_subject_id: Optional[int] = None
    session_type:    SessionType   = SessionType.mixed
    question_ids:    list[str]     = Field(min_length=1)

class SessionOut(BaseModel):
    id:              str
    user_id:         str
    status:          SessionStatus
    session_type:    SessionType
    started_at:      datetime
    finished_at:     Optional[datetime] = None
    duration_secs:   Optional[int]      = None

    model_config = {"from_attributes": True}

class SessionFinishIn(BaseModel):
    """Sent by client when user clicks 'End Session'."""
    duration_secs: int

class TranscriptTurnIn(BaseModel):
    """Posted after each question is answered."""
    turn_index:         int
    question_id:        str
    question_text:      str
    question_type:      QuestionCategory
    user_answer_text:   str
    code_submission:    Optional[str]   = None
    code_output:        Optional[str]   = None
    answer_duration_secs: float
    nudges_given:       list[str]       = []


# ── Engagement Metric Schemas ─────────────────────────────────────────────────

class EngagementFrameIn(BaseModel):
    """Sent via WebSocket from client every ~200ms."""
    frame_batch_id:      str
    client_ts:           float   # Unix ms
    question_index:      int
    gaze_x:              Optional[float] = None
    gaze_y:              Optional[float] = None
    blink_detected:      bool            = False
    smile_prob:          float           = 0.0
    head_yaw:            Optional[float] = None
    head_pitch:          Optional[float] = None
    head_roll:           Optional[float] = None
    dominant_expression: str             = "neutral"
    face_detected:       bool            = True
    engagement_score:    float           = 0.0


# ── Execute Schemas ───────────────────────────────────────────────────────────

class ExecuteIn(BaseModel):
    language: str
    code:     str
    stdin:    str = ""

class ExecuteOut(BaseModel):
    stdout:      str
    stderr:      str
    exit_code:   int
    exec_time_ms: float


# ── Report Schemas ────────────────────────────────────────────────────────────

class ReportStatus(str, Enum):
    pending    = "pending"
    generating = "generating"
    done       = "done"
    failed     = "failed"

class ReportOut(BaseModel):
    session_id:                  str
    status:                      ReportStatus
    generated_at:                Optional[datetime] = None
    engagement_summary:          Optional[dict]     = None
    question_analyses:           Optional[list]     = None
    report_markdown:             Optional[str]      = None
    improvement_plan_markdown:   Optional[str]      = None


# ── WebSocket Message Schemas ─────────────────────────────────────────────────

class WsMessageType(str, Enum):
    metric      = "metric"       # client -> server: engagement frame batch
    nudge       = "nudge"        # server -> client: coaching text
    avatar_state= "avatar_state" # server -> client: avatar animation state
    transcript  = "transcript"   # client -> server: question turn transcript
    ping        = "ping"
    pong        = "pong"

class WsClientMessage(BaseModel):
    type:    WsMessageType
    payload: Any

class WsNudgeMessage(BaseModel):
    type:    str = "nudge"
    message: str

class WsAvatarStateMessage(BaseModel):
    type:  str = "avatar_state"
    state: str  # idle | listening | nodding | concerned | thinking
