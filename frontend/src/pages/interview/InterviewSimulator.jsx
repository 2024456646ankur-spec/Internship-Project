/**
 * InterviewSimulator.jsx
 * Main container + useReducer state machine.
 *
 * STATE MACHINE TRANSITIONS (see reducer below):
 *
 *   idle
 *     → [START_SESSION]      → question_playing  (TTS fires)
 *
 *   question_playing
 *     → [TTS_END]            → awaiting_answer
 *     → [REPLAY_TTS]         → question_playing  (re-fires TTS)
 *
 *   awaiting_answer
 *     → [MIC_START]          → listening
 *     → [REPLAY_TTS]         → question_playing  (re-fires TTS)
 *
 *   listening
 *     → [SPEECH_RESULT]      → listening         (update transcript only)
 *     → [SILENCE_DETECTED]   → confirm_answer    (auto-stop after 2.5s)
 *     → [MIC_STOP_MANUAL]    → confirm_answer    (user tapped stop)
 *
 *   confirm_answer
 *     → [SUBMIT_ANSWER]      → submitted
 *     → [REDO_ANSWER]        → awaiting_answer   (clear transcript)
 *
 *   submitted
 *     → [FEEDBACK_READY]     → feedback
 *
 *   feedback
 *     → [NEXT_QUESTION]      → question_playing  (advance index, TTS fires)
 *     → [RESTART]            → idle              (reset to setup)
 *
 *   (any state) → [RESTART]  → idle
 *
 * ASSUMPTIONS ABOUT EXISTING APP STRUCTURE (flagged for the integrator):
 *   - AppShell is at ../components/layout/AppShell and renders the mesh-bg
 *   - useNavigate is from react-router-dom (same as InterviewPage.jsx)
 *   - No global state store is needed; all interview state is local to this component
 *   - The question bank (interviewQuestions.js) is self-contained; backend not required
 *   - Monaco and the Workers are new additions; see package.json and /public/*.js
 */
import React, { useReducer, useEffect, useRef, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, ArrowLeft, Zap, Sparkles, RotateCcw, ChevronRight,
  Loader2, CheckCircle2, AlertCircle, Info
} from "lucide-react";

import AppShell from "../../components/layout/AppShell";
import InterviewerBubble from "./InterviewerBubble";
import VoiceInput from "./VoiceInput";
import CodeEditorPanel from "./CodeEditorPanel";
import { useSpeechSynthesis } from "../../hooks/useSpeechSynthesis";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition";
import { getInterviewQuestions, INTERVIEW_TOPICS } from "../../data/interviewQuestions";

// ─────────────────────────────────────────────────────────────────────────────
// STATE MACHINE — useReducer
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_STATE = {
  phase: "idle",          // see transitions above
  questions: [],
  currentIndex: 0,
  transcript: "",
  feedback: null,
};

