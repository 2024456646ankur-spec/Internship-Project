/**
 * LoginProgressSummary.jsx
 * Compact dismissible card shown once per browser session on the main chat screen.
 *
 * Reads from localStorage (friday.careerRoadmap.v1) — no separate tracking system.
 * Shown once per session via sessionStorage flag "friday.roadmapSummaryShown".
 *
 * v2 extension note:
 *   A cross-module summary (Interview Simulator sessions, NeuralQuiz scores, etc.)
 *   is a natural follow-on — each module would need to expose a shared progress
 *   interface (e.g., an agreed-upon localStorage key or context hook) before this
 *   component can reach in. For v1, we only surface Career Roadmap data.
 *
 * Props:
 *   onNavigateToRoadmap  {fn(weekNumber)}  — navigate to /practice-roadmap?week=N
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, X, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import { useRoadmapStorage } from "./useRoadmapStorage.js";
import { classifyWeek } from "./ProgressTracker.jsx";

const SESSION_KEY = "friday.roadmapSummaryShown";

// ── Status helpers ────────────────────────────────────────────────────────────
function getStatusInfo(currentWeek, checklistState) {
  if (!currentWeek) return { label: "No active week", color: "#94a3b8", icon: "📋" };

  const items = currentWeek.checklistItems ?? [];
  const done = items.filter((item) => checklistState?.[currentWeek.weekNumber]?.[item.id]).length;
  const pct = items.length === 0 ? 0 : Math.round((done / items.length) * 100);

  const calStatus = classifyWeek(currentWeek, pct);

  if (calStatus === "complete")   return { label: "On track ✓",                   color: "#34d399", icon: "🎯", pct };
  if (calStatus === "overdue")    return { label: "Behind schedule — see Roadmap", color: "#f87171", icon: "⚠️", pct };
  if (pct >= 100)                 return { label: "Ahead of schedule 🚀",          color: "#a78bfa", icon: "🚀", pct };
  return                                 { label: "On track",                       color: "#34d399", icon: "📈", pct };
}

// ── No-roadmap CTA ────────────────────────────────────────────────────────────
function SetupCTA({ onNavigate, onDismiss }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="relative rounded-2xl border border-purple-500/25 p-4 mb-4"
      style={{
        background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(236,72,153,0.04))",
        backdropFilter: "blur(12px)",
      }}
    >
      <button
        onClick={onDismiss}
        className="absolute top-3 right-3 text-slate-600 hover:text-slate-400 transition-colors"
      >
        <X size={14} />
      </button>

      <div className="flex items-center gap-3">
        <div
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}
        >
          <Map size={18} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">Set up your Career Roadmap</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Get a personalised week-by-week interview prep plan
          </p>
        </div>
        <button
          onClick={onNavigate}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white transition-all"
          style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}
        >
          Get Started
          <ArrowRight size={12} />
        </button>
      </div>
    </motion.div>
  );
}

// ── Active roadmap summary ────────────────────────────────────────────────────
function RoadmapSummary({ roadmap, checklistState, statusInfo, currentWeek, onNavigate, onDismiss }) {
  const totalWeeks = roadmap.weeks.length;
  const currentWeekNum = currentWeek?.weekNumber ?? 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="relative rounded-2xl border p-4 mb-4 cursor-pointer group transition-all duration-200"
      style={{
        borderColor: "rgba(139,92,246,0.2)",
        background: "rgba(139,92,246,0.05)",
      }}
      onClick={() => onNavigate(currentWeekNum)}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onDismiss(); }}
        className="absolute top-3 right-3 text-slate-600 hover:text-slate-400 transition-colors"
      >
        <X size={14} />
      </button>

      <div className="flex items-center gap-3">
        <div
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg"
          style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)" }}
        >
          {statusInfo.icon}
        </div>

        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-white">Career Roadmap</span>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ color: statusInfo.color, background: statusInfo.color + "20", border: `1px solid ${statusInfo.color}40` }}
            >
              {statusInfo.label}
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-0.5">
            Week {currentWeekNum} of {totalWeeks}
            {currentWeek?.theme ? ` · ${currentWeek.theme}` : ""}
          </p>

          {/* Mini progress bar */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${statusInfo.pct ?? 0}%`,
                  background: statusInfo.pct >= 100
                    ? "#34d399"
                    : "linear-gradient(90deg, #8b5cf6, #ec4899)",
                }}
              />
            </div>
            <span className="text-xs text-slate-600">{statusInfo.pct ?? 0}%</span>
            <ChevronRight
              size={12}
              className="text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function LoginProgressSummary({ onNavigateToRoadmap }) {
  const [visible, setVisible] = useState(false);
  const { roadmapState, getCurrentWeek, getWeekProgress } = useRoadmapStorage();

  // Show once per browser session
  useEffect(() => {
    const alreadyShown = sessionStorage.getItem(SESSION_KEY);
    if (!alreadyShown) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setVisible(false);
  };

  const navigate = (weekNum) => {
    dismiss();
    onNavigateToRoadmap?.(weekNum);
  };

  if (!visible) return null;

  const roadmap = roadmapState?.roadmap;
  const currentWeek = getCurrentWeek();
  const statusInfo = roadmap && currentWeek
    ? getStatusInfo(currentWeek, roadmapState.checklistState)
    : null;

  return (
    <AnimatePresence>
      {visible && (
        <>
          {!roadmap ? (
            <SetupCTA onNavigate={() => navigate(null)} onDismiss={dismiss} />
          ) : (
            <RoadmapSummary
              roadmap={roadmap}
              checklistState={roadmapState.checklistState}
              statusInfo={statusInfo}
              currentWeek={currentWeek}
              onNavigate={navigate}
              onDismiss={dismiss}
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
}

// Re-export for convenience
export { getStatusInfo };
