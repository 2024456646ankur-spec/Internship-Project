import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  dracula,
  atomDark,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useAuth } from "../Auth/AuthContext";
import { usePrefs } from "../Auth/PrefsContext";
import LoginProgressSummary from "../pages/roadmap/LoginProgressSummary.jsx";

const API = "http://127.0.0.1:8000";

// ── Claude-style code theme ───────────────────────────────────────────────────
// A hand-tuned Prism token map, not a repaint of an imported theme. Available
// as a defensive fallback if prefs.codeTheme ever resolves to nothing — the
// editor's actual colors are driven by whichever theme is selected in
// Personalization (see CODE_THEMES below), matching the existing Theme
// dropdown behavior rather than overriding it.
const claudeCodeTheme = {
  'code[class*="language-"]': { color: "#e8e6e3", fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace", fontSize: "13.5px", lineHeight: 1.7, direction: "ltr", textAlign: "left", whiteSpace: "pre", wordSpacing: "normal", wordBreak: "normal", tabSize: 4, hyphens: "none" },
  'pre[class*="language-"]': { color: "#e8e6e3", background: "none", fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace", fontSize: "13.5px", lineHeight: 1.7, direction: "ltr", textAlign: "left", whiteSpace: "pre", wordSpacing: "normal", wordBreak: "normal", tabSize: 4, hyphens: "none" },
  comment: { color: "#6e7681", fontStyle: "italic" },
  prolog: { color: "#6e7681" },
  doctype: { color: "#6e7681" },
  cdata: { color: "#6e7681" },
  punctuation: { color: "#9198a1" },
  "attr-name": { color: "#c9a869" },
  "class-name": { color: "#e0b170" },
  boolean: { color: "#c98a7d" },
  constant: { color: "#c98a7d" },
  number: { color: "#c98a7d" },
  atrule: { color: "#b58ef2" },
  keyword: { color: "#b58ef2" },
  property: { color: "#7ec4cc" },
  tag: { color: "#e0777d" },
  symbol: { color: "#c98a7d" },
  deleted: { color: "#e0777d" },
  important: { color: "#e0b170" },
  selector: { color: "#9fca8f" },
  string: { color: "#9fca8f" },
  char: { color: "#9fca8f" },
  builtin: { color: "#7ec4cc" },
  inserted: { color: "#9fca8f" },
  regex: { color: "#9fca8f" },
  "attr-value": { color: "#9fca8f" },
  variable: { color: "#e8e6e3" },
  operator: { color: "#9198a1" },
  function: { color: "#7cb8e0" },
  url: { color: "#9fca8f" },
};

// ── Code theme map ────────────────────────────────────────────────────────────
// "github" and "monokai" aren't in prism's esm dist by default so we use
// close equivalents that ARE available.
const CODE_THEMES = {
  oneDark,
  github:  atomDark,   // light-ish alternative; swap if you install github style
  dracula,
  monokai: atomDark,   // swap for monokai if you install it
};

// ── Font size map ─────────────────────────────────────────────────────────────
const FONT_SIZES = { small: 13, medium: 15, large: 17 };

// ── Supported languages ───────────────────────────────────────────────────────
// Central place to add a 5th, 6th, etc. language later. `prism` is the id
// react-syntax-highlighter/Prism expects; `runner` is the value sent to the
// backend's /run-code endpoint; `ext` is used for the Download button.
const LANGUAGES = {
  python: {
    label: "Python",
    icon: "🐍",
    prism: "python",
    runner: "python",
    ext: "py",
    starterComment: "#",
  },
  javascript: {
    label: "JavaScript",
    icon: "🟨",
    prism: "javascript",
    runner: "javascript",
    ext: "js",
    starterComment: "//",
  },
  cpp: {
    label: "C++",
    icon: "🔵",
    prism: "cpp",
    runner: "cpp",
    ext: "cpp",
    starterComment: "//",
  },
  java: {
    label: "Java",
    icon: "☕",
    prism: "java",
    runner: "java",
    ext: "java",
    starterComment: "//",
  },
};

// Detect language from a fenced-code-block language string like "python" / "py" / "cpp" / "c++" / "js"
function normalizeLanguage(langHint) {
  const l = (langHint || "").toLowerCase();
  if (["py", "python", "python3"].includes(l)) return "python";
  if (["js", "javascript", "jsx", "node"].includes(l)) return "javascript";
  if (["cpp", "c++", "cc", "cxx"].includes(l)) return "cpp";
  if (["java"].includes(l)) return "java";
  return LANGUAGES[l] ? l : "python"; // fallback
}

async function runCode(code, language) {
  const runner = LANGUAGES[language]?.runner ?? language;
  const res = await fetch(`${API}/run-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, language: runner }),
  });
  return res.json();
}

// Calls the same chat/AI endpoint the rest of the app already uses, asking it
// to act as a code reviewer/explainer for the given snippet. Reuses `/chat`
// rather than inventing a new backend contract.
async function explainCode(code, language, conversationId) {
  const t = localStorage.getItem("access_token");
  const headers = { "Content-Type": "application/json" };
  if (t) headers["Authorization"] = `Bearer ${t}`;

  const debugPrompt =
    `Please analyze the following ${LANGUAGES[language]?.label ?? language} code. ` +
    `Explain what it does step by step, point out any bugs, edge cases, or ` +
    `performance issues, and suggest concrete fixes if you find problems. ` +
    `Keep it structured and easy to scan.\n\n\`\`\`${language}\n${code}\n\`\`\``;

  const res = await fetch(`${API}/chat`, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({
      conversation_id: conversationId,
      message: debugPrompt,
      response_style: "detailed",
    }),
  });
  const data = await res.json();
  return data.response ?? "Could not analyze this code.";
}

function getBestVoice() {
  const voices = window.speechSynthesis.getVoices();
  const preferred = [
    "Google US English",
    "Google UK English Female",
    "Microsoft Aria Online (Natural) - English (United States)",
    "Microsoft Jenny Online (Natural) - English (United States)",
    "Microsoft Guy Online (Natural) - English (United States)",
    "Samantha",
    "Karen",
    "Google UK English Male",
  ];
  for (const name of preferred) {
    const match = voices.find((v) => v.name === name);
    if (match) return match;
  }
  return voices.find((v) => v.lang.startsWith("en")) || voices[0] || null;
}

function speakText(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const clean = text
    .replace(/```[\s\S]*?```/g, "code block")
    .replace(/`[^`]+`/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/#{1,6}\s/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[-*]\s/g, "")
    .trim();
  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.lang = "en-US";
  utterance.rate = 0.95;
  utterance.pitch = 1.05;
  utterance.volume = 1;
  const trySpeak = () => {
    const voice = getBestVoice();
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  };
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.onvoiceschanged = null;
      trySpeak();
    };
  } else {
    trySpeak();
  }
}

function stopSpeaking() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

// ── Icon set (inline SVG, stroke-based, matches the restrained pill style) ───
const Icon = {
  Copy: (p) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  Check: (p) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Edit: (p) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
    </svg>
  ),
  Play: (p) => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  Reset: (p) => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" />
    </svg>
  ),
  Close: (p) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  ),
  Attach: (p) => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  ),
  Send: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
    </svg>
  ),
  Bug: (p) => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m8 2 1.88 1.88" /><path d="M14.12 3.88 16 2" />
      <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
      <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
      <path d="M12 20v-9" /><path d="M6.53 9C4.6 8.8 3 7.1 3 5" /><path d="M6 13H2" />
      <path d="M6.53 17c-1.93.2-3.53 1.9-3.53 4" /><path d="M17.47 9c1.93-.2 3.53-1.9 3.53-4" />
      <path d="M18 13h4" /><path d="M17.47 17c1.93.2 3.53 1.9 3.53 4" />
    </svg>
  ),
  ChevronDown: (p) => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  Download: (p) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
};

function CopyButton({ code, variant = "default" }) {
  const [copied, setCopied] = useState(false);
  const small = variant === "small";
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      style={{
        display: "flex", alignItems: "center", gap: 6,
        background: copied ? "color-mix(in srgb, var(--success) 16%, transparent)" : "transparent",
        color: copied ? "var(--success-soft)" : "var(--text-tertiary)",
        border: `1px solid ${copied ? "color-mix(in srgb, var(--success) 35%, transparent)" : "var(--glass-border)"}`,
        borderRadius: 7,
        padding: small ? "4px 9px" : "5px 11px",
        fontSize: small ? 11.5 : 12.5,
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.15s ease",
        fontFamily: "inherit",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={e => { if (!copied) { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--glass-border)"; e.currentTarget.style.background = "var(--glass-surface-2)"; } }}
      onMouseLeave={e => { if (!copied) { e.currentTarget.style.color = "var(--text-tertiary)"; e.currentTarget.style.background = "transparent"; } }}
    >
      {copied ? <Icon.Check /> : <Icon.Copy />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function DownloadButton({ code, language }) {
  const ext = LANGUAGES[language]?.ext ?? "txt";
  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `snippet.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };
  return (
    <button
      onClick={handleDownload}
      title="Download file"
      style={{
        display: "flex", alignItems: "center", gap: 6,
        background: "transparent", color: "var(--text-tertiary)",
        border: "1px solid var(--glass-border)", borderRadius: 7,
        padding: "4px 10px", fontSize: 11.5, fontWeight: 500,
        cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
        transition: "all 0.15s ease",
      }}
      onMouseEnter={e => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "var(--glass-surface-2)"; }}
      onMouseLeave={e => { e.currentTarget.style.color = "var(--text-tertiary)"; e.currentTarget.style.background = "transparent"; }}
    >
      <Icon.Download />Download
    </button>
  );
}

