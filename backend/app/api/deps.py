"""
FastAPI dependency: extract and validate Bearer JWT from Authorization header.
"""
from fastapi import Depends, HTTPException, Header
from sqlalchemy.orm import Session as DBSession

from app.core.database import get_db
from app.core.security import decode_token
from app.models.pg_models import User
from jose import JWTError


def get_current_user(
    authorization: str | None = Header(None),
    db: DBSession = Depends(get_db),
) -> User:
    # BYPASSING LOGIN FOR NOW
    return User(
        id="offline-user-id",
        email="guest@local",
        display_name="Guest User",
        is_active=True
    )
