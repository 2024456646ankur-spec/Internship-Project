"""
Groq LLM service — real-time coaching, question generation, and reports.
"""
import json
import textwrap
from typing import Any

from groq import AsyncGroq
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

from app.core.config import settings
from app.schemas.schemas import QuestionGenerateIn

_client = AsyncGroq(api_key=settings.GROQ_API_KEY)

NUDGE_SYSTEM_PROMPT = """
You are a supportive interview coach giving real-time micro-feedback to a candidate 
during a mock interview. Keep responses under 15 words. Be warm, encouraging, and specific.
Examples: "Take a breath and organize your thoughts.", "Great energy! Keep going.",
"Try to look at the camera more.", "Speak a bit slower — you're doing well."
"""

@retry(
    retry=retry_if_exception_type(Exception),
    wait=wait_exponential(multiplier=0.5, min=0.5, max=5),
    stop=stop_after_attempt(2),
)
async def get_coaching_nudge_groq(
    avg_engagement: float,
    silence_secs: float,
) -> str:
    """
    Returns a short (<15 word) coaching nudge string.
    Called from WebSocket handler — latency is critical.
    """
    context_parts = []
    if silence_secs > 12:
        context_parts.append(f"The candidate has been silent for {silence_secs:.0f} seconds.")
    if avg_engagement < 0.35:
        context_parts.append(f"Engagement is low (score: {avg_engagement:.2f}/1.0).")

    user_msg = " ".join(context_parts) or "Candidate seems distracted or nervous."

    response = await _client.chat.completions.create(
        model=settings.GROQ_MODEL,
        messages=[
            {"role": "system", "content": NUDGE_SYSTEM_PROMPT},
            {"role": "user", "content": user_msg},
        ],
        max_tokens=40,
        temperature=0.6,
    )

    nudge = response.choices[0].message.content.strip()
    return nudge

# ── Question Generation ───────────────────────────────────────────────────────

QUESTION_SYSTEM_PROMPT = """
You are an expert technical interviewer. Generate a structured list of interview 
questions in valid JSON format. 
Format your response as a JSON object with a single key "questions" containing an array.
Each question in the array must follow this exact schema:
{
  "question_text": "string",
  "question_type": "behavioral|technical|dsa|viva",
  "difficulty": "easy|medium|hard",
  "ideal_answer": "string (detailed model answer)",
  "starter_code": "string or null (for DSA/coding questions only)"
}
Return ONLY a valid JSON object. No markdown, no explanation.
"""

@retry(
    retry=retry_if_exception_type(Exception),
    wait=wait_exponential(multiplier=1, min=2, max=30),
    stop=stop_after_attempt(3),
)
async def generate_questions_groq(body: QuestionGenerateIn) -> list[dict]:
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

    response = await _client.chat.completions.create(
        model=settings.GROQ_MODEL,
        messages=[
            {"role": "system", "content": prompt}
        ],
        response_format={"type": "json_object"},
        temperature=0.7,
    )

    raw = response.choices[0].message.content.strip()
    parsed = json.loads(raw)
    return parsed.get("questions", [])

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
Return ONLY a valid JSON object. No markdown fences around the JSON.
"""

@retry(
    retry=retry_if_exception_type(Exception),
    wait=wait_exponential(multiplier=1, min=2, max=60),
    stop=stop_after_attempt(3),
)
async def generate_report_groq(
    session_id: str,
    transcript_doc: dict | None,
    engagement_frames: list[dict],
) -> dict:
    transcript_str = json.dumps(transcript_doc, default=str, indent=2) if transcript_doc else "No transcript available."
    engagement_summary_str = _summarize_engagement(engagement_frames)

    prompt = textwrap.dedent(f"""
        {REPORT_SYSTEM_PROMPT}
        
        Session ID: {session_id}
        
        === TRANSCRIPT ===
        {transcript_str[:15000]}
        
        === ENGAGEMENT METRICS SUMMARY ===
        {engagement_summary_str}
        
        Generate the complete report now.
    """)

    response = await _client.chat.completions.create(
        model=settings.GROQ_MODEL,
        messages=[
            {"role": "system", "content": prompt}
        ],
        response_format={"type": "json_object"},
        temperature=0.4,
    )

    raw = response.choices[0].message.content.strip()
    return json.loads(raw)

def _summarize_engagement(frames: list[dict]) -> str:
    if not frames:
        return "No engagement data available."

    from collections import defaultdict
    buckets: dict[int, list] = defaultdict(list)

    for f in frames:
        ts = f.get("client_ts")
        if ts:
            minute = int(ts / 60000)
            buckets[minute].append(f.get("engagement_score", 0.5))

    lines = []
    for minute in sorted(buckets):
        scores = buckets[minute]
        avg = sum(scores) / len(scores)
        lines.append(f"Minute {minute}: avg_engagement={avg:.2f} (n={len(scores)})")

    return "\n".join(lines)
