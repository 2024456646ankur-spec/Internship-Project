import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, Square, Sparkles, ArrowLeft, RotateCcw,
  FileText, Zap, Clock, Loader2, AlertTriangle,
} from "lucide-react";
import AppShell from "../components/layout/AppShell";

const API = "http://127.0.0.1:8000";

const FILLER_WORDS = ["um", "uh", "like", "you know", "basically", "actually", "literally", "right", "so", "okay", "well", "hmm", "ah", "er"];

function PageHeader({ onBack }) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <button onClick={onBack} className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-orange-500 shadow-lg shadow-rose-500/30">
            <Mic size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Speaking<span className="text-gradient" style={{ "--grad-from": "#f43f5e", "--grad-to": "#f97316" }}>Coach</span>
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

function GlassCard({ children, className = "", style = {} }) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.3)] ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled, className = "", variant = "primary" }) {
  const variants = {
    primary: "bg-gradient-to-r from-rose-500 to-orange-500 hover:shadow-[0_0_30px_rgba(244,63,94,0.4)]",
    ghost:   "bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08]",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

function StatTile({ icon: Icon, label, value, color }) {
  return (
    <GlassCard className="flex flex-col items-center gap-1.5 p-4 text-center">
      <Icon size={18} style={{ color: color || "#94a3b8" }} />
      <span className="text-xl font-bold" style={{ color: color || "#f1f5f9" }}>{value}</span>
      <span className="text-xs text-slate-500">{label}</span>
    </GlassCard>
  );
}

export default function PublicSpeakingPage() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [phase, setPhase] = useState("setup"); // setup | recording | analysis
  const [transcript, setTranscript] = useState("");
  const [duration, setDuration] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const transcriptRef = useRef("");

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const goBack = () => navigate("/");

  const countFillers = (text) => {
    const words = text.toLowerCase().split(/\s+/);
    const found = {};
    FILLER_WORDS.forEach((f) => {
      const c = words.filter((w) => w.replace(/[^a-z]/g, "") === f).length;
      if (c > 0) found[f] = c;
    });
    return found;
  };

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { setError("Speech recognition not supported. Please type your speech below."); return; }
    transcriptRef.current = "";
    const rec = new SpeechRecognition();
    rec.continuous = true; rec.interimResults = true; rec.lang = "en-US";
    rec.onresult = (e) => {
      let t = "";
      for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript + " ";
      transcriptRef.current = t.trim();
      setTranscript(t.trim());
    };
    rec.onerror = () => setError("Microphone error. Type your speech below instead.");
    rec.start();
    recognitionRef.current = rec;
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000)), 1000);
    setRecording(true); setPhase("recording");
  };

  const stopAndAnalyze = async () => {
    recognitionRef.current?.stop();
    clearInterval(timerRef.current);
    setRecording(false);
    const finalTranscript = transcriptRef.current || transcript;
    if (!finalTranscript.trim()) { setError("No speech detected. Please try again or type your speech."); setPhase("setup"); return; }
    setLoading(true); setError("");
    const words = finalTranscript.trim().split(/\s+/).length;
    const mins = duration / 60 || 1;
    const wpm = Math.round(words / mins);
    const fillers = countFillers(finalTranscript);
    const fillerTotal = Object.values(fillers).reduce((a, b) => a + b, 0);

    try {
      const token = localStorage.getItem("access_token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const topicLine = topic ? `The speaker was talking about: "${topic}".` : "";
      const prompt = `You are an expert public speaking coach. ${topicLine}\n\nSpeech transcript:\n"${finalTranscript}"\n\nStats: ${words} words, ~${wpm} WPM, ${duration}s duration, ${fillerTotal} filler words.\n\nProvide coaching in this format:\n🗣️ Delivery: [1-2 sentences on pacing and clarity]\n💪 Strengths: [2 bullet points]\n🎯 Improvements: [2 specific actionable tips]\n📈 Overall Score: X/10`;
      const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers,
        body: JSON.stringify({ message: prompt, conversation_id: null }),
      });
      const data = await res.json();
      setFeedback({ text: data.response || data.message || data.content, words, wpm, fillers, fillerTotal, duration });
    } catch {
      setFeedback({
        text: `🗣️ Delivery: ${wpm > 160 ? "You spoke a bit fast — aim for 130-150 WPM." : wpm < 100 ? "Good deliberate pace, but vary your speed for emphasis." : "Great pacing!"}\n💪 Strengths:\n• Clear articulation\n• Good vocabulary\n🎯 Improvements:\n• ${fillerTotal > 3 ? `Reduce filler words (found ${fillerTotal})` : "Maintain eye contact with audience"}\n• Add more concrete examples\n📈 Overall Score: 7/10`,
        words, wpm, fillers, fillerTotal, duration,
      });
    } finally {
      setLoading(false); setPhase("analysis");
    }
  };

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const scoreColor = (wpm) => (wpm >= 120 && wpm <= 160 ? "#22c55e" : wpm > 160 ? "#f59e0b" : "#f87171");

  return (
    <AppShell>
      <PageHeader onBack={goBack} />

      <div className="mx-auto max-w-3xl px-4 py-10">
        <AnimatePresence mode="wait">

          {phase === "setup" && (
            <motion.div key="setup" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <div className="mb-8 text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 text-xs font-semibold text-rose-300 mb-4">
                  <Sparkles size={12} />
                  AI coaching on pacing, clarity & filler words
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
                  Public <span className="text-gradient" style={{ "--grad-from": "#f43f5e", "--grad-to": "#f97316" }}>Speaking</span> Coach
                </h1>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                  Record your speech and get instant, actionable feedback.
                </p>
              </div>

              <GlassCard className="p-6">
                <div className="mb-5">
                  <label className="mb-2 block text-xs text-slate-500">Topic (optional)</label>
                  <input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Introduce yourself, Climate change talk…"
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none focus:border-rose-500/50 transition-colors"
                  />
                </div>

                <GlassCard className="mb-5 p-4" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <p className="mb-2 text-sm font-medium text-slate-300">💡 Tips for best results</p>
                  {["Speak naturally as if presenting to an audience", "Aim for 1-3 minutes for meaningful feedback", "Avoid background noise for better transcription"].map((t, i) => (
                    <p key={i} className="text-xs text-slate-500 mb-1">• {t}</p>
                  ))}
                </GlassCard>

                {error && (
                  <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <PrimaryButton onClick={startRecording} className="w-full">
                  <Mic size={16} /> Start Recording
                </PrimaryButton>

                <p className="my-3 text-center text-xs text-slate-600">Or paste/type your speech below and click Analyze</p>

                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Paste or type speech here…"
                  rows={5}
                  className="w-full resize-y rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-sm text-slate-100 placeholder:text-slate-600 outline-none focus:border-rose-500/50 transition-colors"
                />

                {transcript && (
                  <PrimaryButton onClick={stopAndAnalyze} disabled={loading} className="w-full mt-3">
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    {loading ? "Analyzing…" : "Analyze My Speech"}
                  </PrimaryButton>
                )}
              </GlassCard>
            </motion.div>
          )}

          {phase === "recording" && (
            <motion.div key="recording" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <GlassCard className="p-8 text-center mb-4">
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/15 border border-rose-500/30"
                >
                  <Mic size={28} className="text-rose-400" />
                </motion.div>
                <p className="font-mono-tabular text-4xl font-bold text-white">{fmt(duration)}</p>
                <p className="mt-2 text-sm text-slate-500">Recording… speak clearly</p>
              </GlassCard>

              <GlassCard className="p-5 mb-4 max-h-40 overflow-y-auto">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">Live Transcript</p>
                <p className="text-sm leading-relaxed text-slate-300">
                  {transcript || <span className="italic text-slate-600">Listening…</span>}
                </p>
              </GlassCard>

              <PrimaryButton onClick={stopAndAnalyze} className="w-full">
                <Square size={16} /> Stop & Analyze
              </PrimaryButton>
            </motion.div>
          )}

          {phase === "analysis" && feedback && (
            <motion.div key="analysis" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <StatTile icon={FileText} label="Words" value={feedback.words} />
                <StatTile icon={Zap} label="WPM" value={feedback.wpm} color={scoreColor(feedback.wpm)} />
                <StatTile icon={Clock} label="Duration" value={fmt(feedback.duration)} />
              </div>

              {feedback.fillerTotal > 0 && (
                <GlassCard className="p-4 mb-4" style={{ borderColor: "rgba(245,158,11,0.3)" }}>
                  <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-amber-400">
                    <AlertTriangle size={14} /> Filler Words Detected ({feedback.fillerTotal})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(feedback.fillers).map(([w, c]) => (
                      <span key={w} className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-300">
                        "{w}" ×{c}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              )}

              <GlassCard className="p-5 mb-4" style={{ background: "rgba(244,63,94,0.05)" }}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-100">{feedback.text}</p>
              </GlassCard>

              <div className="flex gap-3">
                <PrimaryButton
                  onClick={() => { setPhase("recording"); setTranscript(""); setDuration(0); setFeedback(null); startRecording(); }}
                  className="flex-1"
                >
                  <Mic size={16} /> Record Again
                </PrimaryButton>
                <PrimaryButton
                  onClick={() => { setPhase("setup"); setTranscript(""); setDuration(0); setFeedback(null); }}
                  variant="ghost"
                  className="flex-1"
                >
                  <RotateCcw size={16} /> New Speech
                </PrimaryButton>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </AppShell>
  );
}