/**
 * InterviewerBubble.jsx
 * Left-panel component: animated orb, question text, TTS control,
 * progress header, and status line.
 *
 * Props:
 *   question        {string}   — question text to display
 *   questionIndex   {number}   — 0-based current index
 *   totalQuestions  {number}
 *   state           {string}   — interview state machine value
 *   speaking        {boolean}  — TTS currently active
 *   onReplay        {fn}       — re-fire TTS
 *   ttsSupported    {boolean}
 */
import React, { useEffect, useState, useRef } from "react";
import { Volume2, VolumeX, Mic, Loader2, CheckCircle } from "lucide-react";

// ── Typewriter hook ─────────────────────────────────────────────────────────
function useTypewriter(text, active) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!active || !text) {
      setDisplayed(text || "");
      return;
    }
    indexRef.current = 0;
    setDisplayed("");

    const tick = () => {
      indexRef.current++;
      setDisplayed(text.slice(0, indexRef.current));
      if (indexRef.current < text.length) {
        // Vary speed slightly for a natural feel
        const delay = text[indexRef.current - 1] === "." ? 100 :
                      text[indexRef.current - 1] === "," ? 60 : 22;
        timerRef.current = setTimeout(tick, delay);
      }
    };

    timerRef.current = setTimeout(tick, 200); // initial delay before starting
    return () => clearTimeout(timerRef.current);
  }, [text, active]);

  return displayed;
}

// ── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  idle:             { label: "Setting up…",          color: "text-slate-500" },
  question_playing: { label: "AI is speaking…",      color: "text-indigo-400" },
  awaiting_answer:  { label: "Ready for your answer", color: "text-emerald-400" },
  listening:        { label: "Listening…",            color: "text-rose-400" },
  confirm_answer:   { label: "Review your answer",   color: "text-amber-400" },
  submitted:        { label: "Analysing answer…",    color: "text-indigo-400" },
  feedback:         { label: "Feedback ready",        color: "text-emerald-400" },
};

export default function InterviewerBubble({
  question,
  questionIndex,
  totalQuestions,
  state,
  speaking,
  onReplay,
  ttsSupported,
}) {
  const typewriterActive = state === "question_playing" || state === "awaiting_answer";
  const displayedText = useTypewriter(question, typewriterActive);

  const status = STATUS_CONFIG[state] ?? STATUS_CONFIG.idle;
  const progress = totalQuestions > 0 ? ((questionIndex + 1) / totalQuestions) * 100 : 0;

  return (
    <div className="flex flex-col items-center gap-6 py-8 px-4 h-full">

      {/* ── Progress header ─────────────────────────────────────────────── */}
      <div className="w-full max-w-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Question {questionIndex + 1} of {totalQuestions}
          </span>
          <span className="text-xs text-slate-600">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-1 w-full rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #8b5cf6, #6366f1)",
              boxShadow: "0 0 8px rgba(139,92,246,0.5)",
            }}
          />
        </div>
      </div>

      {/* ── Animated orb ────────────────────────────────────────────────── */}
      <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
        {/* Speaking rings — rendered behind the orb */}
        {speaking && (
          <>
            {[1, 2, 3].map((i) => (
              <span
                key={i}
                className="absolute inset-0 rounded-full"
                style={{
                  background: "transparent",
                  border: "2px solid rgba(139,92,246,0.6)",
                  animation: `ring-pulse 1.8s ease-out ${(i - 1) * 0.5}s infinite`,
                  borderRadius: "9999px",
                }}
              />
            ))}
          </>
        )}

        {/* The orb itself */}
        <div
          className="relative rounded-full flex items-center justify-center"
          style={{
            width: 96,
            height: 96,
            background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #6366f1 100%)",
            boxShadow: speaking
              ? "0 0 40px rgba(139,92,246,0.8), 0 0 80px rgba(99,102,241,0.4)"
              : "0 0 24px rgba(139,92,246,0.4), 0 0 48px rgba(99,102,241,0.15)",
            animation: speaking ? "none" : "orb-float 3.5s ease-in-out infinite",
          }}
        >
          {/* Inner glow */}
          <div
            className="absolute inset-3 rounded-full opacity-40"
            style={{
              background: "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.4), transparent 70%)",
            }}
          />
          {/* Icon */}
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="relative z-10">
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="rgba(255,255,255,0.9)" />
            <path d="M2 17l10 5 10-5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M2 12l10 5 10-5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* ── AI label + replay button ─────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-400">AI Interviewer</span>
        {ttsSupported ? (
          <button
            onClick={onReplay}
            disabled={state === "question_playing" || !question}
            title="Replay question"
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs text-slate-500 hover:text-indigo-400 hover:bg-white/[0.05] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Volume2 size={13} />
            Replay
          </button>
        ) : (
          <span className="text-xs text-slate-600 italic">(audio unavailable)</span>
        )}
      </div>

      {/* ── Question text ────────────────────────────────────────────────── */}
      {question ? (
        <div className="w-full max-w-xs">
          <div
            className="rounded-2xl border border-white/[0.08] p-5 text-sm leading-relaxed text-slate-100"
            style={{
              background: "rgba(139,92,246,0.06)",
              backdropFilter: "blur(12px)",
            }}
          >
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-indigo-400/60">
              Question
            </p>
            <p>{displayedText}</p>
            {/* Blinking cursor while typing */}
            {typewriterActive && displayedText.length < question.length && (
              <span
                className="inline-block w-0.5 h-4 bg-indigo-400 ml-0.5 align-middle"
                style={{ animation: "blink 0.8s step-end infinite" }}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-xs">
          <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-5 text-sm text-slate-600 text-center italic">
            Question will appear here…
          </div>
        </div>
      )}

      {/* ── Status line ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        {state === "listening" && (
          <span className="flex gap-0.5 items-end h-4">
            {[0, 0.15, 0.3].map((delay) => (
              <span
                key={delay}
                className="w-1 rounded-full bg-rose-400"
                style={{
                  height: "100%",
                  animation: `mic-bar 0.8s ease-in-out ${delay}s infinite alternate`,
                }}
              />
            ))}
          </span>
        )}
        {(state === "submitted") && (
          <Loader2 size={13} className="animate-spin text-indigo-400" />
        )}
        {state === "feedback" && (
          <CheckCircle size={13} className="text-emerald-400" />
        )}
        {state === "awaiting_answer" && (
          <Mic size={13} className="text-emerald-400" />
        )}
        <span className={`text-xs font-medium ${status.color}`}>
          {status.label}
        </span>
      </div>

      {/* ── Keyframe definitions ─────────────────────────────────────────── */}
      <style>{`
        @keyframes orb-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-5px); }
        }
        @keyframes ring-pulse {
          0%   { transform: scale(1);   opacity: 0.8; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes mic-bar {
          from { transform: scaleY(0.3); }
          to   { transform: scaleY(1);   }
        }
      `}</style>
    </div>
  );
}
