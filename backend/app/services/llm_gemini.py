"""
Gemini LLM service — question generation and post-session report generation.
Uses google-generativeai SDK with tenacity retry logic.
"""
import json
import textwrap
from typing import Any

import google.generativeai as genai
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

from app.core.config import settings
from app.schemas.schemas import QuestionGenerateIn

genai.configure(api_key=settings.GEMINI_API_KEY)
_model = genai.GenerativeModel(settings.GEMINI_MODEL)


# ── Question Generation ───────────────────────────────────────────────────────

QUESTION_SYSTEM_PROMPT = """
You are an expert technical interviewer. Generate a structured list of interview 
questions in valid JSON format. Each question must follow this exact schema:
{
  "question_text": "string",
  "question_type": "behavioral|technical|dsa|viva",
  "difficulty": "easy|medium|hard",
  "ideal_answer": "string (detailed model answer)",
  "starter_code": "string or null (for DSA/coding questions only)"
}
Return ONLY a valid JSON array. No markdown, no explanation.
"""


@retry(
    retry=retry_if_exception_type(Exception),
    wait=wait_exponential(multiplier=1, min=2, max=30),
    stop=stop_after_attempt(3),
)
async def generate_questions_gemini(body: QuestionGenerateIn) -> list[dict]:
    """
    Calls Gemini to generate interview questions.
    Returns a list of raw dicts matching QuestionOut schema.
    """
    subject = body.subject_freetext or f"Role Subject ID {body.role_subject_id}"
    resume_context = (
        f"\nCandidate Resume/JD:\n{body.resume_text[:3000]}"
        if body.resume_text
        else ""
    )

    prompt = textwrap.dedent(f"""
        {QUESTION_SYSTEM_PROMPT}
        
        Subject/Role: {subject}
        Session Type: {body.session_type}
        Difficulty: {body.difficulty}
        Number of questions: {body.count}
        {resume_context}
        
        Generate exactly {body.count} questions now.
    """)

    response = await _model.generate_content_async(
        prompt,
        generation_config=genai.GenerationConfig(
            temperature=0.7,
            response_mime_type="application/json",
        ),
    )

    raw = response.text.strip()
    # Strip markdown fences if present
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[1].rsplit("```", 1)[0].strip()

    return json.loads(raw)


# ── Report Generation ─────────────────────────────────────────────────────────

REPORT_SYSTEM_PROMPT = """
You are an expert interview coach. Given a complete mock interview session transcript,
engagement metrics, and the ideal answers for each question, generate a comprehensive
post-session report in Markdown format.

The report must include:
1. ## Executive Summary (3-4 sentences)
2. ## Question-by-Question Analysis (score /10, strengths, gaps, ideal answer)  
3. ## Engagement & Communication Analysis (eye contact, confidence, pacing)
4. ## Improvement Plan (specific, actionable weekly plan)
5. ## Resources & Next Steps

Also return structured JSON for engagement_summary and question_analyses fields.
Format your response as a JSON object with these keys:
{
  "report_markdown": "...",
  "improvement_plan_markdown": "...",
  "engagement_summary": { ... },
  "question_analyses": [ ... ]
}
"""


@retry(
    retry=retry_if_exception_type(Exception),
    wait=wait_exponential(multiplier=1, min=2, max=60),
    stop=stop_after_attempt(3),
)
async def generate_report_gemini(
    session_id: str,
    transcript_doc: dict | None,
    engagement_frames: list[dict],
) -> dict:
    """
    Generate a full post-session report using Gemini's long-context capability.
    """
    transcript_str = json.dumps(transcript_doc, default=str, indent=2) if transcript_doc else "No transcript available."

    # Summarize engagement frames into per-minute buckets for context efficiency
    engagement_summary_str = _summarize_engagement(engagement_frames)

    prompt = textwrap.dedent(f"""
        {REPORT_SYSTEM_PROMPT}
        
        Session ID: {session_id}
        
        === TRANSCRIPT ===
        {transcript_str[:50000]}
        
        === ENGAGEMENT METRICS SUMMARY ===
        {engagement_summary_str}
        
        Generate the complete report now.
    """)

    response = await _model.generate_content_async(
        prompt,
        generation_config=genai.GenerationConfig(
            temperature=0.4,
            response_mime_type="application/json",
        ),
    )

    raw = response.text.strip()
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[1].rsplit("```", 1)[0].strip()

    return json.loads(raw)


def _summarize_engagement(frames: list[dict]) -> str:
    """Bucket frames into per-minute summaries to reduce token usage."""
    if not frames:
        return "No engagement data available."

    from collections import defaultdict
    buckets: dict[int, list] = defaultdict(list)

    for f in frames:
        ts = f.get("ts")
        if ts:
            # Group by minute index (approximate)
            minute = int(f.get("client_ts", 0) / 60000) if f.get("client_ts") else 0
            buckets[minute].append(f.get("engagement_score", 0.5))

    lines = []
    for minute in sorted(buckets):
        scores = buckets[minute]
        avg = sum(scores) / len(scores)
        lines.append(f"Minute {minute}: avg_engagement={avg:.2f} (n={len(scores)})")

    return "\n".join(lines)
