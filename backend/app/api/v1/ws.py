"""
WebSocket router — real-time engagement metric ingestion + coaching nudge emission.

Protocol:
  Client -> Server: { "type": "metric", "payload": <EngagementFrameIn> }
  Client -> Server: { "type": "transcript", "payload": <TranscriptTurnIn> }
  Client -> Server: { "type": "ping" }
  Server -> Client: { "type": "nudge", "message": "..." }
  Server -> Client: { "type": "avatar_state", "state": "nodding" }
  Server -> Client: { "type": "pong" }
"""
import asyncio
import json
import time
from datetime import datetime, timezone

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from jose import JWTError

from app.core.config import settings
from app.core.mongo import get_mongo_db
from app.core.security import decode_token
from app.schemas.schemas import EngagementFrameIn
from app.services.llm_groq import get_coaching_nudge_groq

router = APIRouter()

# In-memory state per session for nudge throttling
_last_nudge_ts: dict[str, float] = {}
NUDGE_COOLDOWN_SECS = 15

# Engagement thresholds
LOW_ENGAGEMENT_THRESHOLD = 0.35
LONG_SILENCE_SECS = 12


@router.websocket("/session/{session_id}")
async def session_websocket(
    websocket: WebSocket,
    session_id: str,
    token: str = Query(...),
):
    """
    WebSocket endpoint for a live interview session.
    Authenticated via JWT query parameter.
    """
    # Authenticate
    try:
        payload = decode_token(token)
        user_id: str = payload["sub"]
    except (JWTError, KeyError):
        await websocket.close(code=4001)
        return

    await websocket.accept()
    mongo_db = get_mongo_db()
    engagement_col = mongo_db["engagement_frames"]

    # Running engagement window
    engagement_window: list[float] = []
    last_activity_ts = time.monotonic()

    try:
        while True:
            try:
                raw = await asyncio.wait_for(websocket.receive_text(), timeout=30.0)
            except asyncio.TimeoutError:
                # Send ping to keep connection alive
                await websocket.send_text(json.dumps({"type": "pong"}))
                continue

            try:
                msg = json.loads(raw)
            except json.JSONDecodeError:
                continue

            msg_type = msg.get("type")
            payload_data = msg.get("payload", {})

            # ── Ping ─────────────────────────────────────────────────────────
            if msg_type == "ping":
                await websocket.send_text(json.dumps({"type": "pong"}))

            # ── Engagement Metric Frame ───────────────────────────────────────
            elif msg_type == "metric":
                last_activity_ts = time.monotonic()
                try:
                    frame = EngagementFrameIn(**payload_data)
                except Exception:
                    continue

                # Persist to MongoDB
                frame_doc = frame.model_dump()
                frame_doc["session_id"] = session_id
                frame_doc["user_id"]    = user_id
                frame_doc["ts"]         = datetime.now(timezone.utc)
                engagement_col.insert_one(frame_doc)

                # Update rolling window
                engagement_window.append(frame.engagement_score)
                if len(engagement_window) > 50:
                    engagement_window.pop(0)

                # Decide avatar state
                avg_engagement = (
                    sum(engagement_window) / len(engagement_window)
                    if engagement_window else 0.5
                )
                if avg_engagement > 0.7:
                    avatar_state = "nodding"
                elif avg_engagement > 0.45:
                    avatar_state = "listening"
                elif avg_engagement > 0.25:
                    avatar_state = "concerned"
                else:
                    avatar_state = "idle"

                await websocket.send_text(
                    json.dumps({"type": "avatar_state", "state": avatar_state})
                )

                # Nudge if engagement low and cooldown elapsed
                now = time.monotonic()
                last_nudge = _last_nudge_ts.get(session_id, 0)
                silence_secs = now - last_activity_ts

                if (
                    avg_engagement < LOW_ENGAGEMENT_THRESHOLD
                    or silence_secs > LONG_SILENCE_SECS
                ) and (now - last_nudge > NUDGE_COOLDOWN_SECS):
                    _last_nudge_ts[session_id] = now
                    # Fire-and-forget nudge via Groq (fast LLM)
                    asyncio.create_task(
                        _send_nudge(websocket, session_id, avg_engagement, silence_secs)
                    )

            # ── Transcript Turn ───────────────────────────────────────────────
            elif msg_type == "transcript":
                # Client sends turn data; store in MongoDB
                turn_doc = payload_data
                turn_doc["received_at"] = datetime.now(timezone.utc).isoformat()
                mongo_db["session_transcripts"].update_one(
                    {"session_id": session_id},
                    {
                        "$setOnInsert": {
                            "session_id": session_id,
                            "user_id": user_id,
                            "created_at": datetime.now(timezone.utc),
                        },
                        "$set": {"updated_at": datetime.now(timezone.utc)},
                        "$push": {"turns": turn_doc},
                    },
                    upsert=True,
                )

    except WebSocketDisconnect:
        _last_nudge_ts.pop(session_id, None)


async def _send_nudge(
    websocket: WebSocket,
    session_id: str,
    avg_engagement: float,
    silence_secs: float,
):
    """Calls Groq for a low-latency coaching nudge and sends it over WebSocket."""
    try:
        nudge_text = await get_coaching_nudge_groq(
            avg_engagement=avg_engagement,
            silence_secs=silence_secs,
        )
        await websocket.send_text(
            json.dumps({"type": "nudge", "message": nudge_text})
        )
    except Exception:
        pass  # Nudge is best-effort — do not crash the WS connection
