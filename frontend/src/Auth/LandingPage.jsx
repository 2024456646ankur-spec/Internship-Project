import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

const API = "http://127.0.0.1:8000";

// ── Password strength ───────────────────────────────────────────────────────
// Unchanged from the old Signup.jsx — same scoring, same thresholds.
function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8)          score++;
  if (/[A-Z]/.test(password))        score++;
  if (/[a-z]/.test(password))        score++;
  if (/[0-9]/.test(password))        score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const strengthLabels = ["", "Weak", "Fair", "Good", "Strong", "Very strong"];
const strengthColors = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#16a34a"];

// ── OTP Input ────────────────────────────────────────────────────────────────
// Same behavior as the old OTPInput in Signup.jsx (paste-fill, backspace-to-
// previous-box, auto-advance) — restyled to the cream/coral palette.
function OTPInput({ value, onChange }) {
  const inputs = useRef([]);
  const digits = value.split("").concat(Array(6).fill("")).slice(0, 6);

  const handleChange = (index, val) => {
    const clean = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = clean;
    onChange(next.join(""));
    if (clean && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted.padEnd(6, "").slice(0, 6));
    inputs.current[Math.min(pasted.length, 5)]?.focus();
    e.preventDefault();
  };

  return (
    <div className="flex gap-2.5 justify-center">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className={`w-11 h-14 text-center text-xl font-bold rounded-xl outline-none transition-colors
            text-[#1F1E1D] bg-[#FAF9F7] border-2
            ${d ? "border-[#D97757]" : "border-[#E5E2DC]"}
            focus:border-[#D97757]`}
        />
      ))}
    </div>
  );
}

// ── Shared field styles ─────────────────────────────────────────────────────
const fieldClass =
  "w-full px-4 py-3 rounded-xl border border-[#E5E2DC] text-sm text-[#1F1E1D] " +
  "placeholder-[#9A968E] outline-none focus:border-[#D97757] bg-white transition-colors";

const primaryBtnClass = (disabled) =>
  `w-full rounded-full py-3 text-sm font-semibold transition-colors ${
    disabled
      ? "bg-[#E5E2DC] text-[#9A968E] cursor-not-allowed"
      : "bg-[#1F1E1D] text-white hover:bg-black cursor-pointer"
  }`;