// ── Language dropdown used in the editor toolbar ─────────────────────────────
function LanguageSelector({ language, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const current = LANGUAGES[language];

  useEffect(() => {
    const handler = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={rootRef} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "var(--glass-surface-2)", color: "var(--text-secondary)",
          border: "1px solid var(--glass-border)", borderRadius: 7,
          padding: "5px 10px", fontSize: 12, fontWeight: 500,
          cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
        }}
      >
        <span>{current?.icon}</span>{current?.label}
        <Icon.ChevronDown style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s ease" }} />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 20,
          background: "var(--code-header-bg)", border: "1px solid var(--glass-border)",
          borderRadius: 9, padding: 5, minWidth: 150,
          boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
        }}>
          {Object.entries(LANGUAGES).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => { onChange(key); setOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 8, width: "100%",
                background: key === language ? "var(--gradient-accent-soft)" : "transparent",
                color: key === language ? "var(--accent-soft)" : "var(--text-secondary)",
                border: "none", borderRadius: 6, padding: "7px 9px",
                fontSize: 12.5, fontWeight: 500, cursor: "pointer",
                fontFamily: "inherit", textAlign: "left",
              }}
              onMouseEnter={e => { if (key !== language) e.currentTarget.style.background = "var(--glass-surface-2)"; }}
              onMouseLeave={e => { if (key !== language) e.currentTarget.style.background = "transparent"; }}
            >
              <span>{cfg.icon}</span>{cfg.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Line-numbered textarea wrapper for the editor pane ───────────────────────
// ── LineNumberedEditor — real syntax highlighting while still editable ──────
// Plain <textarea> alone can't show colored tokens, so this overlays an
// invisible (but fully interactive) textarea on top of a Prism-highlighted
// <pre>. Typing, selection, and caret all work normally on the textarea;
// what you *see* is the highlighted layer underneath, kept in sync on every
// keystroke and every scroll. This is what actually fixes the "bland editor"
// complaint — the old version rendered plain unstyled text while editing.
function LineNumberedEditor({ value, onChange, textareaRef, onKeyDown, language, codeStyle }) {
  const gutterRef  = useRef(null);
  const highlightRef = useRef(null);
  const lines = value.split("\n").length;
  const activeStyle = codeStyle ?? claudeCodeTheme;

  const syncScroll = () => {
    if (!textareaRef.current) return;
    const { scrollTop, scrollLeft } = textareaRef.current;
    if (gutterRef.current)     gutterRef.current.scrollTop = scrollTop;
    if (highlightRef.current) {
      highlightRef.current.scrollTop  = scrollTop;
      highlightRef.current.scrollLeft = scrollLeft;
    }
  };

  const sharedFont = {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
    fontSize: 13.5, lineHeight: 1.75, tabSize: 4,
  };

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden", background: "var(--code-bg)" }}>
      <div
        ref={gutterRef}
        style={{
          flexShrink: 0, width: 48, overflow: "hidden",
          padding: "20px 0", textAlign: "right",
          ...sharedFont, fontSize: 13,
          color: "var(--code-gutter)",
          userSelect: "none", borderRight: "1px solid var(--glass-border)",
        }}
      >
        {Array.from({ length: lines }, (_, i) => (
          <div key={i} style={{ padding: "0 12px" }}>{i + 1}</div>
        ))}
      </div>

      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {/* Highlighted display layer — read only, sits behind the textarea.
            Colors come from whichever theme is selected in Personalization
            (One Dark / GitHub / Dracula / Monokai), not a fixed palette. */}
        <div
          ref={highlightRef}
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0, overflow: "auto",
            pointerEvents: "none",
          }}
        >
          <SyntaxHighlighter
            language={LANGUAGES[language]?.prism ?? language}
            style={activeStyle}
            PreTag="div"
            customStyle={{
              margin: 0, background: "transparent",
              padding: "20px 24px", minHeight: "100%",
              ...sharedFont,
            }}
            codeTagProps={{ style: { fontFamily: sharedFont.fontFamily } }}
          >
            {value + "\n"}
          </SyntaxHighlighter>
        </div>

        {/* Real, interactive, fully transparent textarea on top */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onScroll={syncScroll}
          spellCheck={false}
          style={{
            position: "absolute", inset: 0, resize: "none",
            background: "transparent", color: "transparent",
            caretColor: "var(--text-secondary)", border: "none", outline: "none",
            padding: "20px 24px", ...sharedFont,
            WebkitTextFillColor: "transparent",
          }}
        />
      </div>
    </div>
  );
}

