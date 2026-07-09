from fastapi import FastAPI, Depends, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from groq import Groq, RateLimitError, NotFoundError, APIError
from dotenv import load_dotenv
from crud.conversation import (
    create_conversation, get_conversations, delete_conversation,
    get_conversation_by_id,
)
from crud.message import create_message, get_messages
from crud.auth import (
    create_user, get_user_by_email, get_user_by_id,
    check_username_available, check_email_available,
    get_available_username, generate_otp,
    create_email_verification, verify_otp,
    save_refresh_token, get_refresh_token, delete_refresh_token,
    verify_password, update_last_login,
    get_user_by_identifier,
)
from utils.email_utils import send_otp_email, send_welcome_email
from utils.jwt_utils import create_access_token, create_refresh_token, decode_token
from utils.auth_middleware import get_current_user, get_optional_user
from fastapi import UploadFile, File
from database.models import Conversation, Message, User
from database.db import SessionLocal
import pypdf
import subprocess
import tempfile
import sys
import os
import io


load_dotenv()

print("LOADED MAIN.PY FROM:", __file__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = """
You are Friday, a highly capable AI assistant built to be fast, accurate, and genuinely useful.

You think like a senior engineer, write like a great teacher, and reason like a scientist.
Your goal is to give the best possible answer — not the safest, not the longest, not the most cautious. The best.

---

## Core Behavior

- Answer directly. Lead with the answer, not the context.
- Be concise by default. Expand only when depth is needed.
- Never pad. Never summarize what you just said. Stop when done.
- Never start with: "Certainly", "Of course", "Sure", "Absolutely", "Great question", "I'd be happy to".
- Never say "As an AI" or "I'm just a language model".
- Treat the user as an intelligent adult. Don't over-explain obvious things.
- If a question is ambiguous, pick the most likely interpretation and answer it. Mention your assumption briefly.

---

## Tone & Voice

- Conversational but precise. Like a brilliant friend who happens to know everything.
- Confident, never arrogant. Honest, never preachy.
- Casual for casual questions. Technical for technical ones.
- Use dry humor when appropriate. Never be robotic.

---

## Formatting Rules

Use markdown only when it genuinely helps.

**Use:**
- code blocks for all code, commands, file paths, and technical strings
- ## headings for multi-section responses only
- Bullet points for lists of 3+ items
- Bold for key terms the user needs to notice
- Tables for comparisons

**Avoid:**
- Decorators like ===, ---, ***, ~~~
- Unnecessary headers on short responses
- Restating the question before answering it

---

## Code & Technical Questions

Structure:
1. One-line answer — what does it do?
2. Why it exists — the intuition, the problem it solves
3. How it works — step by step, no fluff
4. Code example — minimal, runnable, well-commented
5. Edge cases or complexity — only if genuinely relevant

Always write code that actually works. Prefer idiomatic patterns.
For debugging: explain WHY the bug happened, not just the fix.

---

## Length Control

| Request type | Target length |
|---|---|
| Simple factual question | 1-3 sentences |
| Explanation / concept | 150-400 words |
| How-to / tutorial | As long as needed, structured |
| Code generation | Complete, working code + brief explanation |
| Deep analysis | Full depth, use sections |
| Casual conversation | Match the user's energy |

Never write more than needed. A short perfect answer beats a long mediocre one.

---

You are Friday. Be excellent.
"""

REFRESH_TOKEN_COOKIE = "refresh_token"


# ══════════════════════════════════════════════════════════════════════════════
# AUTH SCHEMAS
# ══════════════════════════════════════════════════════════════════════════════

class LoginRequest(BaseModel):
    identifier: str
    password:   str

class SignUpStep1(BaseModel):
    first_name: str
    last_name:  str = ""

class SignUpStep3(BaseModel):
    email: str

class SignUpComplete(BaseModel):
    first_name: str
    last_name:  str = ""
    username:   str
    email:      str
    password:   str

class VerifyOTPRequest(BaseModel):
    user_id:  str
    otp_code: str

class ResendOTPRequest(BaseModel):
    user_id: str

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    user_id:      str
    otp_code:     str
    new_password: str


# ══════════════════════════════════════════════════════════════════════════════
# AUTH ROUTES
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/auth/check-username")
def check_username(username: str):
    available = check_username_available(username)
    return {"available": available, "username": username}


@app.post("/api/auth/check-email")
def check_email(req: SignUpStep3):
    email = req.email.strip().lower()
    if not email or "@" not in email:
        return JSONResponse(status_code=400, content={"message": "Invalid email format"})
    available = check_email_available(email)
    if not available:
        return JSONResponse(status_code=409, content={"message": "Email already exists"})
    return {"message": "Email available"}


@app.post("/api/auth/suggest-username")
def suggest_username(req: SignUpStep1):
    username = get_available_username(req.first_name, req.last_name)
    return {"username": username}


@app.post("/api/auth/register")
def register(req: SignUpComplete, response: Response):
    if not req.first_name or len(req.first_name) < 2:
        return JSONResponse(status_code=400, content={"message": "First name must be at least 2 characters"})
    if len(req.password) < 8:
        return JSONResponse(status_code=400, content={"message": "Password must be at least 8 characters"})
    if not check_email_available(req.email):
        return JSONResponse(status_code=409, content={"message": "Email already exists"})
    if not check_username_available(req.username):
        return JSONResponse(status_code=409, content={"message": "Username already taken"})

    user = create_user(
        first_name=req.first_name,
        last_name=req.last_name,
        username=req.username,
        email=req.email,
        password=req.password,
    )

    otp = generate_otp()
    create_email_verification(str(user.id), otp)
    send_otp_email(user.email, otp, user.first_name)

    return {
        "user_id": str(user.id),
        "message": "OTP sent to your email",
        "email":   user.email,
    }


@app.post("/api/auth/verify-otp")
def verify_otp_route(req: VerifyOTPRequest, response: Response):
    success = verify_otp(req.user_id, req.otp_code)
    if not success:
        return JSONResponse(status_code=400, content={"message": "Invalid or expired OTP"})

    user          = get_user_by_id(req.user_id)
    access_token  = create_access_token(str(user.id))
    refresh_token = create_refresh_token(str(user.id))
    save_refresh_token(str(user.id), refresh_token)
    update_last_login(str(user.id))

    try:
        send_welcome_email(user.email, user.first_name, user.username)
    except Exception:
        pass

    response.set_cookie(
        key=REFRESH_TOKEN_COOKIE,
        value=refresh_token,
        httponly=True,
        samesite="lax",
        max_age=7 * 24 * 3600,
    )
    return {
        "access_token": access_token,
        "user": _user_dict(user),
    }


@app.post("/api/auth/resend-otp")
def resend_otp(req: ResendOTPRequest):
    user = get_user_by_id(req.user_id)
    if not user:
        return JSONResponse(status_code=404, content={"message": "User not found"})
    otp = generate_otp()
    create_email_verification(str(user.id), otp)
    send_otp_email(user.email, otp, user.first_name)
    return {"message": "OTP resent"}


@app.post("/api/auth/login")
def login(req: LoginRequest, response: Response):
    user = get_user_by_identifier(req.identifier)
    if not user or not verify_password(req.password, user.password_hash):
        return JSONResponse(status_code=401, content={"message": "Invalid credentials"})

    if not user.email_verified:
        otp = generate_otp()
        create_email_verification(str(user.id), otp)
        send_otp_email(user.email, otp, user.first_name)
        return JSONResponse(status_code=403, content={
            "message": "Email not verified",
            "user_id": str(user.id),
        })

    access_token  = create_access_token(str(user.id))
    refresh_token = create_refresh_token(str(user.id))
    save_refresh_token(str(user.id), refresh_token)
    update_last_login(str(user.id))

    response.set_cookie(
        key=REFRESH_TOKEN_COOKIE,
        value=refresh_token,
        httponly=True,
        samesite="lax",
        max_age=7 * 24 * 3600,
    )
    return {
        "access_token": access_token,
        "user": _user_dict(user),
    }


@app.post("/api/auth/refresh")
def refresh_token_route(request: Request, response: Response):
    token = request.cookies.get(REFRESH_TOKEN_COOKIE)
    if not token:
        return JSONResponse(status_code=401, content={"message": "No refresh token"})
    rt = get_refresh_token(token)
    if not rt:
        return JSONResponse(status_code=401, content={"message": "Invalid or expired refresh token"})
    user         = get_user_by_id(str(rt.user_id))
    access_token = create_access_token(str(user.id))
    return {"access_token": access_token, "user": _user_dict(user)}


@app.post("/api/auth/logout")
def logout(request: Request, response: Response):
    token = request.cookies.get(REFRESH_TOKEN_COOKIE)
    if token:
        delete_refresh_token(token)
    response.delete_cookie(REFRESH_TOKEN_COOKIE)
    return {"message": "Logged out"}


@app.get("/api/auth/me")
def get_me(current_user=Depends(get_current_user)):
    return _user_dict(current_user)


@app.post("/api/auth/forgot-password")
def forgot_password(req: ForgotPasswordRequest):
    user = get_user_by_email(req.email)
    if not user:
        return {"message": "If that email exists, a reset code was sent"}
    otp = generate_otp()
    create_email_verification(str(user.id), otp)
    send_otp_email(user.email, otp, user.first_name)
    return {"message": "If that email exists, a reset code was sent", "user_id": str(user.id)}


@app.post("/api/auth/reset-password")
def reset_password(req: ResetPasswordRequest):
    success = verify_otp(req.user_id, req.otp_code)
    if not success:
        return JSONResponse(status_code=400, content={"message": "Invalid or expired OTP"})
    from crud.auth import hash_password
    db = SessionLocal()
    user = db.query(User).filter(User.id == req.user_id).first()
    if user:
        user.password_hash = hash_password(req.new_password)
        db.commit()
    db.close()
    return {"message": "Password reset successful"}


def _user_dict(user) -> dict:
    return {
        "id":                str(user.id),
        "first_name":        user.first_name,
        "last_name":         user.last_name or "",
        "username":          user.username,
        "email":             user.email,
        "avatar_url":        user.avatar_url or "",
        "subscription_type": user.subscription_type,
        "role":              user.role,
        "email_verified":    user.email_verified,
    }


# ══════════════════════════════════════════════════════════════════════════════
# CHAT & APP SCHEMAS
# ══════════════════════════════════════════════════════════════════════════════

class CodeRequest(BaseModel):
    code: str

class ChatRequest(BaseModel):
    conversation_id: str
    message: str

class ConversationRequest(BaseModel):
    title: str

class UpdateConversationRequest(BaseModel):
    title: str

class MessageRequest(BaseModel):
    conversation_id: str
    role: str
    content: str


# ══════════════════════════════════════════════════════════════════════════════
# CHAT ROUTES
# ══════════════════════════════════════════════════════════════════════════════

@app.post("/chat")
async def chat(req: ChatRequest, current_user=Depends(get_optional_user)):
    # ── DIAGNOSTIC (temporary) ──────────────────────────────────────────────
    # Compare this printed conversation_id, byte-for-byte, against the id
    # printed by [DIAG /conversation] when that conversation was created.
    print(f"[DIAG /chat] received conversation_id = {req.conversation_id!r} (type={type(req.conversation_id)})")
    print(f"[DIAG /chat] current_user = {current_user!r}")
    # ── END DIAGNOSTIC ───────────────────────────────────────────────────────

    # Ownership check — only if user is logged in
    if current_user:
        conv = get_conversation_by_id(req.conversation_id)

        # ── DIAGNOSTIC (temporary) ──────────────────────────────────────────
        print(f"[DIAG /chat] get_conversation_by_id({req.conversation_id!r}) -> {conv!r}")
        # ── END DIAGNOSTIC ───────────────────────────────────────────────────

        if not conv:
            # ── DIAGNOSTIC (temporary) ───────────────────────────────────────
            print("[DIAG /chat] NOT FOUND — this is the 404. Compare the id above "
                  "against the id [DIAG /conversation] printed when it was created.")
            # ── END DIAGNOSTIC ────────────────────────────────────────────────
            return JSONResponse(status_code=404, content={"response": "Conversation not found"})
        if conv.user_id and str(conv.user_id) != str(current_user.id):
            # ── DIAGNOSTIC (temporary) ───────────────────────────────────────
            print(f"[DIAG /chat] OWNERSHIP MISMATCH: conv.user_id={conv.user_id!r} "
                  f"vs current_user.id={current_user.id!r}")
            # ── END DIAGNOSTIC ────────────────────────────────────────────────
            return JSONResponse(status_code=403, content={"response": "Access denied"})

    try:
        create_message(req.conversation_id, "user", req.message)
        messages = get_messages(req.conversation_id)

        # Only send last 10 messages to stay under token limit
        recent = messages[-10:] if len(messages) > 10 else messages

        groq_messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        for msg in recent:
            groq_messages.append({"role": msg.role, "content": msg.content})

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=groq_messages
        )

        ai_reply = response.choices[0].message.content

        # Save model response to file for debugging
        with open("response_model.txt", "w", encoding="utf-8") as f:
            f.write(f"{ai_reply}\n")

        create_message(req.conversation_id, "assistant", ai_reply)
        return {"response": ai_reply}

    except RateLimitError:
        return JSONResponse(status_code=429, content={"response": "⚠️ Rate limit reached. Please wait a moment."})
    except NotFoundError:
        return JSONResponse(status_code=404, content={"response": "❌ Model not found."})
    except APIError as e:
        return JSONResponse(status_code=500, content={"response": f"API Error: {str(e)}"})
    except Exception as e:
        return JSONResponse(status_code=500, content={"response": f"Server Error: {str(e)}"})