function reducer(state, action) {
  switch (action.type) {

    // Setup → first question
    case "START_SESSION":
      return {
        ...state,
        phase: "question_playing",
        questions: action.questions,
        currentIndex: 0,
        transcript: "",
        feedback: null,
      };

    // TTS finished reading the question
    case "TTS_END":
      if (state.phase !== "question_playing") return state;
      return { ...state, phase: "awaiting_answer" };

    // Replay TTS (no state change — side effect handled in component)
    case "REPLAY_TTS":
      return { ...state, phase: "question_playing" };

    // Mic started
    case "MIC_START":
      return { ...state, phase: "listening", transcript: "" };

    // Live transcript update (while listening)
    case "SPEECH_RESULT":
      return { ...state, transcript: action.transcript };

    // Silence auto-stop or manual stop → confirm
    case "SILENCE_DETECTED":
    case "MIC_STOP_MANUAL":
      return { ...state, phase: "confirm_answer" };

    // User chooses to redo
    case "REDO_ANSWER":
      return { ...state, phase: "awaiting_answer", transcript: "" };

    // User submits answer → analysing
    case "SUBMIT_ANSWER":
      return { ...state, phase: "submitted" };

    // Simulated analysis done → feedback
    case "FEEDBACK_READY":
      return { ...state, phase: "feedback", feedback: action.feedback };

    // Advance to next question
    case "NEXT_QUESTION": {
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.questions.length) {
        return { ...state, phase: "completed" };
      }
      return {
        ...state,
        phase: "question_playing",
        currentIndex: nextIndex,
        transcript: "",
        feedback: null,
      };
    }

    // Reset to setup screen
    case "RESTART":
      return { ...INITIAL_STATE };

    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SETUP SCREEN — topic/difficulty/count picker
// ─────────────────────────────────────────────────────────────────────────────
function SetupScreen({ onStart }) {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [difficulty, setDifficulty] = useState("all");
  const [questionCount, setQuestionCount] = useState(5);

  const toggleTopic = (id) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleStart = () => {
    const questions = getInterviewQuestions({
      topics: selectedTopics,
      difficulty,
      limit: questionCount,
    });
    onStart(questions);
  };

  return (
    <motion.div
      key="setup"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className="mx-auto max-w-2xl px-4 py-10"
    >
      {/* Hero */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 mb-4">
          <Sparkles size={12} />
          Immersive AI Interview Simulator
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
          Interview{" "}
          <span
            className="text-gradient"
            style={{ "--grad-from": "#8b5cf6", "--grad-to": "#6366f1" }}
          >
            Simulator
          </span>
        </h1>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Real-time voice interview with AI feedback. Coding questions include a live code editor.
          Best in Chrome or Edge.
        </p>
      </div>

      <div
        className="rounded-2xl border border-white/[0.08] p-6"
        style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(12px)" }}
      >
        {/* Topic selection */}
        <div className="mb-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Topics <span className="text-slate-600 font-normal">(leave blank for all)</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {INTERVIEW_TOPICS.map((t) => (
              <button
                key={t.id}
                onClick={() => toggleTopic(t.id)}
                className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200"
                style={
                  selectedTopics.includes(t.id)
                    ? {
                        background: "rgba(139,92,246,0.2)",
                        borderColor: "rgba(139,92,246,0.5)",
                        color: "#c4b5fd",
                        boxShadow: "0 0 12px rgba(139,92,246,0.2)",
                      }
                    : {
                        background: "rgba(255,255,255,0.03)",
                        borderColor: "rgba(255,255,255,0.08)",
                        color: "#64748b",
                      }
                }
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="mb-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Difficulty
          </p>
          <div className="flex gap-2">
            {["all", "easy", "medium", "hard"].map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className="px-4 py-2 rounded-full text-xs font-medium border transition-all duration-200 capitalize"
                style={
                  difficulty === d
                    ? {
                        background: "rgba(139,92,246,0.2)",
                        borderColor: "rgba(139,92,246,0.5)",
                        color: "#c4b5fd",
                      }
                    : {
                        background: "rgba(255,255,255,0.03)",
                        borderColor: "rgba(255,255,255,0.08)",
                        color: "#64748b",
                      }
                }
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Question count */}
        <div className="mb-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Number of Questions
          </p>
          <div className="flex gap-2">
            {[3, 5, 7, 10].map((n) => (
              <button
                key={n}
                onClick={() => setQuestionCount(n)}
                className="px-4 py-2 rounded-full text-xs font-medium border transition-all duration-200"
                style={
                  questionCount === n
                    ? {
                        background: "rgba(139,92,246,0.2)",
                        borderColor: "rgba(139,92,246,0.5)",
                        color: "#c4b5fd",
                      }
                    : {
                        background: "rgba(255,255,255,0.03)",
                        borderColor: "rgba(255,255,255,0.08)",
                        color: "#64748b",
                      }
                }
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Browser support note */}
        <div className="flex items-start gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-4 py-3 mb-4 text-xs text-indigo-300/80">
          <Info size={13} className="flex-shrink-0 mt-0.5" />
          <span>
            Voice recognition is most reliable in <strong>Chrome</strong> or <strong>Edge</strong>.
            Safari has partial support; Firefox may not support it at all.
          </span>
        </div>

        <button
          onClick={handleStart}
          className="w-full flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-white transition-all"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
            boxShadow: "0 0 24px rgba(124,58,237,0.4)",
          }}
        >
          <Zap size={16} />
          Start Interview
        </button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FEEDBACK CARD
// ─────────────────────────────────────────────────────────────────────────────
function FeedbackCard({ feedback, question, transcript, onNext, onRestart, isLast }) {
  if (!feedback || !question) return null;

  const { strengths = [], improvements = [] } = question.feedbackHints ?? {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 overflow-y-auto"
    >
      {/* Score banner */}
      <div
        className="rounded-2xl border border-emerald-500/30 p-4 text-center"
        style={{ background: "rgba(16,185,129,0.07)" }}
      >
        <p className="text-2xl font-bold text-white mb-1">
          {feedback.score}<span className="text-sm text-slate-500">/10</span>
        </p>
        <p className="text-xs text-emerald-400">{feedback.label}</p>
      </div>

      {/* Your answer recap */}
      {transcript && (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-600">Your Answer</p>
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-4">{transcript}</p>
        </div>
      )}

      {/* Strengths */}
      {strengths.length > 0 && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <p className="mb-2 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 size={13} /> Strengths
          </p>
          <ul className="space-y-1">
            {strengths.map((s, i) => (
              <li key={i} className="text-xs text-slate-300 flex gap-2">
                <span className="text-emerald-500 flex-shrink-0">✓</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Areas to improve */}
      {improvements.length > 0 && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="mb-2 text-xs font-semibold text-amber-400 flex items-center gap-1.5">
            <AlertCircle size={13} /> Areas to Improve
          </p>
          <ul className="space-y-1">
            {improvements.map((s, i) => (
              <li key={i} className="text-xs text-slate-300 flex gap-2">
                <span className="text-amber-500 flex-shrink-0">→</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Model answer */}
      <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4">
        <p className="mb-2 text-xs font-semibold text-indigo-400">💡 Model Answer</p>
        <p className="text-xs text-slate-300 leading-relaxed">{question.idealAnswer}</p>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={onRestart}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold text-slate-300 border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] transition-all"
        >
          <RotateCcw size={13} />
          New Interview
        </button>
        {!isLast ? (
          <button
            onClick={onNext}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold text-white transition-all"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
              boxShadow: "0 0 16px rgba(124,58,237,0.35)",
            }}
          >
            Next Question
            <ChevronRight size={13} />
          </button>
        ) : (
          <button
            onClick={onRestart}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold text-white transition-all"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
              boxShadow: "0 0 16px rgba(124,58,237,0.35)",
            }}
          >
            <Sparkles size={13} />
            Session Complete!
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPLETED SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function CompletedScreen({ onRestart }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center gap-5 py-16 text-center"
    >
      <div className="text-6xl">🏆</div>
      <h2 className="text-2xl font-extrabold text-white">Interview Complete!</h2>
      <p className="text-slate-400 text-sm max-w-xs">
        Great work making it through all the questions. Keep practising to sharpen your skills.
      </p>
      <button
        onClick={onRestart}
        className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all"
        style={{
          background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
          boxShadow: "0 0 24px rgba(124,58,237,0.4)",
        }}
      >
        <RotateCcw size={15} />
        Start New Interview
      </button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DRAGGABLE DIVIDER
// ─────────────────────────────────────────────────────────────────────────────
function DraggableDivider({ onDrag }) {
  const dragging = useRef(false);

  const onMouseDown = (e) => {
    dragging.current = true;
    e.preventDefault();
  };

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!dragging.current) return;
      onDrag(e.clientX);
    };
    const onMouseUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onDrag]);

  return (
    <div
      onMouseDown={onMouseDown}
      className="flex-shrink-0 w-1.5 cursor-col-resize relative group"
      style={{ background: "rgba(255,255,255,0.04)" }}
    >
      <div
        className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 transition-all group-hover:w-1"
        style={{
          background: "linear-gradient(180deg, transparent, rgba(139,92,246,0.6), transparent)",
        }}
      />
      {/* Drag handle dots */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1 h-1 rounded-full"
            style={{ background: "rgba(139,92,246,0.4)" }}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE HEADER
// ─────────────────────────────────────────────────────────────────────────────
function PageHeader({ onBack }) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-xl flex-shrink-0">
      <div className="mx-auto flex max-w-full items-center justify-between px-5 py-3">
        <button onClick={onBack} className="flex items-center gap-2.5 group">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg shadow-lg"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
              boxShadow: "0 4px 14px rgba(124,58,237,0.4)",
            }}
          >
            <Target size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Interview
            <span
              className="text-gradient"
              style={{ "--grad-from": "#8b5cf6", "--grad-to": "#6366f1" }}
            >
              Prep
            </span>
          </span>
        </button>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition-all"
        >
          <ArrowLeft size={15} />
          Back to chat
        </button>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function InterviewSimulator() {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  // Left-panel width percentage (30%-70%), only relevant when right panel visible
  const containerRef = useRef(null);
  const [leftPct, setLeftPct] = useState(40);

  // ── Hooks ──────────────────────────────────────────────────────────────
  const tts = useSpeechSynthesis();

  const stt = useSpeechRecognition({
    onSilence: () => dispatch({ type: "SILENCE_DETECTED" }),
    onNoSpeech: () => {/* noSpeechTimeout is read from stt directly */},
  });

  // ── Derived values ─────────────────────────────────────────────────────
  const currentQ = state.questions[state.currentIndex] ?? null;
  const isCodingQ = currentQ?.type === "coding";
  const showRightPanel = isCodingQ && state.phase !== "idle" && state.phase !== "completed";

  // ── Effect: fire TTS when entering question_playing ────────────────────
  useEffect(() => {
    if (state.phase !== "question_playing" || !currentQ) return;

    tts.speak(currentQ.text, {
      onEnd: () => dispatch({ type: "TTS_END" }),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, state.currentIndex]);

  // ── Effect: simulated "analysing" delay in submitted state ────────────
  useEffect(() => {
    if (state.phase !== "submitted") return;

    // Simulate 1.5s analysis, then generate feedback from built-in data
    const t = setTimeout(() => {
      const score = Math.floor(Math.random() * 3) + 7; // 7–9 for encouragement
      const labels = {
        7: "Good Answer",
        8: "Strong Answer",
        9: "Excellent Answer",
      };
      dispatch({
        type: "FEEDBACK_READY",
        feedback: { score, label: labels[score] ?? "Good Answer" },
      });
    }, 1500);

    return () => clearTimeout(t);
  }, [state.phase]);

  // ── Effect: track live transcript in reducer ───────────────────────────
  useEffect(() => {
    if (state.phase === "listening") {
      dispatch({ type: "SPEECH_RESULT", transcript: stt.transcript });
    }
  }, [stt.transcript, state.phase]);

  // ── Handlers ───────────────────────────────────────────────────────────
  const handleStart = useCallback((questions) => {
    dispatch({ type: "START_SESSION", questions });
  }, []);

  const handleMicStart = useCallback(() => {
    stt.reset();
    dispatch({ type: "MIC_START" });
    stt.start();
  }, [stt]);

  const handleMicStop = useCallback(() => {
    stt.stop();
    dispatch({ type: "MIC_STOP_MANUAL" });
  }, [stt]);

  const handleSubmit = useCallback(() => {
    stt.stop();
    dispatch({ type: "SUBMIT_ANSWER" });
  }, [stt]);

  const handleRedo = useCallback(() => {
    stt.reset();
    dispatch({ type: "REDO_ANSWER" });
  }, [stt]);

  const handleReplay = useCallback(() => {
    if (!currentQ) return;
    dispatch({ type: "REPLAY_TTS" });
    tts.speak(currentQ.text, {
      onEnd: () => dispatch({ type: "TTS_END" }),
    });
  }, [currentQ, tts]);

  const handleNextQuestion = useCallback(() => {
    stt.reset();
    dispatch({ type: "NEXT_QUESTION" });
  }, [stt]);

  const handleRestart = useCallback(() => {
    stt.stop();
    tts.cancel();
    dispatch({ type: "RESTART" });
  }, [stt, tts]);

  const handleRetry = useCallback(() => {
    stt.reset();
    dispatch({ type: "MIC_START" });
    stt.start();
  }, [stt]);

  // ── Draggable divider logic ────────────────────────────────────────────
  const handleDividerDrag = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setLeftPct(Math.min(70, Math.max(30, pct)));
  }, []);

  // ─────────────────────────────────────────────────────────────────────
  return (
    <AppShell>
      <div className="flex flex-col h-screen overflow-hidden">
        <PageHeader onBack={() => navigate("/")} />

        <AnimatePresence mode="wait">
          {/* ── SETUP / IDLE ─────────────────────────────────────────── */}
          {state.phase === "idle" && (
            <motion.div
              key="setup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-y-auto"
            >
              <SetupScreen onStart={handleStart} />
            </motion.div>
          )}

          {/* ── COMPLETED ─────────────────────────────────────────────── */}
          {state.phase === "completed" && (
            <motion.div
              key="completed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-y-auto px-4"
            >
              <CompletedScreen onRestart={handleRestart} />
            </motion.div>
          )}

          {/* ── INTERVIEW (all non-idle, non-completed phases) ───────── */}
          {state.phase !== "idle" && state.phase !== "completed" && (
            <motion.div
              key="interview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex min-h-0 overflow-hidden"
              ref={containerRef}
            >
              {/* ── LEFT PANEL ──────────────────────────────────────── */}
              <div
                className="flex flex-col overflow-hidden border-r border-white/[0.06]"
                style={{
                  width: showRightPanel ? `${leftPct}%` : "100%",
                  transition: showRightPanel ? "none" : "width 0.3s",
                  maxWidth: showRightPanel ? "70%" : "100%",
                  minWidth: showRightPanel ? "30%" : "100%",
                }}
              >
                {/* Scrollable left content */}
                <div className="flex-1 overflow-y-auto">
                  <div className="flex flex-col gap-6 p-5 max-w-lg mx-auto">
                    {/* Interviewer Bubble */}
                    <InterviewerBubble
                      question={currentQ?.text ?? ""}
                      questionIndex={state.currentIndex}
                      totalQuestions={state.questions.length}
                      state={state.phase}
                      speaking={tts.speaking}
                      onReplay={handleReplay}
                      ttsSupported={tts.supported}
                    />

                    {/* Divider */}
                    <div className="border-t border-white/[0.06]" />

                    {/* Voice input / STT zone */}
                    <AnimatePresence mode="wait">
                      {(state.phase === "awaiting_answer" ||
                        state.phase === "listening" ||
                        state.phase === "confirm_answer") && (
                        <motion.div
                          key="voice"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                        >
                          <VoiceInput
                            state={state.phase}
                            sttSupported={stt.supported}
                            listening={stt.listening}
                            transcript={stt.transcript}
                            interimTranscript={stt.interimTranscript}
                            error={stt.error}
                            permissionDenied={stt.permissionDenied}
                            noSpeechTimeout={stt.noSpeechTimeout}
                            onMicStart={handleMicStart}
                            onMicStop={handleMicStop}
                            onSubmit={handleSubmit}
                            onRedo={handleRedo}
                            onRetry={handleRetry}
                          />
                        </motion.div>
                      )}

                      {/* Submitted: Analysing spinner */}
                      {state.phase === "submitted" && (
                        <motion.div
                          key="submitted"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex flex-col items-center gap-3 py-6"
                        >
                          <Loader2 size={28} className="text-indigo-400 animate-spin" />
                          <p className="text-sm text-slate-400">Analysing your answer…</p>
                        </motion.div>
                      )}

                      {/* Feedback */}
                      {state.phase === "feedback" && (
                        <motion.div
                          key="feedback"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <FeedbackCard
                            feedback={state.feedback}
                            question={currentQ}
                            transcript={state.transcript}
                            onNext={handleNextQuestion}
                            onRestart={handleRestart}
                            isLast={state.currentIndex >= state.questions.length - 1}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* ← New Question / Back to Setup */}
                    {state.phase !== "feedback" && state.phase !== "submitted" && (
                      <button
                        onClick={handleRestart}
                        className="w-full rounded-xl py-2.5 text-xs text-slate-600 hover:text-slate-400 hover:bg-white/[0.03] transition-all"
                      >
                        ← New Interview
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* ── DRAGGABLE DIVIDER ─────────────────────────────────── */}
              {showRightPanel && (
                <DraggableDivider onDrag={handleDividerDrag} />
              )}

              {/* ── RIGHT PANEL (coding questions only) ──────────────── */}
              {showRightPanel && (
                <div
                  className="flex flex-col min-h-0 overflow-hidden"
                  style={{ flex: 1 }}
                >
                  {/* Question text in right panel header */}
                  <div
                    className="flex-shrink-0 px-4 py-3 border-b border-white/[0.06] text-xs text-slate-400 leading-relaxed"
                    style={{ background: "rgba(13,13,20,0.8)" }}
                  >
                    <span className="font-semibold text-indigo-400 mr-2">Coding Challenge</span>
                    {currentQ?.text}
                  </div>

                  <div className="flex-1 min-h-0">
                    <CodeEditorPanel
                      question={currentQ}
                      visible={true}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