// ── Debug / analysis tab — sends code to the AI and renders its explanation ──
function DebugPanel({ code, language, conversationId }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const lastRequestedFor        = useRef(null);

  const runAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await explainCode(code, language, conversationId);
      setAnalysis(result);
      lastRequestedFor.current = code;
    } catch (err) {
      console.error(err);
      setError("Could not reach the AI to analyze this code. Check that the backend is running.");
    }
    setLoading(false);
  }, [code, language, conversationId]);

  const isStale = analysis !== null && lastRequestedFor.current !== code;

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "22px 26px", background: "var(--code-bg)" }}>
      {analysis === null && !loading && !error && (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
          <Icon.Bug style={{ width: 28, height: 28, opacity: 0.4, color: "var(--text-faint)" }} />
          <div style={{ color: "var(--text-tertiary)", fontSize: 13, textAlign: "center", maxWidth: 320, lineHeight: 1.6 }}>
            Ask the AI to walk through this {LANGUAGES[language]?.label ?? language} code, flag bugs, and explain what it does.
          </div>
          <button onClick={runAnalysis}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              background: "var(--gradient-accent)", color: "#fff", border: "none",
              borderRadius: 8, padding: "8px 16px", fontSize: 12.5, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
              boxShadow: "0 2px 12px var(--glow-accent)",
            }}
          ><Icon.Bug />Analyze code</button>
        </div>
      )}

      {loading && (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, color: "var(--text-tertiary)", fontSize: 13 }}>
          <span style={{ width: 18, height: 18, borderRadius: "50%", border: "2.5px solid var(--accent-indigo)", borderTopColor: "transparent", display: "inline-block", animation: "friday-spin 0.7s linear infinite" }} />
          Analyzing your code…
        </div>
      )}

      {error && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, height: "100%", textAlign: "center" }}>
          <div style={{ color: "var(--danger-soft)", fontSize: 13 }}>{error}</div>
          <button onClick={runAnalysis}
            style={{
              background: "var(--glass-surface-2)", color: "var(--text-secondary)",
              border: "1px solid var(--glass-border)", borderRadius: 7,
              padding: "6px 14px", fontSize: 12, cursor: "pointer", fontFamily: "inherit",
            }}
          >Try again</button>
        </div>
      )}

      {analysis !== null && !loading && (
        <div>
          {isStale && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "var(--glass-surface-2)", border: "1px solid var(--glass-border)",
              borderRadius: 8, padding: "8px 12px", marginBottom: 16, fontSize: 12,
              color: "var(--text-tertiary)",
            }}>
              <span>The code changed since this analysis ran.</span>
              <button onClick={runAnalysis}
                style={{
                  background: "transparent", color: "var(--accent-soft)", border: "none",
                  fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                }}
              >Re-analyze</button>
            </div>
          )}
          <div style={{ fontSize: 13.5, lineHeight: 1.8, color: "var(--text-secondary)" }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
              p: ({ children }) => <p style={{ margin: "8px 0" }}>{children}</p>,
              h1: ({ children }) => <h1 style={{ fontSize: "1.15em", fontWeight: 700, margin: "14px 0 8px", color: "var(--text-primary)" }}>{children}</h1>,
              h2: ({ children }) => <h2 style={{ fontSize: "1.05em", fontWeight: 700, margin: "14px 0 8px", color: "var(--text-primary)" }}>{children}</h2>,
              h3: ({ children }) => <h3 style={{ fontSize: "1em", fontWeight: 600, margin: "12px 0 6px", color: "var(--text-primary)" }}>{children}</h3>,
              ul: ({ children }) => <ul style={{ paddingLeft: 20, margin: "8px 0" }}>{children}</ul>,
              ol: ({ children }) => <ol style={{ paddingLeft: 20, margin: "8px 0" }}>{children}</ol>,
              li: ({ children }) => <li style={{ margin: "4px 0" }}>{children}</li>,
              code: ({ children }) => <code style={{ background: "var(--glass-surface-2)", color: "var(--accent-soft)", padding: "2px 6px", borderRadius: 5, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9em" }}>{children}</code>,
              strong: ({ children }) => <strong style={{ color: "var(--text-primary)" }}>{children}</strong>,
            }}>
              {analysis}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

function EditorPanel({ language: initialLanguage, originalCode, onClose, codeStyle, conversationId }) {
  const [language,   setLanguage]   = useState(initialLanguage);
  const [editedCode, setEditedCode] = useState(originalCode);
  const [output,     setOutput]     = useState(null);
  const [running,    setRunning]    = useState(false);
  const [isError,    setIsError]    = useState(false);
  const [activeTab,  setActiveTab]  = useState("editor");
  const textareaRef = useRef(null);

  useEffect(() => { if (textareaRef.current) textareaRef.current.focus(); }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = textareaRef.current;
      const start = ta.selectionStart;
      const end   = ta.selectionEnd;
      const next  = editedCode.substring(0, start) + "    " + editedCode.substring(end);
      setEditedCode(next);
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = start + 4; });
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleRun();
    if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); /* handled by DownloadButton via toolbar */ }
  };

  const handleRun = async () => {
    setRunning(true); setOutput(null); setIsError(false); setActiveTab("output");
    try {
      const data = await runCode(editedCode, language);
      if (data.error) { setOutput(data.error); setIsError(true); }
      else             { setOutput(data.output ?? ""); setIsError(false); }
    } catch {
      setOutput("Could not connect to backend."); setIsError(true);
    }
    setRunning(false);
  };

  const handleReset = () => { setEditedCode(originalCode); setOutput(null); setActiveTab("editor"); };
  const isDirty = editedCode !== originalCode;

  const TabButton = ({ id, label, badge }) => {
    const active = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        style={{
          position: "relative", background: "transparent", border: "none",
          color: active ? "var(--text-primary)" : "var(--text-tertiary)",
          padding: "0 4px", height: 46, fontSize: 13, fontWeight: 500,
          cursor: "pointer", fontFamily: "inherit",
          display: "flex", alignItems: "center", gap: 7,
          transition: "color 0.15s ease",
        }}
        onMouseEnter={e => { if (!active) e.currentTarget.style.color = "var(--text-secondary)"; }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.color = "var(--text-tertiary)"; }}
      >
        {label}
        {badge}
        <span style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
          background: "var(--gradient-accent)", borderRadius: 2,
          transform: active ? "scaleX(1)" : "scaleX(0)",
          transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
        }} />
      </button>
    );
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%",
      background: "var(--code-bg)", borderLeft: "1px solid var(--glass-border)",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px", height: 56, flexShrink: 0,
        background: "var(--code-header-bg)", backdropFilter: "blur(var(--glass-blur))",
        borderBottom: "1px solid var(--glass-border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, height: "100%" }}>
          <LanguageSelector language={language} onChange={setLanguage} />
          <div style={{ display: "flex", gap: 20, height: "100%" }}>
            <TabButton id="editor" label="Editor" badge={isDirty && (
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--accent-soft)" }} />
            )} />
            <TabButton id="output" label="Output" badge={
              running ? <span style={{ width: 7, height: 7, borderRadius: "50%", border: "2px solid var(--accent-indigo)", borderTopColor: "transparent", display: "inline-block", animation: "friday-spin 0.7s linear infinite" }} />
              : output !== null ? <span style={{ width: 6, height: 6, borderRadius: "50%", background: isError ? "var(--danger-soft)" : "var(--success-soft)" }} />
              : null
            } />
            <TabButton id="debug" label="Debug" badge={<Icon.Bug style={{ opacity: 0.7 }} />} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <CopyButton code={editedCode} variant="small" />
          <DownloadButton code={editedCode} language={language} />
          <button onClick={handleReset} disabled={!isDirty} title="Reset to original"
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "transparent", color: isDirty ? "var(--text-tertiary)" : "var(--text-faint)",
              border: "1px solid var(--glass-border)", borderRadius: 7,
              padding: "4px 10px", fontSize: 11.5, cursor: isDirty ? "pointer" : "default",
              fontFamily: "inherit", opacity: isDirty ? 1 : 0.5, transition: "all 0.15s ease",
            }}
            onMouseEnter={e => { if (isDirty) e.currentTarget.style.background = "var(--glass-surface-2)"; }}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          ><Icon.Reset />Reset</button>
          <button onClick={handleRun} disabled={running}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: running ? "color-mix(in srgb, var(--success) 25%, var(--code-bg))" : "var(--gradient-accent)",
              color: "#fff", border: "none", borderRadius: 7,
              padding: "6px 14px", fontSize: 12.5, fontWeight: 600,
              cursor: running ? "not-allowed" : "pointer", fontFamily: "inherit",
              boxShadow: running ? "none" : "0 2px 12px var(--glow-accent)",
              transition: "box-shadow 0.2s ease, transform 0.15s ease",
            }}
            onMouseEnter={e => { if (!running) e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            {running ? (<><span style={{ width: 8, height: 8, borderRadius: "50%", border: "2px solid #fff", borderTopColor: "transparent", display: "inline-block", animation: "friday-spin 0.7s linear infinite" }} />Running</>) : (<><Icon.Play />Run</>)}
          </button>
          <div style={{ width: 1, height: 20, background: "var(--glass-border)", margin: "0 2px" }} />
          <button onClick={onClose}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "transparent", color: "var(--text-tertiary)",
              border: "1px solid var(--glass-border)", borderRadius: 7,
              width: 28, height: 28, cursor: "pointer", transition: "all 0.15s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "var(--glass-surface-2)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--text-tertiary)"; e.currentTarget.style.background = "transparent"; }}
          ><Icon.Close /></button>
        </div>
      </div>

      {activeTab === "editor" && (
        <LineNumberedEditor value={editedCode} onChange={(e) => setEditedCode(e.target.value)} textareaRef={textareaRef} onKeyDown={handleKeyDown} language={language} codeStyle={codeStyle} />
      )}
      {activeTab === "output" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "22px 26px", background: "var(--code-bg)" }}>
          {output === null ? (
            <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, color: "var(--text-faint)", fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5 }}>
              <Icon.Play style={{ opacity: 0.4 }} />
              Press Run or <kbd style={{ background: "var(--glass-surface-2)", border: "1px solid var(--glass-border)", borderRadius: 4, padding: "1px 6px", fontSize: 11 }}>Ctrl+Enter</kbd> to execute
            </div>
          ) : (
            <>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 12, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: isError ? "var(--danger-soft)" : "var(--success-soft)" }} />
                {isError ? "stderr" : "stdout"}
              </div>
              <pre style={{ margin: 0, fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 13, lineHeight: 1.75, color: isError ? "var(--danger-soft)" : "var(--success-soft)", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {output || <span style={{ color: "var(--text-muted)" }}>(no output)</span>}
              </pre>
            </>
          )}
        </div>
      )}
      {activeTab === "debug" && (
        <DebugPanel code={editedCode} language={language} conversationId={conversationId} />
      )}
      <div style={{ padding: "8px 20px", background: "var(--code-header-bg)", borderTop: "1px solid var(--glass-border)", flexShrink: 0, fontSize: 11, color: "var(--text-faint)", fontFamily: "'JetBrains Mono', monospace", display: "flex", gap: 14 }}>
        <span><kbd style={{ background: "var(--glass-surface-2)", border: "1px solid var(--glass-border)", borderRadius: 3, padding: "1px 5px" }}>Ctrl+Enter</kbd> run</span>
        <span><kbd style={{ background: "var(--glass-surface-2)", border: "1px solid var(--glass-border)", borderRadius: 3, padding: "1px 5px" }}>Tab</kbd> indent</span>
      </div>
    </div>
  );
}