@app.post("/run-code")
async def run_code(req: CodeRequest):
    with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False, encoding="utf-8") as tmp:
        tmp.write(req.code)
        tmp_path = tmp.name
    try:
        result = subprocess.run(
            [sys.executable, tmp_path],
            capture_output=True, text=True, timeout=10
        )
        if result.returncode == 0:
            return {"output": result.stdout}
        else:
            return {"error": result.stderr}
    except subprocess.TimeoutExpired:
        return JSONResponse(status_code=408, content={"error": "⏱ Execution timed out."})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Server Error: {str(e)}"})
    finally:
        os.unlink(tmp_path)


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    content  = await file.read()
    filename = file.filename.lower()
    try:
        if filename.endswith(".pdf"):
            reader = pypdf.PdfReader(io.BytesIO(content))
            text   = "\n".join(page.extract_text() or "" for page in reader.pages)
            return {"content": text, "file_type": "pdf"}
        elif filename.endswith((".txt", ".py", ".js", ".ts", ".csv", ".md")):
            return {"content": content.decode("utf-8"), "file_type": "text"}
        else:
            return JSONResponse(status_code=400, content={"error": "Unsupported file type"})
    except Exception as ex:
        return JSONResponse(status_code=500, content={"error": str(ex)})


# ══════════════════════════════════════════════════════════════════════════════
# CONVERSATION ROUTES
# ══════════════════════════════════════════════════════════════════════════════
@app.post("/conversation")
def new_conversation(req: ConversationRequest, current_user=Depends(get_optional_user)):
    # ── DIAGNOSTIC (temporary) ──────────────────────────────────────────────
    print(f"[DIAG /conversation] current_user = {current_user!r}")
    # ── END DIAGNOSTIC ───────────────────────────────────────────────────────

    if not current_user:
        # ── DIAGNOSTIC (temporary) ───────────────────────────────────────────
        print("[DIAG /conversation] no current_user -> returning 401")
        # ── END DIAGNOSTIC ────────────────────────────────────────────────────
        return JSONResponse(status_code=401, content={"message": "Sign in to save your conversations"})

    # ── DIAGNOSTIC (temporary) ────────────────────────────────────────────────
    print(f"[DIAG /conversation] current_user.id = {current_user.id!r} (type={type(current_user.id)})")
    # ── END DIAGNOSTIC ─────────────────────────────────────────────────────────

    conversation = create_conversation(req.title, user_id=str(current_user.id))

    # ── DIAGNOSTIC (temporary) ────────────────────────────────────────────────
    print(f"[DIAG /conversation] created conversation.id = {conversation.id!r} (type={type(conversation.id)})")
    # ── END DIAGNOSTIC ─────────────────────────────────────────────────────────

    return {"id": str(conversation.id), "title": conversation.title}


