"""
Sessions router — CRUD for interview sessions + transcript turns.
"""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session as DBSession

from app.api.deps import get_current_user
from app.core.database import get_db
from app.core.mongo import get_mongo_db
from app.models.pg_models import Session as SessionModel, SessionScore, User
from app.schemas.schemas import (
    SessionCreateIn, SessionFinishIn, SessionOut, TranscriptTurnIn
)

router = APIRouter()


@router.post("/", response_model=SessionOut, status_code=201)
def create_session(
    body: SessionCreateIn,
    db: DBSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = SessionModel(
        user_id=current_user.id,
        role_subject_id=body.role_subject_id,
        session_type=body.session_type,
    )
    db.add(session)
    db.flush()

    # Initialize scores row
    score = SessionScore(session_id=session.id)
    db.add(score)

    db.commit()
    db.refresh(session)
    return session


@router.get("/", response_model=list[SessionOut])
def list_sessions(
    limit: int = 20,
    db: DBSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(SessionModel)
        .filter(SessionModel.user_id == current_user.id)
        .order_by(SessionModel.started_at.desc())
        .limit(limit)
        .all()
    )


@router.get("/{session_id}", response_model=SessionOut)
def get_session(
    session_id: str,
    db: DBSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    s = db.query(SessionModel).filter(
        SessionModel.id == session_id,
        SessionModel.user_id == current_user.id,
    ).first()
    if not s:
        raise HTTPException(status_code=404, detail="Session not found")
    return s


@router.post("/{session_id}/finish", response_model=SessionOut)
def finish_session(
    session_id: str,
    body: SessionFinishIn,
    db: DBSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    s = db.query(SessionModel).filter(
        SessionModel.id == session_id,
        SessionModel.user_id == current_user.id,
    ).first()
    if not s:
        raise HTTPException(status_code=404, detail="Session not found")

    s.status = "completed"
    s.finished_at = datetime.now(timezone.utc)
    s.duration_secs = body.duration_secs
    db.commit()
    db.refresh(s)
    return s


@router.post("/{session_id}/turns", status_code=201)
def append_transcript_turn(
    session_id: str,
    body: TranscriptTurnIn,
    mongo_db=Depends(get_mongo_db),
    current_user: User = Depends(get_current_user),
):
    """Append a completed Q&A turn to MongoDB session_transcripts collection."""
    col = mongo_db["session_transcripts"]
    turn_doc = body.model_dump()
    turn_doc["started_at"] = datetime.now(timezone.utc)

    col.update_one(
        {"session_id": session_id},
        {
            "$setOnInsert": {
                "session_id": session_id,
                "user_id": current_user.id,
                "created_at": datetime.now(timezone.utc),
            },
            "$set": {"updated_at": datetime.now(timezone.utc)},
            "$push": {"turns": turn_doc},
        },
        upsert=True,
    )
    return {"status": "appended"}