// ── CodeBlock — Claude-style header, glass surface, opens split editor ──────
// ── CodePreviewCard — compact, click-to-open card replacing inline code ──────
// No code renders in the chat message itself. Clicking anywhere on the card
// (or its "Open" affordance) calls onEdit, which opens the right-side panel —
// matching the "code always lives in the side panel" behavior of Claude/
// ChatGPT/Cursor, rather than expanding inline.
function CodePreviewCard({ language: rawLanguage, code, onEdit }) {
  const language = normalizeLanguage(rawLanguage);
  const cfg = LANGUAGES[language];
  const lineCount = code.split("\n").length;
  const [hovered, setHovered] = useState(false);

  // A muted two-line peek, purely decorative — gives the card some texture
  // without turning it back into a full inline code block.
  const peekLines = code.split("\n").slice(0, 2);

  return (
    <div
      onClick={() => onEdit(code, language)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onEdit(code, language); } }}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        margin: "14px 0", padding: "13px 16px",
        borderRadius: 12, cursor: "pointer",
        background: hovered ? "var(--glass-surface-2)" : "var(--glass-surface)",
        border: `1px solid ${hovered ? "var(--border-default)" : "var(--glass-border)"}`,
        transition: "background 0.15s ease, border-color 0.15s ease, transform 0.15s ease",
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
        maxWidth: 420,
      }}
    >
      <div style={{
        flexShrink: 0, width: 38, height: 38, borderRadius: 9,
        background: "var(--code-bg)", border: "1px solid var(--glass-border)",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17,
      }}>
        {cfg?.icon ?? "📄"}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-primary)" }}>
            {cfg?.label ?? rawLanguage}
          </span>
          <span style={{ fontSize: 11.5, color: "var(--text-faint)", fontFamily: "'JetBrains Mono', monospace" }}>
            {lineCount} line{lineCount === 1 ? "" : "s"}
          </span>
        </div>
        <div style={{
          marginTop: 3, fontSize: 11.5, color: "var(--text-muted)",
          fontFamily: "'JetBrains Mono', monospace",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {peekLines.join(" · ").trim() || "empty file"}
        </div>
      </div>

      <div style={{
        flexShrink: 0, display: "flex", alignItems: "center", gap: 5,
        fontSize: 12, fontWeight: 500,
        color: hovered ? "var(--accent-soft)" : "var(--text-tertiary)",
        transition: "color 0.15s ease",
      }}>
        Open
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: hovered ? "translateX(2px)" : "translateX(0)", transition: "transform 0.15s ease" }}>
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </div>
  );
}