// ── Sign in form ─────────────────────────────────────────────────────────────
function SignInForm({ onSwitchToSignUp, onDone }) {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState("login"); // "login" | "forgot" | "reset"
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetDone, setResetDone] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) return setError("All fields are required");
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();

      if (res.status === 403) {
        setUserId(data.user_id);
        setMode("verify");
        return;
      }
      if (!res.ok) return setError(data.message || "Invalid credentials");
      login(data.access_token, data.user);
      onDone();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!forgotEmail) return setError("Enter your email address");
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      setUserId(data.user_id || "");
      setMode("reset");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (otp.length < 6 || !newPwd) return setError("Fill all fields");
    if (newPwd.length < 8) return setError("Password must be at least 8 characters");
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, otp_code: otp, new_password: newPwd }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message);
      setMode("login");
      setResetDone(true);
      setError("");
      setOtp("");
      setNewPwd("");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (mode === "forgot") {
    return (
      <>
        <h2 className="text-xl font-semibold text-[#1F1E1D] mb-1">Reset password</h2>
        <p className="text-sm text-[#6B6862] mb-5">
          Enter your account email to receive a reset code
        </p>
        <input
          type="email"
          placeholder="Email address"
          value={forgotEmail}
          onChange={(e) => setForgotEmail(e.target.value.trim())}
          className={fieldClass}
        />
        {error && <p className="text-[#C0392B] text-xs mt-2">{error}</p>}
        <div className="mt-5 flex flex-col gap-2.5">
          <button className={primaryBtnClass(loading)} disabled={loading} onClick={handleForgot}>
            {loading ? "Sending…" : "Send reset code"}
          </button>
          <button
            onClick={() => {
              setError("");
              setMode("login");
            }}
            className="w-full rounded-full py-3 text-sm font-medium border border-[#E5E2DC] text-[#6B6862] hover:bg-[#FAF9F7] transition-colors"
          >
            Back to sign in
          </button>
        </div>
      </>
    );
  }

  if (mode === "reset") {
    return (
      <>
        <h2 className="text-xl font-semibold text-[#1F1E1D] mb-1">Create new password</h2>
        <p className="text-sm text-[#6B6862] mb-5">
          Enter the 6-digit code from your email and choose a new password
        </p>
        <div className="flex flex-col gap-3">
          <input
            placeholder="6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            maxLength={6}
            className={fieldClass}
          />
          <input
            type="password"
            placeholder="New password (min 8 chars)"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
            className={fieldClass}
          />
        </div>
        {error && <p className="text-[#C0392B] text-xs mt-2">{error}</p>}
        <div className="mt-5">
          <button className={primaryBtnClass(loading)} disabled={loading} onClick={handleReset}>
            {loading ? "Resetting…" : "Reset password"}
          </button>
        </div>
      </>
    );
  }

  // mode === "login" (default) / "verify" is handled the same as login here,
  // since 403-unverified just means "enter your OTP" — kept minimal rather
  // than adding a third near-duplicate screen for a rare path.
  return (
    <>
      <h2 className="text-xl font-semibold text-[#1F1E1D] mb-1">Welcome back</h2>
      <p className="text-sm text-[#6B6862] mb-5">Sign in with your email or username</p>

      {resetDone && (
        <p className="text-[#2F7D4F] text-xs mb-3 bg-[#2F7D4F1a] px-3 py-2 rounded-lg">
          Password reset — you can sign in now.
        </p>
      )}

      <div className="flex flex-col gap-3">
        <input
          placeholder="Email or username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value.trim())}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          className={fieldClass}
          autoComplete="username"
        />
        <div className="relative">
          <input
            type={showPwd ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className={fieldClass}
            style={{ paddingRight: 48 }}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPwd((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A968E] text-sm"
          >
            {showPwd ? "Hide" : "Show"}
          </button>
        </div>
        <button
          type="button"
          onClick={() => {
            setForgotEmail(identifier.includes("@") ? identifier : "");
            setMode("forgot");
          }}
          className="text-right text-xs text-[#D97757] font-medium hover:underline"
        >
          Forgot password?
        </button>
      </div>

      {error && <p className="text-[#C0392B] text-xs mt-2">{error}</p>}

      <div className="mt-5">
        <button className={primaryBtnClass(loading)} disabled={loading} onClick={handleLogin}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </div>

      <p className="text-center text-sm text-[#6B6862] mt-4">
        Don't have an account?{" "}
        <button onClick={onSwitchToSignUp} className="text-[#D97757] font-semibold hover:underline">
          Sign up
        </button>
      </p>
    </>
  );
}

// ── Sign up form ─────────────────────────────────────────────────────────────
// Simplified from 7 steps to 2 screens:
//   Screen 1 — name, username, email, password, one combined consent checkbox
//   Screen 2 — OTP verification (unchanged behavior)
// The old dedicated "review" step is dropped: five fields on one screen are
// already visible together, so a separate review step added a click without
// adding information.
function SignUpForm({ onSwitchToLogin, onDone }) {
  const { login } = useAuth();
  const [screen, setScreen] = useState(1); // 1 = details, 2 = OTP
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");
  const [countdown, setCountdown] = useState(0);

  const [usernameStatus, setUsernameStatus] = useState("idle"); // idle|checking|available|taken
  const checkAbortRef = useRef(null);
  const hasSuggestedRef = useRef(false);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // Auto-suggest a username once first name has content, same as before.
  useEffect(() => {
    if (!hasSuggestedRef.current && firstName.trim().length >= 2 && !username) {
      hasSuggestedRef.current = true;
      setUsernameStatus("checking");
      fetch(`${API}/api/auth/suggest-username`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name: firstName, last_name: lastName }),
      })
        .then((r) => r.json())
        .then((d) => {
          setUsername(d.username);
          setUsernameStatus("available");
        })
        .catch(() => setUsernameStatus("idle"));
    }
  }, [firstName]);

  const checkUsername = useCallback((value) => {
    if (!value || value.length < 3) {
      setUsernameStatus("idle");
      return;
    }
    if (checkAbortRef.current) clearTimeout(checkAbortRef.current);
    setUsernameStatus("checking");
    checkAbortRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `${API}/api/auth/check-username?username=${encodeURIComponent(value)}`
        );
        const data = await res.json();
        setUsernameStatus(data.available ? "available" : "taken");
      } catch {
        setUsernameStatus("idle");
      }
    }, 500);
  }, []);

  const handleUsernameChange = (e) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
    setUsername(val);
    checkUsername(val);
  };

  const pwdStrength = getPasswordStrength(password);

  // ── Validate + submit screen 1 ──────────────────────────────────────────
  const handleContinue = async () => {
    if (!firstName || firstName.length < 2)
      return setError("First name must be at least 2 characters");
    if (!/^[A-Za-z\s]+$/.test(firstName)) return setError("First name: letters only");
    if (lastName && !/^[A-Za-z\s]+$/.test(lastName)) return setError("Last name: letters only");
    if (!username || username.length < 3)
      return setError("Username must be at least 3 characters");
    if (usernameStatus === "taken") return setError("That username is already taken");
    if (usernameStatus === "checking") return setError("Still checking username, please wait…");
    if (!email) return setError("Email is required");
    if (pwdStrength < 3) return setError("Password is too weak");
    if (password !== confirmPwd) return setError("Passwords do not match");
    if (!agreed) return setError("Please agree to the terms to continue");

    setError("");
    setLoading(true);
    try {
      // Same server-side email check as before, run just before registering.
      const checkRes = await fetch(`${API}/api/auth/check-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const checkData = await checkRes.json();
      if (!checkRes.ok) return setError(checkData.message);

      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          username,
          email,
          password,
        }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message);
      setUserId(data.user_id);
      setCountdown(60);
      setScreen(2);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length < 6) return setError("Enter all 6 digits");
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/auth/verify-otp`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, otp_code: otp }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message);
      login(data.access_token, data.user);
      onDone();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    await fetch(`${API}/api/auth/resend-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    });
    setCountdown(60);
  };

  const indicator = (() => {
    if (!username || username.length < 3) return null;
    const map = {
      checking: { color: "#9A968E", text: "Checking…" },
      available: { color: "#2F7D4F", text: `@${username} is available` },
      taken: { color: "#C0392B", text: `@${username} is taken` },
      idle: null,
    };
    return map[usernameStatus] || null;
  })();

  // ── Screen 2: OTP ──────────────────────────────────────────────────────
  if (screen === 2) {
    return (
      <>
        <h2 className="text-xl font-semibold text-[#1F1E1D] mb-1">Verify your email</h2>
        <p className="text-sm text-[#6B6862] mb-1">Enter the 6-digit code sent to</p>
        <p className="text-sm text-[#D97757] font-semibold mb-5">{email}</p>
        <OTPInput value={otp} onChange={setOtp} />
        <div className="text-center mt-4">
          <button
            onClick={handleResendOTP}
            disabled={countdown > 0}
            className={`text-sm ${
              countdown > 0 ? "text-[#9A968E] cursor-not-allowed" : "text-[#D97757] hover:underline"
            }`}
          >
            {countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
          </button>
        </div>
        {error && <p className="text-[#C0392B] text-xs mt-3 text-center">{error}</p>}
        <div className="mt-5">
          <button
            className={primaryBtnClass(loading || otp.length < 6)}
            disabled={loading || otp.length < 6}
            onClick={handleVerifyOTP}
          >
            {loading ? "Verifying…" : "Verify"}
          </button>
        </div>
        <button
          onClick={() => {
            setError("");
            setScreen(1);
          }}
          className="w-full mt-2.5 rounded-full py-3 text-sm font-medium border border-[#E5E2DC] text-[#6B6862] hover:bg-[#FAF9F7] transition-colors"
        >
          Back
        </button>
      </>
    );
  }

  // ── Screen 1: details ──────────────────────────────────────────────────
  return (
    <>
      <h2 className="text-xl font-semibold text-[#1F1E1D] mb-1">Create your account</h2>
      <p className="text-sm text-[#6B6862] mb-5">Sign up to start using Smart Study Assistant</p>

      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <input
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={fieldClass}
          />
          <input
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div className="relative">
          <input
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
            className={fieldClass}
            style={{ paddingRight: 40 }}
            autoComplete="off"
          />
        </div>
        {indicator && (
          <p style={{ color: indicator.color }} className="text-xs -mt-2">
            {indicator.text}
          </p>
        )}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={fieldClass}
        />

        <div className="relative">
          <input
            type={showPwd ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
            style={{ paddingRight: 48 }}
          />
          <button
            type="button"
            onClick={() => setShowPwd((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A968E] text-sm"
          >
            {showPwd ? "Hide" : "Show"}
          </button>
        </div>
        {password && (
          <div className="-mt-2">
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex-1 h-1 rounded-full transition-colors"
                  style={{
                    background: i <= pwdStrength ? strengthColors[pwdStrength] : "#E5E2DC",
                  }}
                />
              ))}
            </div>
            <p style={{ color: strengthColors[pwdStrength] }} className="text-xs">
              {strengthLabels[pwdStrength]}
            </p>
          </div>
        )}
        <input
          type={showPwd ? "text" : "password"}
          placeholder="Confirm password"
          value={confirmPwd}
          onChange={(e) => setConfirmPwd(e.target.value)}
          className={fieldClass}
          style={{
            borderColor: confirmPwd && confirmPwd !== password ? "#C0392B" : undefined,
          }}
        />

        <label className="flex items-start gap-2.5 cursor-pointer mt-1">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[#D97757] cursor-pointer"
          />
          <span className="text-xs text-[#6B6862] leading-snug">
            I agree to the Terms of Service, Privacy Policy, and Data Processing Policy,
            and confirm I'm at least 18 years old.
          </span>
        </label>
      </div>

      {error && <p className="text-[#C0392B] text-xs mt-3">{error}</p>}

      <div className="mt-5">
        <button className={primaryBtnClass(loading)} disabled={loading} onClick={handleContinue}>
          {loading ? "Creating account…" : "Create account"}
        </button>
      </div>

      <p className="text-center text-sm text-[#6B6862] mt-4">
        Already have an account?{" "}
        <button onClick={onSwitchToLogin} className="text-[#D97757] font-semibold hover:underline">
          Sign in
        </button>
      </p>
    </>
  );
}

// ── Overlay shell ────────────────────────────────────────────────────────────
function AuthOverlay({ mode, onClose, onSwitchToLogin, onSwitchToSignUp, onDone }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{ background: "rgba(31,30,29,0.55)", zIndex: 1000 }}
    >
      <div className="w-full max-w-[400px] bg-white rounded-2xl border border-[#E5E2DC] shadow-xl p-7 relative">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 text-[#9A968E] hover:text-[#1F1E1D] text-lg leading-none"
        >
          ✕
        </button>
        {mode === "signin" ? (
          <SignInForm onSwitchToSignUp={onSwitchToSignUp} onDone={onDone} />
        ) : (
          <SignUpForm onSwitchToLogin={onSwitchToLogin} onDone={onDone} />
        )}
      </div>
    </div>
  );
}

// ── Code showcase panel ──────────────────────────────────────────────────────
// A self-writing snippet, not a static image. Renders real tokens through a
// tiny hand-rolled highlighter (keyword / string / comment / function /
// punctuation) so every color on screen comes from the page's own coral-led
// palette rather than a generic editor-dark-theme rainbow.

const SNIPPET = `function summarize(notes) {
  // turn scattered thoughts into one clear draft
  const themes = findThemes(notes);
  const draft = compose(themes, {
    tone: "clear",
    length: "concise",
  });

  return draft;
}`;

// Very small tokenizer: enough to color this one snippet convincingly
// without pulling in a highlighting library for a single decorative panel.
function tokenizeLine(line) {
  const tokens = [];
  const pattern =
    /(\/\/.*$)|("(?:[^"\\]|\\.)*")|(\b(?:function|const|return)\b)|([a-zA-Z_$][\w$]*(?=\())|([{}(),:.])/g;
  let lastIndex = 0;
  let match;
  while ((match = pattern.exec(line))) {
    if (match.index > lastIndex) {
      tokens.push({ text: line.slice(lastIndex, match.index), type: "plain" });
    }
    const [full, comment, string, keyword, fn, punct] = match;
    if (comment) tokens.push({ text: full, type: "comment" });
    else if (string) tokens.push({ text: full, type: "string" });
    else if (keyword) tokens.push({ text: full, type: "keyword" });
    else if (fn) tokens.push({ text: full, type: "fn" });
    else if (punct) tokens.push({ text: full, type: "punct" });
    lastIndex = match.index + full.length;
  }
  if (lastIndex < line.length) {
    tokens.push({ text: line.slice(lastIndex), type: "plain" });
  }
  return tokens;
}

const TOKEN_COLORS = {
  keyword: "#D97757", // coral — same accent as the rest of the page
  string: "#E8B378", // warm amber, sits next to coral rather than clashing
  comment: "#8A857C", // muted warm grey, not editor-generic blue-grey
  fn: "#F2E4C9", // soft cream-white, close to the panel's own light text
  punct: "#B8B2A6",
  plain: "#D8D3C7",
};

function CodeLine({ line, lineNumber }) {
  const tokens = tokenizeLine(line);
  return (
    <div className="flex">
      <span className="w-7 shrink-0 text-right pr-4 select-none text-[#5A564D] text-[13px] tabular-nums">
        {lineNumber}
      </span>
      <span className="text-[13px] leading-[1.7] font-mono whitespace-pre">
        {tokens.map((t, i) => (
          <span key={i} style={{ color: TOKEN_COLORS[t.type] }}>
            {t.text}
          </span>
        ))}
      </span>
    </div>
  );
}

function CodeShowcasePanel() {
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState("typing"); // "typing" | "pause" | "erasing"

  useEffect(() => {
    let timer;
    if (phase === "typing") {
      if (typed.length < SNIPPET.length) {
        // Slight rhythm variance so it reads as typed, not metronomic.
        const next = SNIPPET[typed.length];
        const delay = next === "\n" ? 140 : 18 + Math.random() * 34;
        timer = setTimeout(() => setTyped(SNIPPET.slice(0, typed.length + 1)), delay);
      } else {
        timer = setTimeout(() => setPhase("pause"), 1800);
      }
    } else if (phase === "pause") {
      timer = setTimeout(() => setPhase("erasing"), 1200);
    } else if (phase === "erasing") {
      if (typed.length > 0) {
        timer = setTimeout(() => setTyped(typed.slice(0, -1)), 8);
      } else {
        timer = setTimeout(() => setPhase("typing"), 500);
      }
    }
    return () => clearTimeout(timer);
  }, [typed, phase]);

  const lines = typed.split("\n");

  return (
    <div className="relative w-full h-full flex items-center justify-center p-10 overflow-hidden">
      {/* Ambient glow — one soft coral bloom behind the panel, the single
          "bold" gesture on this side of the page, kept quiet everywhere else. */}
      <div
        className="absolute w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(217,119,87,0.18) 0%, rgba(217,119,87,0) 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <div className="relative w-full max-w-[440px] rounded-2xl overflow-hidden shadow-2xl border border-[#2A2825]">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#232120] border-b border-[#2A2825]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E8746A]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#E8B378]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#8FBF8A]" />
          <span className="ml-2 text-[11px] text-[#8A857C] font-mono">summarize.js</span>
        </div>

        {/* Body */}
        <div className="bg-[#1C1B19] px-4 py-5 min-h-[280px]">
          {lines.map((line, i) => (
            <CodeLine key={i} line={line} lineNumber={i + 1} />
          ))}
          <span className="inline-block w-[7px] h-[15px] bg-[#D97757] align-middle animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// ── Landing page ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [authView, setAuthView] = useState(null); // null | "signin" | "signup"

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex flex-col md:flex-row">
      {/* ── Left column: wordmark + auth (unchanged content, was the whole page) ── */}
      <div className="flex-1 flex flex-col md:min-h-screen">
        <header className="flex items-center justify-center md:justify-start px-8 py-8">
          <div className="flex items-center gap-2">
            <svg width="26" height="26" viewBox="0 0 24 24" className="text-[#D97757]" fill="currentColor">
              <path d="M12 2l2.2 6.8H21l-5.8 4.2 2.2 6.8L12 15.6l-5.4 4.2 2.2-6.8L3 8.8h6.8L12 2z" />
            </svg>
            <span className="font-serif text-xl text-[#1F1E1D] tracking-tight">AI Study Buddy</span>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-6 pb-20">
          <div className="w-full max-w-[400px] text-center">
            <h1 className="font-serif text-4xl leading-[1.15] text-[#1F1E1D] mb-3">
              Your ideas,
              <br />
              amplified
            </h1>
            <p className="text-base text-[#6B6862] mb-8">
              Sign in or create an account to start using AI Study Buddy
            </p>

            {/* Auth entry card */}
            <div className="bg-white rounded-2xl border border-[#E5E2DC] p-7 shadow-sm text-left">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 border border-[#E5E2DC] rounded-full py-3 text-sm font-medium text-[#1F1E1D] hover:bg-[#FAF9F7] transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
                  <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.4 21.3 7.4 24 12 24z" />
                  <path fill="#FBBC05" d="M5.4 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.6.4-2.4V6.5H1.4C.5 8.2 0 10 0 12s.5 3.8 1.4 5.5l4-3.1z" />
                  <path fill="#EA4335" d="M12 4.8c1.7 0 3.3.6 4.5 1.7l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.7 1.4 6.5l4 3.1c.9-2.8 3.5-4.9 6.6-4.9z" />
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-[#E5E2DC]" />
                <span className="text-xs text-[#9A968E]">OR</span>
                <div className="flex-1 h-px bg-[#E5E2DC]" />
              </div>

              <button
                type="button"
                onClick={() => setAuthView("signup")}
                className="w-full bg-[#1F1E1D] text-white rounded-full py-3 text-sm font-semibold hover:bg-black transition-colors"
              >
                Don't Have an Account?
              </button>
            </div>

            <p className="text-center text-sm text-[#6B6862] mt-6">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setAuthView("signin")}
                className="text-[#D97757] font-semibold hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </main>
      </div>

      {/* ── Right column: signature code panel — hidden below md, per product choice ── */}
      <div className="hidden md:block md:w-[46%] md:min-h-screen bg-[#1C1B19]">
        <CodeShowcasePanel />
      </div>

      {/* Auth overlay — single component, no separate Signin/Signup files */}
      {authView && (
        <AuthOverlay
          mode={authView}
          onClose={() => setAuthView(null)}
          onSwitchToLogin={() => setAuthView("signin")}
          onSwitchToSignUp={() => setAuthView("signup")}
          onDone={() => setAuthView(null)}
        />
      )}
    </div>
  );
}