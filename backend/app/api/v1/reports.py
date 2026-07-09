"""
Reports router — trigger report generation and retrieve completed reports.
Uses Gemini (long-context) for the full post-session report.
"""
from datetime import datetime, timezone

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy.orm import Session as DBSession

from app.api.deps import get_current_user
from app.core.database import get_db
from app.core.mongo import get_mongo_db
from app.models.pg_models import Session as SessionModel, User
from app.schemas.schemas import ReportOut, ReportStatus
from app.services.llm_groq import generate_report_groq

router = APIRouter()


async def _generate_report_background(session_id: str, user_id: str):
    """Background task: pull all data, call Gemini, store report in MongoDB."""
    from app.core.mongo import get_mongo_db as _mongo
    mongo_db = _mongo()

    # Mark as generating
    mongo_db["generated_reports"].update_one(
        {"session_id": session_id},
        {"$set": {"status": "generating", "generated_at": datetime.now(timezone.utc)}},
        upsert=True,
    )

    try:
        transcript_doc = mongo_db["session_transcripts"].find_one({"session_id": session_id})
        frames_cursor = mongo_db["engagement_frames"].find(
            {"session_id": session_id},
            {"_id": 0, "ts": 1, "gaze_x": 1, "gaze_y": 1, "smile_prob": 1,
             "engagement_score": 1, "blink_detected": 1, "head_yaw": 1}
        ).sort("ts", 1).limit(5000)  # cap for context window

        frames = list(frames_cursor)
        report = await generate_report_groq(session_id, transcript_doc, frames)

        mongo_db["generated_reports"].update_one(
            {"session_id": session_id},
            {"$set": {**report, "status": "done", "user_id": user_id}},
        )
    except Exception as e:
        mongo_db["generated_reports"].update_one(
            {"session_id": session_id},
            {"$set": {"status": "failed", "error": str(e)}},
        )


@router.post("/{session_id}/generate", status_code=202)
async def trigger_report_generation(
    session_id: str,
    background_tasks: BackgroundTasks,
    db: DBSession = Depends(get_db),
    mongo_db=Depends(get_mongo_db),
    current_user: User = Depends(get_current_user),
):
    s = db.query(SessionModel).filter(
        SessionModel.id == session_id,
        SessionModel.user_id == current_user.id,
    ).first()
    if not s:
        raise HTTPException(status_code=404, detail="Session not found")
    if s.status != "completed":
        raise HTTPException(status_code=400, detail="Session must be completed before generating report")

    existing = mongo_db["generated_reports"].find_one({"session_id": session_id})
    if existing and existing.get("status") == "done":
        return {"status": "already_done", "session_id": session_id}

    background_tasks.add_task(_generate_report_background, session_id, current_user.id)
    return {"status": "queued", "session_id": session_id}


@router.get("/{session_id}", response_model=ReportOut)
def get_report(
    session_id: str,
    mongo_db=Depends(get_mongo_db),
    current_user: User = Depends(get_current_user),
):
    doc = mongo_db["generated_reports"].find_one({"session_id": session_id})
    if not doc:
        return ReportOut(session_id=session_id, status=ReportStatus.pending)

    return ReportOut(
        session_id=session_id,
        status=ReportStatus(doc.get("status", "pending")),
        generated_at=doc.get("generated_at"),
        engagement_summary=doc.get("engagement_summary"),
        question_analyses=doc.get("question_analyses"),
        report_markdown=doc.get("report_markdown"),
        improvement_plan_markdown=doc.get("improvement_plan_markdown"),
    )


@router.get("/", response_model=list[ReportOut])
def list_reports(
    mongo_db=Depends(get_mongo_db),
    current_user: User = Depends(get_current_user),
):
    docs = mongo_db["generated_reports"].find(
        {"user_id": current_user.id, "status": "done"},
        {"_id": 0}
    ).sort("generated_at", -1).limit(50)

    return [
        ReportOut(
            session_id=d["session_id"],
            status=ReportStatus.done,
            generated_at=d.get("generated_at"),
            engagement_summary=d.get("engagement_summary"),
            report_markdown=d.get("report_markdown"),
            improvement_plan_markdown=d.get("improvement_plan_markdown"),
        )
        for d in docs
    ]