// ── MarkdownRenderer — fully theme-token driven ──────────────────────────────
function MarkdownRenderer({ content, onEdit, fontSize }) {
  return (
    <div style={{ fontSize, lineHeight: 1.8, color: "var(--text-secondary)", textAlign: "left", wordBreak: "break-word" }}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
        code(props) {
          const { children, className, node, ...rest } = props;
          const match = /language-(\w+)/.exec(className || "");
          const codeString = String(children).replace(/\n$/, "");
          if (match) return <CodePreviewCard language={match[1]} code={codeString} onEdit={onEdit} />;
          return <code {...rest} style={{ background: "var(--glass-surface-2)", color: "var(--accent-soft)", padding: "2.5px 7px", borderRadius: 5, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.87em", border: "1px solid var(--glass-border)" }}>{children}</code>;
        },
        h1: ({ children }) => <h1 style={{ fontSize: "1.4em", fontWeight: 700, margin: "20px 0 10px", paddingBottom: 8, borderBottom: "1px solid var(--border-subtle)", color: "var(--text-primary)", textAlign: "left" }}>{children}</h1>,
        h2: ({ children }) => <h2 style={{ fontSize: "1.2em", fontWeight: 700, margin: "16px 0 8px", color: "var(--text-primary)", textAlign: "left" }}>{children}</h2>,
        h3: ({ children }) => <h3 style={{ fontSize: "1.05em", fontWeight: 600, margin: "14px 0 6px", color: "var(--text-primary)", textAlign: "left" }}>{children}</h3>,
        p:  ({ children }) => <p  style={{ margin: "8px 0", lineHeight: 1.85, color: "var(--text-secondary)", textAlign: "left" }}>{children}</p>,
        ul: ({ children }) => <ul style={{ paddingLeft: 24, margin: "10px 0", listStyleType: "disc", textAlign: "left" }}>{children}</ul>,
        ol: ({ children }) => <ol style={{ paddingLeft: 24, margin: "10px 0", textAlign: "left" }}>{children}</ol>,
        li: ({ children }) => <li style={{ margin: "5px 0", lineHeight: 1.75, color: "var(--text-secondary)" }}>{children}</li>,
        blockquote: ({ children }) => <blockquote style={{ borderLeft: "3px solid var(--accent-indigo)", background: "var(--gradient-accent-soft)", borderRadius: "0 10px 10px 0", padding: "11px 18px", margin: "14px 0", color: "var(--text-secondary)", fontStyle: "italic", textAlign: "left" }}>{children}</blockquote>,
        table: ({ children }) => <div style={{ overflowX: "auto", margin: "14px 0", borderRadius: 10, border: "1px solid var(--glass-border)" }}><table style={{ borderCollapse: "collapse", width: "100%", fontSize: 14, textAlign: "left" }}>{children}</table></div>,
        thead: ({ children }) => <thead style={{ background: "var(--glass-surface-2)" }}>{children}</thead>,
        th: ({ children }) => <th style={{ borderBottom: "1px solid var(--glass-border)", padding: "10px 16px", fontWeight: 600, textAlign: "left", color: "var(--text-secondary)", fontSize: 13 }}>{children}</th>,
        td: ({ children }) => <td style={{ borderBottom: "1px solid var(--border-subtle)", padding: "10px 16px", color: "var(--text-tertiary)", fontSize: 13, textAlign: "left" }}>{children}</td>,
        strong: ({ children }) => <strong style={{ fontWeight: 700, color: "var(--text-primary)" }}>{children}</strong>,
        em:     ({ children }) => <em     style={{ fontStyle: "italic", color: "var(--text-secondary)" }}>{children}</em>,
        a: ({ href, children }) => <a href={href} target="_blank" rel="noreferrer" style={{ color: "var(--accent-indigo)", textDecoration: "underline", textUnderlineOffset: 3, fontWeight: 500 }}>{children}</a>,
        hr: () => <hr style={{ border: "none", borderTop: "1px solid var(--border-subtle)", margin: "18px 0" }} />,
      }}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

function fileIcon(type) {
  if (type === "pdf")   return "📄";
  if (type === "image") return "🖼️";
  return "📝";
}

// ── Mic Button ────────────────────────────────────────────────────────────────
const SILENCE_TIMEOUT_MS = 5000;

function MicButton({ onTranscript, onInterim, onStopListening }) {
  const [listening, setListening] = useState(false);
  const recognitionRef  = useRef(null);
  const silenceTimerRef = useRef(null);
  const accumulatedRef  = useRef("");

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; }
  }, []);

  const resetSilenceTimer = useCallback(() => {
    clearSilenceTimer();
    silenceTimerRef.current = setTimeout(() => {
      const text = accumulatedRef.current.trim();
      if (text) { accumulatedRef.current = ""; onStopListening(text); }
    }, SILENCE_TIMEOUT_MS);
  }, [clearSilenceTimer, onStopListening]);

  const stopMic = useCallback(() => {
    clearSilenceTimer();
    if (recognitionRef.current) { recognitionRef.current._shouldRestart = false; recognitionRef.current.stop(); }
    accumulatedRef.current = "";
    setListening(false);
    onStopListening(null);
  }, [clearSilenceTimer, onStopListening]);

  const startMic = useCallback(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Voice input not supported. Please use Chrome or Edge."); return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US"; recognition.continuous = true; recognition.interimResults = true;
    recognition.onresult = (e) => {
      let interim = ""; let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t; else interim += t;
      }
      if (interim) onInterim(interim);
      if (final) {
        accumulatedRef.current = accumulatedRef.current ? `${accumulatedRef.current} ${final}` : final;
        onTranscript(final);
        resetSilenceTimer();
      }
    };
    recognition.onerror = (e) => { if (e.error === "no-speech") return; console.error("Speech error:", e.error); };
    recognition.onend = () => { if (recognitionRef.current?._shouldRestart) { try { recognition.start(); } catch {} } else { setListening(false); } };
    recognition._shouldRestart = true;
    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  }, [onInterim, onTranscript, resetSilenceTimer]);

  useEffect(() => {
    return () => {
      clearSilenceTimer();
      if (recognitionRef.current) { recognitionRef.current._shouldRestart = false; try { recognitionRef.current.stop(); } catch {} }
    };
  }, [clearSilenceTimer]);

  return (
    <button type="button" onClick={listening ? stopMic : startMic}
      title={listening ? "Stop listening" : "Voice input (auto-sends after 5s silence)"}
      style={{
        background: listening ? "color-mix(in srgb, var(--danger) 14%, transparent)" : "transparent",
        border: listening ? "1px solid color-mix(in srgb, var(--danger) 40%, transparent)" : "1px solid transparent",
        borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", flexShrink: 0, transition: "all 0.2s ease", padding: 0,
      }}
      onMouseEnter={e => { if (!listening) e.currentTarget.style.background = "var(--glass-surface-2)"; }}
      onMouseLeave={e => { if (!listening) e.currentTarget.style.background = "transparent"; }}
    >
      {listening ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--danger-soft)">
          <circle cx="12" cy="12" r="6">
            <animate attributeName="r" values="6;9;6" dur="1s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite"/>
          </circle>
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="2" width="6" height="11" rx="3"/>
          <path d="M5 10a7 7 0 0 0 14 0"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
          <line x1="9"  y1="21" x2="15" y2="21"/>
        </svg>
      )}
    </button>
  );
}