@app.get("/conversations")
def fetch_conversations(current_user=Depends(get_optional_user)):
    if not current_user:
        return []
    conversations = get_conversations(user_id=str(current_user.id))
    return [{"id": str(c.id), "title": c.title} for c in conversations]


@app.patch("/conversation/{conversation_id}")
def update_conversation(conversation_id: str, req: UpdateConversationRequest, current_user=Depends(get_optional_user)):
    db   = SessionLocal()
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if conv:
        conv.title = req.title
        db.commit()
    db.close()
    return {"id": conversation_id, "title": req.title}


@app.delete("/conversation/{conversation_id}")
def remove_conversation(conversation_id: str, current_user=Depends(get_current_user)):
    conv = get_conversation_by_id(conversation_id)
    if not conv:
        return JSONResponse(status_code=404, content={"message": "Conversation not found"})
    if str(conv.user_id) != str(current_user.id):
        return JSONResponse(status_code=403, content={"message": "Access denied"})
    delete_conversation(conversation_id)
    return {"deleted": conversation_id}


@app.get("/conversation/{conversation_id}/messages")
def fetch_messages(conversation_id: str, current_user=Depends(get_optional_user)):
    # ✅ get_optional_user — does NOT block unauthenticated requests
    conv = get_conversation_by_id(conversation_id)
    if not conv:
        return JSONResponse(status_code=404, content={"message": "Conversation not found"})
    if current_user and conv.user_id and str(conv.user_id) != str(current_user.id):
        return JSONResponse(status_code=403, content={"message": "Access denied"})
    messages = get_messages(conversation_id)
    return [
        {"id": str(m.id), "role": m.role, "content": m.content, "created_at": m.created_at}
        for m in messages
    ]


@app.post("/message")
def new_message(req: MessageRequest, current_user=Depends(get_optional_user)):
    if current_user:
        conv = get_conversation_by_id(req.conversation_id)
        if not conv:
            return JSONResponse(status_code=404, content={"message": "Conversation not found"})
        if conv.user_id and str(conv.user_id) != str(current_user.id):
            return JSONResponse(status_code=403, content={"message": "Access denied"})
    message = create_message(req.conversation_id, req.role, req.content)
    return {
        "id":              str(message.id),
        "conversation_id": str(message.conversation_id),
        "role":            message.role,
        "content":         message.content,
    }