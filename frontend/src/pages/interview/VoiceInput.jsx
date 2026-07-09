/**
 * VoiceInput.jsx
 * STT component: mic button, live captions, confirm/redo flow,
 * and all STT error/unsupported states.
 *
 * Props:
 *   state              {string}  — interview state machine value
 *   sttSupported       {boolean}
 *   listening          {boolean}
 *   transcript         {string}  — final accumulated transcript
 *   interimTranscript  {string}  — in-flight words (live captions)
 *   error              {string|null}
 *   permissionDenied   {boolean}
 *   noSpeechTimeout    {boolean}
 *   onMicStart         {fn}
 *   onMicStop          {fn}      — manual stop
 *   onSubmit           {fn}
 *   onRedo             {fn}      — clear and re-record
 *   onRetry            {fn}      — after no-speech timeout
 */
import React from "react";
import {
  Mic, Square, Send, RotateCcw, AlertCircle, MicOff,
  AlertTriangle
} from "lucide-react";

// ─── Gradient mic button ────────────────────────────────────────────────────
function MicButton({ listening, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="relative flex items-center justify-center rounded-full transition-all duration-200 focus-ring"
      style={{
        width: 72,
        height: 72,
        background: listening
          ? "linear-gradient(135deg, #ec4899, #8b5cf6)"
          : "linear-gradient(135deg, #f43f5e, #8b5cf6)",
        boxShadow: listening
          ? "0 0 32px rgba(236,72,153,0.6), 0 0 64px rgba(139,92,246,0.3)"
          : "0 0 20px rgba(244,63,94,0.4)",
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {/* Pulse ring when listening */}
      {listening && (
        <>
          <span
            className="absolute inset-0 rounded-full"
            style={{
              border: "2px solid rgba(236,72,153,0.5)",
              animation: "mic-ring 1.2s ease-out infinite",
            }}
          />
          <span
            className="absolute inset-0 rounded-full"
            style={{
              border: "2px solid rgba(139,92,246,0.4)",
              animation: "mic-ring 1.2s ease-out 0.4s infinite",
            }}
          />
        </>
      )}
      {listening ? (
        <Square size={26} className="text-white" fill="white" />
      ) : (
        <Mic size={26} className="text-white" />
      )}
    </button>
  );
}

// ─── Live caption display ───────────────────────────────────────────────────
function LiveCaptions({ transcript, interimTranscript, listening }) {
  const hasContent = transcript || interimTranscript;

  if (!hasContent && !listening) return null;

  return (
    <div
      className="w-full rounded-2xl border p-4 text-sm leading-relaxed min-h-[80px]"
      style={{
        borderColor: listening ? "rgba(236,72,153,0.3)" : "rgba(255,255,255,0.08)",
        background: listening
          ? "rgba(236,72,153,0.05)"
          : "rgba(255,255,255,0.03)",
        transition: "all 0.3s",
      }}
    >
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-rose-400/60">
        Live Transcript
      </p>
      <p className="text-slate-200">
        {transcript}
        {interimTranscript && (
          <span className="text-slate-500 italic"> {interimTranscript}</span>
        )}
        {listening && !transcript && !interimTranscript && (
          <span className="text-slate-600 italic">Listening — speak now…</span>
        )}
      </p>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────
export default function VoiceInput({
  state,
  sttSupported,
  listening,
  transcript,
  interimTranscript,
  error,
  permissionDenied,
  noSpeechTimeout,
  onMicStart,
  onMicStop,
  onSubmit,
  onRedo,
  onRetry,
}) {
  // ── Permission denied state ──────────────────────────────────────────────
  if (permissionDenied) {
    return (
      <div className="flex flex-col gap-3">
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-300 flex gap-3">
          <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-1">Microphone access blocked</p>
            <p className="text-amber-300/80 text-xs leading-relaxed">
              Check your browser's site settings (address bar → lock icon → permissions)
              and allow microphone access, then reload the page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Browser not supported ────────────────────────────────────────────────
  if (!sttSupported) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 text-sm text-slate-400 flex gap-3">
        <MicOff size={18} className="flex-shrink-0 mt-0.5 text-slate-600" />
        <div>
          <p className="font-semibold text-slate-300 mb-1">Voice input not available</p>
          <p className="text-xs leading-relaxed">
            Speech recognition isn't supported in this browser. Best supported in{" "}
            <span className="text-indigo-400">Chrome</span> or{" "}
            <span className="text-indigo-400">Edge</span>. Safari and Firefox support
            is unreliable or unavailable.
          </p>
        </div>
      </div>
    );
  }

  // ── Confirm answer state ─────────────────────────────────────────────────
  if (state === "confirm_answer") {
    return (
      <div className="flex flex-col gap-4">
        {/* Captured transcript */}
        {transcript ? (
          <div
            className="rounded-2xl border border-white/[0.08] p-4 text-sm text-slate-200 leading-relaxed"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-emerald-400/60">
              Your Answer
            </p>
            <p>{transcript}</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-300/80 text-center">
            No speech captured — try recording again.
          </div>
        )}

        {/* Submit / Redo */}
        <div className="flex gap-3">
          <button
            onClick={onRedo}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-slate-300 border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] transition-all"
          >
            <RotateCcw size={15} />
            Redo
          </button>
          <button
            onClick={onSubmit}
            disabled={!transcript}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #f43f5e, #8b5cf6)",
              boxShadow: "0 0 20px rgba(244,63,94,0.3)",
            }}
          >
            <Send size={15} />
            Submit Answer
          </button>
        </div>
      </div>
    );
  }

  // ── No-speech timeout ────────────────────────────────────────────────────
  if (noSpeechTimeout) {
    return (
      <div className="flex flex-col gap-3">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 text-sm text-slate-400 text-center">
          <AlertCircle size={20} className="mx-auto mb-2 text-amber-400" />
          <p className="text-slate-300 font-medium mb-1">Didn't catch that</p>
          <p className="text-xs text-slate-500">No speech was detected within 10 seconds.</p>
        </div>
        <button
          onClick={onRetry}
          className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all"
          style={{ background: "linear-gradient(135deg, #f43f5e, #8b5cf6)" }}
        >
          <Mic size={15} />
          Try Again
        </button>
      </div>
    );
  }

  // ── General STT error ────────────────────────────────────────────────────
  if (error && state === "awaiting_answer") {
    return (
      <div className="flex flex-col gap-3">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300 flex gap-3">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
        <button
          onClick={onMicStart}
          className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all"
          style={{ background: "linear-gradient(135deg, #f43f5e, #8b5cf6)" }}
        >
          <Mic size={15} />
          Try Again
        </button>
      </div>
    );
  }

  // ── Awaiting / Listening state ───────────────────────────────────────────
  const isAwaitingOrListening = state === "awaiting_answer" || state === "listening";

  if (!isAwaitingOrListening) return null;

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Mic hint label */}
      <p className="text-xs text-slate-500 text-center">
        {listening
          ? "Tap the button to stop — or wait for silence to auto-submit"
          : "Tap the microphone to begin recording your answer"}
      </p>

      {/* Mic button */}
      <MicButton
        listening={listening}
        onClick={listening ? onMicStop : onMicStart}
        disabled={false}
      />

      {/* Label */}
      <p className="text-xs font-semibold text-slate-500">
        {listening ? "Recording…" : "Ready"}
      </p>

      {/* Live captions */}
      {(listening || transcript) && (
        <div className="w-full">
          <LiveCaptions
            transcript={transcript}
            interimTranscript={interimTranscript}
            listening={listening}
          />
        </div>
      )}

      {/* Keyframes */}
      <style>{`
        @keyframes mic-ring {
          0%   { transform: scale(1);   opacity: 0.8; }
          100% { transform: scale(1.7); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