// ── Speaker Button ────────────────────────────────────────────────────────────
function SpeakerButton({ latestAiMessage }) {
  const [speaking, setSpeaking] = useState(false);
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const interval = setInterval(() => { if (!window.speechSynthesis.speaking && speaking) setSpeaking(false); }, 300);
    return () => clearInterval(interval);
  }, [speaking]);

  const handleClick = () => {
    if (speaking) { stopSpeaking(); setSpeaking(false); }
    else { if (!latestAiMessage) return; speakText(latestAiMessage); setSpeaking(true); }
  };
  const isDisabled = !latestAiMessage;

  return (
    <button type="button" onClick={handleClick} disabled={isDisabled}
      title={isDisabled ? "No response to speak yet" : speaking ? "Stop speaking" : "Speak latest response"}
      style={{
        background: speaking ? "var(--gradient-accent-soft)" : "transparent",
        border: speaking ? "1px solid color-mix(in srgb, var(--accent-indigo) 40%, transparent)" : "1px solid transparent",
        borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
        cursor: isDisabled ? "not-allowed" : "pointer", flexShrink: 0, transition: "all 0.2s ease", padding: 0,
        opacity: isDisabled ? 0.35 : 1,
      }}
      onMouseEnter={e => { if (!speaking && !isDisabled) e.currentTarget.style.background = "var(--glass-surface-2)"; }}
      onMouseLeave={e => { if (!speaking) e.currentTarget.style.background = "transparent"; }}
    >
      {speaking ? (
        <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
          <rect x="0"  y="4" width="2.5" height="6"  rx="1.25" fill="var(--accent-indigo)"><animate attributeName="height" values="6;10;6"  dur="0.8s" repeatCount="indefinite" begin="0s"/><animate attributeName="y" values="4;2;4" dur="0.8s" repeatCount="indefinite" begin="0s"/></rect>
          <rect x="4"  y="2" width="2.5" height="10" rx="1.25" fill="var(--accent-indigo)"><animate attributeName="height" values="10;4;10" dur="0.8s" repeatCount="indefinite" begin="0.15s"/><animate attributeName="y" values="2;5;2" dur="0.8s" repeatCount="indefinite" begin="0.15s"/></rect>
          <rect x="8"  y="0" width="2.5" height="14" rx="1.25" fill="var(--accent-indigo)"><animate attributeName="height" values="14;6;14" dur="0.8s" repeatCount="indefinite" begin="0.3s"/><animate attributeName="y" values="0;4;0" dur="0.8s" repeatCount="indefinite" begin="0.3s"/></rect>
          <rect x="12" y="3" width="2.5" height="8"  rx="1.25" fill="var(--accent-indigo)"><animate attributeName="height" values="8;12;8"  dur="0.8s" repeatCount="indefinite" begin="0.45s"/><animate attributeName="y" values="3;1;3" dur="0.8s" repeatCount="indefinite" begin="0.45s"/></rect>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isDisabled ? "var(--text-faint)" : "var(--text-tertiary)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
        </svg>
      )}
    </button>
  );
}

