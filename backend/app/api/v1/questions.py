"""
Questions router — generate and retrieve questions.
Uses Gemini (via services/llm_gemini.py) for generation.
"""
import hashlib

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session as DBSession

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.pg_models import QuestionBank, User
from app.schemas.schemas import QuestionGenerateIn, QuestionOut
from app.services.llm_groq import generate_questions_groq

router = APIRouter()


@router.post("/generate", response_model=list[QuestionOut])
async def generate_questions(
    body: QuestionGenerateIn,
    db: DBSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Generate interview questions via Gemini.
    Results are cached in PostgreSQL question_bank by content hash.
    """
    questions_data = await generate_questions_groq(body)

    results = []
    for q in questions_data:
        content_hash = hashlib.sha256(q["question_text"].encode()).hexdigest()
        # Check cache
        existing = (
            db.query(QuestionBank)
            .filter(
                QuestionBank.role_subject_id == body.role_subject_id,
                QuestionBank.content_hash == content_hash,
            )
            .first()
        )
        if existing:
            results.append(existing)
            continue

        new_q = QuestionBank(
            role_subject_id=body.role_subject_id,
            question_type=q["question_type"],
            difficulty=q["difficulty"],
            question_text=q["question_text"],
            ideal_answer=q.get("ideal_answer"),
            starter_code=q.get("starter_code"),
            content_hash=content_hash,
        )
        db.add(new_q)
        db.flush()
        results.append(new_q)

    db.commit()
    for r in results:
        db.refresh(r)

    return results


@router.get("/{question_id}", response_model=QuestionOut)
def get_question(
    question_id: str,
    db: DBSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = db.query(QuestionBank).filter(QuestionBank.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    return q


@router.get("/", response_model=list[QuestionOut])
def list_questions(
    role_subject_id: int | None = None,
    question_type: str | None = None,
    difficulty: str | None = None,
    limit: int = 20,
    db: DBSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = db.query(QuestionBank)
    if role_subject_id:
        q = q.filter(QuestionBank.role_subject_id == role_subject_id)
    if question_type:
        q = q.filter(QuestionBank.question_type == question_type)
    if difficulty:
        q = q.filter(QuestionBank.difficulty == difficulty)
    return q.limit(limit).all()
