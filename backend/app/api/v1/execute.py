"""
Code execution router — runs submitted code in a sandboxed subprocess.
"""
import subprocess
import time

from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import get_current_user
from app.core.config import settings
from app.models.pg_models import User
from app.schemas.schemas import ExecuteIn, ExecuteOut

router = APIRouter()

# Language runner commands
LANGUAGE_RUNNERS: dict[str, list[str]] = {
    "python":     ["python3", "-c", "{code}"],
    "javascript": ["node", "-e", "{code}"],
    "java":       [],      # requires temp file — handled specially
    "cpp":        [],      # requires compile step
    "c":          [],
    "go":         ["go", "run", "{file}"],
    "rust":       [],
}


@router.post("/", response_model=ExecuteOut)
async def execute_code(
    body: ExecuteIn,
    current_user: User = Depends(get_current_user),
):
    """
    Execute submitted code in an isolated sandboxed subprocess.
    Security: sandboxing handled by the runtime environment (Docker/nsjail/etc.).
    Only stdout, stderr, and exit_code are returned — no filesystem access exposed.
    """
    lang = body.language.lower()
    if lang not in settings.allowed_languages_list:
        raise HTTPException(
            status_code=400,
            detail=f"Language '{lang}' not supported. Allowed: {settings.allowed_languages_list}",
        )

    start = time.monotonic()

    try:
        if lang == "python":
            proc = subprocess.run(
                ["python3", "-c", body.code],
                input=body.stdin,
                capture_output=True,
                text=True,
                timeout=settings.CODE_EXEC_TIMEOUT_SECONDS,
            )
        elif lang == "javascript":
            proc = subprocess.run(
                ["node", "--eval", body.code],
                input=body.stdin,
                capture_output=True,
                text=True,
                timeout=settings.CODE_EXEC_TIMEOUT_SECONDS,
            )
        else:
            # For compiled languages, a more complex pipeline is required.
            # Placeholder — return a helpful message.
            return ExecuteOut(
                stdout="",
                stderr=f"Execution for '{lang}' requires compile step. Coming soon.",
                exit_code=1,
                exec_time_ms=0,
            )

    except subprocess.TimeoutExpired:
        return ExecuteOut(
            stdout="",
            stderr=f"Execution timed out after {settings.CODE_EXEC_TIMEOUT_SECONDS}s",
            exit_code=124,
            exec_time_ms=settings.CODE_EXEC_TIMEOUT_SECONDS * 1000,
        )

    exec_time_ms = (time.monotonic() - start) * 1000

    return ExecuteOut(
        stdout=proc.stdout[:50_000],   # cap output size
        stderr=proc.stderr[:10_000],
        exit_code=proc.returncode,
        exec_time_ms=round(exec_time_ms, 2),
    )