// ── Timestamp helper ──────────────────────────────────────────────────────────
function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ── Main SearchApp ────────────────────────────────────────────────────────────
export default function SearchApp({
  conversationId, messages, setMessages,
  onConversationUpdated, onAutoCreateConversation,
}) {
  const { token }  = useAuth();
  const { prefs }  = usePrefs();

  const fontSize    = FONT_SIZES[prefs.fontSize] ?? 15;
  const msgGap      = prefs.compactMode ? 14 : 30;
  const msgPadV     = prefs.compactMode ? "9px" : "12px";
  const codeStyle   = CODE_THEMES[prefs.codeTheme] ?? oneDark;
  const showTime    = prefs.timestamps;
  const transition  = prefs.animations ? "background 0.3s ease" : "none";

  const [prompt,        setPrompt]        = useState("");
  const [interimText,   setInterimText]   = useState("");
  const [loading,       setLoading]       = useState(false);
  const [editPanel,     setEditPanel]     = useState(null);
  const [uploadedFile,  setUploadedFile]  = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [inputFocused,  setInputFocused]  = useState(false);
  // Store timestamp per message index
  const [msgTimes,      setMsgTimes]      = useState([]);

  const latestAiMessage = messages.filter((m) => m.role === "assistant").slice(-1)[0]?.content ?? null;
  const bottomRef    = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: prefs.animations ? "smooth" : "auto" }); }, [messages, loading]);

  const openEdit  = useCallback((code, language = "python") => setEditPanel({ language: normalizeLanguage(language), code }), []);
  const closeEdit = useCallback(() => setEditPanel(null), []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res  = await fetch(`${API}/upload`, { method: "POST", body: formData });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setUploadedFile({ name: file.name, content: data.content, type: data.file_type });
    } catch (err) { console.error("Upload failed:", err); }
    finally { setUploadLoading(false); e.target.value = ""; }
  };

  const handleSubmit = useCallback(async (overridePrompt) => {
    const textToSend = (overridePrompt ?? prompt).trim();
    if (!textToSend && !uploadedFile) return;
    if (loading) return;

    let userPrompt = textToSend;
    if (uploadedFile) {
      userPrompt = userPrompt
        ? `${userPrompt}\n\n📎 **${uploadedFile.name}**:\n\n${uploadedFile.content}`
        : `I've uploaded **"${uploadedFile.name}"**. Please analyze it:\n\n${uploadedFile.content}`;
      setUploadedFile(null);
    }

    const now = new Date();
    setMessages((prev) => [...prev, { role: "user", content: userPrompt }]);
    setMsgTimes((prev) => [...prev, formatTime(now)]);
    setPrompt("");
    setInterimText("");
    setLoading(true);

    try {
      let activeConversationId = conversationId;
      if (!activeConversationId && onAutoCreateConversation) {
        activeConversationId = await onAutoCreateConversation(userPrompt.slice(0, 60));
      }
      if (!activeConversationId) {
        setMessages((prev) => [...prev, { role: "assistant", content: "Please sign in to start chatting." }]);
        setMsgTimes((prev) => [...prev, formatTime(new Date())]);
        setLoading(false);
        return;
      }

      const t = localStorage.getItem("access_token");
      const headers = { "Content-Type": "application/json" };
      if (t) headers["Authorization"] = `Bearer ${t}`;

      // ← response style is sent to backend
      const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({
          conversation_id: activeConversationId,
          message: userPrompt,
          response_style: prefs.responseStyle,
        }),
      });

      const data    = await res.json();
      const aiReply = data.response;
      setMessages((prev) => [...prev, { role: "assistant", content: aiReply }]);
      setMsgTimes((prev) => [...prev, formatTime(new Date())]);
      speakText(aiReply);
      if (onConversationUpdated) onConversationUpdated();
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Failed to connect to backend." }]);
      setMsgTimes((prev) => [...prev, formatTime(new Date())]);
    }
    setLoading(false);
  }, [prompt, uploadedFile, loading, conversationId, onAutoCreateConversation, onConversationUpdated, setMessages, prefs.responseStyle]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  const handleTranscript = useCallback((text) => {
    setInterimText("");
    setPrompt((prev) => prev ? `${prev} ${text}` : text);
  }, []);

  const handleMicStop = useCallback((text) => {
    setInterimText("");
    if (text) { setPrompt(""); handleSubmit(text); }
  }, [handleSubmit]);

  const hasContent = prompt.trim() || uploadedFile;

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "row", background: "var(--chat-bg)", overflow: "hidden", transition }}>

      <div style={{ display: "flex", flexDirection: "column", flex: editPanel ? "0 0 42%" : "1 1 100%", transition: prefs.animations ? "flex 0.35s cubic-bezier(0.4,0,0.2,1)" : "none", minWidth: 0, overflow: "hidden", borderRight: editPanel ? "1px solid var(--glass-border)" : "none" }}>

        {/* Empty state */}
        {messages.length === 0 && !loading && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <div style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
              width: 640, height: 460,
              background: "radial-gradient(ellipse 60% 55% at 50% 50%, var(--glow-accent) 0%, color-mix(in srgb, var(--accent-indigo) 12%, transparent) 35%, transparent 75%)",
              filter: "blur(40px)", pointerEvents: "none",
            }} />
            {/* Career Roadmap progress summary — shown once per session */}
            <div style={{ zIndex: 1, width: "100%", maxWidth: 520, padding: "0 16px", marginBottom: 20 }}>
              <LoginProgressSummary
                onNavigateToRoadmap={(weekNum) => {
                  const url = weekNum != null
                    ? `/practice-roadmap?week=${weekNum}`
                    : "/practice-roadmap";
                  window.location.href = url;
                }}
              />
            </div>
            <div style={{ zIndex: 1, textAlign: "center" }}>
              <h1 style={{ fontSize: 34, fontWeight: 600, color: "var(--text-primary)", margin: 0, letterSpacing: "-0.5px" }}>
                Meet Your Personal AI Assistant
              </h1>
              <p style={{ fontSize: 14.5, color: "var(--text-tertiary)", marginTop: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.3px" }}>
                Ask anything · Run code · Get instant feedback
              </p>
            </div>
          </div>
        )}

        {/* Message list */}
        {(messages.length > 0 || loading) && (
          <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "32px 0", scrollbarWidth: "thin" }}>
            <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px" }}>
              {messages.map((msg, index) => (
                <div key={index} style={{ marginBottom: msgGap }}>
                  {msg.role === "user" ? (
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <div>
                        <div style={{
                          background: "var(--gradient-accent)", color: "#fff",
                          padding: `${msgPadV} 20px`, borderRadius: "20px 20px 4px 20px",
                          maxWidth: "75%", fontSize, lineHeight: 1.6, textAlign: "left",
                          boxShadow: "0 4px 16px var(--glow-accent)", transition,
                        }}>
                          {msg.content}
                        </div>
                        {showTime && msgTimes[index] && (
                          <div style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "right", marginTop: 4 }}>{msgTimes[index]}</div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", justifyContent: "flex-start" }}>
                      <div style={{ width: "100%", textAlign: "left" }}>
                        <MarkdownRenderer
                          content={msg.content}
                          onEdit={(code, language) => openEdit(code, language)}
                          fontSize={fontSize}
                        />
                        {showTime && msgTimes[index] && (
                          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{msgTimes[index]}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div style={{ display: "flex", gap: 6, padding: "4px 0", alignItems: "center" }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent-indigo)", animation: "friday-dot-bounce 1.2s infinite", animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>
        )}

        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf,.txt,.py,.js,.ts,.cpp,.h,.hpp,.java,.csv,.md" style={{ display: "none" }} />

        {/* Input bar */}
        <div style={{ padding: "14px 24px 22px", background: "var(--chat-bg)", borderTop: messages.length > 0 ? "1px solid var(--border-subtle)" : "none", transition }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>

            {uploadedFile && (
              <div style={{ display: "flex", alignItems: "center", gap: 9, background: "var(--glass-surface-2)", backdropFilter: "blur(12px)", borderRadius: 12, padding: "9px 15px", marginBottom: 9, border: "1px solid var(--glass-border)" }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{fileIcon(uploadedFile.type)}</span>
                <span style={{ flex: 1, fontSize: 13, color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{uploadedFile.name}</span>
                <button onClick={() => setUploadedFile(null)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-tertiary)", padding: 0, lineHeight: 1, flexShrink: 0, display: "flex" }}><Icon.Close /></button>
              </div>
            )}

            {uploadLoading && !uploadedFile && (
              <div style={{ display: "flex", alignItems: "center", gap: 9, background: "var(--glass-surface-2)", borderRadius: 12, padding: "9px 15px", marginBottom: 9, border: "1px solid var(--glass-border)" }}>
                <span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid var(--accent-indigo)", borderTopColor: "transparent", display: "inline-block", animation: "friday-spin 0.7s linear infinite" }} />
                <span style={{ fontSize: 13, color: "var(--text-tertiary)" }}>Reading file…</span>
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              {/* Signature move: animated gradient border ring, active only on focus */}
              <div style={{
                position: "relative", borderRadius: 26, padding: 1,
                background: inputFocused ? "conic-gradient(from var(--angle, 0deg), var(--accent-indigo), #8b5cf6, var(--accent-indigo))" : "transparent",
                animation: inputFocused && prefs.animations ? "friday-border-spin 3s linear infinite" : "none",
                transition: "background 0.25s ease",
              }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "12px 20px",
                  background: "var(--glass-surface-2)", backdropFilter: "blur(var(--glass-blur))",
                  borderRadius: 25,
                  border: inputFocused ? "1px solid transparent" : "1px solid var(--glass-border)",
                  boxShadow: inputFocused ? "0 4px 24px rgba(0,0,0,0.12)" : "0 1px 6px rgba(0,0,0,0.06)",
                  transition: "box-shadow 0.25s ease",
                }}>

                  <button type="button" onClick={() => fileInputRef.current?.click()} title="Upload file"
                    style={{
                      background: "transparent", border: "none", cursor: "pointer",
                      color: uploadedFile ? "var(--accent-indigo)" : "var(--text-tertiary)",
                      padding: 0, flexShrink: 0, display: "flex", transition: "color 0.15s ease",
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = "var(--accent-indigo)"}
                    onMouseLeave={e => e.currentTarget.style.color = uploadedFile ? "var(--accent-indigo)" : "var(--text-tertiary)"}
                  ><Icon.Attach /></button>

                  <div style={{ flex: 1, position: "relative", minWidth: 0 }}>
                    <input
                      type="text"
                      placeholder={uploadedFile ? "Ask something about the file…" : "Ask Chat..."}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onFocus={() => setInputFocused(true)}
                      onBlur={() => setInputFocused(false)}
                      style={{ width: "100%", background: "transparent", border: "none", outline: "none", fontSize, color: "var(--text-secondary)", fontFamily: "inherit", boxSizing: "border-box" }}
                    />
                    {interimText && (
                      <span style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: `${Math.min(prompt.length * 8.8, 200)}px`, fontSize, color: "var(--text-tertiary)", fontFamily: "inherit", pointerEvents: "none", whiteSpace: "nowrap" }}>
                        {interimText}
                      </span>
                    )}
                  </div>

                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent-soft)", flexShrink: 0, boxShadow: "0 0 8px var(--glow-accent)" }} />
                  <span style={{ color: "var(--text-tertiary)", fontSize: 13, flexShrink: 0, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.3px" }}>Dataman 2.0</span>

                  <SpeakerButton latestAiMessage={latestAiMessage} />
                  <MicButton onTranscript={handleTranscript} onInterim={(text) => setInterimText(text)} onStopListening={handleMicStop} />

                  <button type="submit"
                    disabled={loading || uploadLoading || !hasContent}
                    style={{
                      background: hasContent ? "var(--gradient-accent)" : "transparent",
                      border: "none", borderRadius: "50%", width: 30, height: 30,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: loading || uploadLoading || !hasContent ? "not-allowed" : "pointer",
                      color: hasContent ? "#fff" : "var(--text-faint)",
                      padding: 0, flexShrink: 0,
                      boxShadow: hasContent ? "0 2px 10px var(--glow-accent)" : "none",
                      transition: "all 0.2s ease",
                    }}
                  ><Icon.Send /></button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {editPanel && (
        <div style={{ flex: "0 0 58%", minWidth: 0, overflow: "hidden", animation: prefs.animations ? "friday-slide-in-right 0.3s cubic-bezier(0.4,0,0.2,1)" : "none" }}>
          <EditorPanel
            language={editPanel.language}
            originalCode={editPanel.code}
            onClose={closeEdit}
            codeStyle={codeStyle}
            conversationId={conversationId}
          />
        </div>
      )}

      <style>{`
        @property --angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes friday-border-spin {
          to { --angle: 360deg; }
        }
        @keyframes friday-dot-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
          40%            { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes friday-spin { to { transform: rotate(360deg); } }
        @keyframes friday-slide-in-right {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        ::-webkit-scrollbar       { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--text-faint); }
      `}</style>
    </div>
  );
}