/**
 * RoadmapPage.jsx
 * Top-level page at /practice-roadmap.
 * Owns the useReducer flow state machine for the multi-step wizard.
 *
 * State machine:
 *   idle           — no roadmap; show goal form (Step 1)
 *   skill_assess   — goal captured; show skill assessment (Step 2)
 *   generating     — LLM call in flight; show RoadmapGenerator
 *   timeline       — roadmap generated; show RoadmapTimeline + ProgressTracker
 *   regenerating   — user clicked Regenerate; go back to idle and clear
 *
 * URL param: ?week=N — when navigated from LoginProgressSummary, auto-expands
 * the specified week in the timeline.
 */
import React, { useReducer, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Map } from "lucide-react";

import AppShell from "../../components/layout/AppShell";
import RoadmapGoalForm from "./RoadmapGoalForm.jsx";
import SkillAssessment from "./SkillAssessment.jsx";
import RoadmapGenerator from "./RoadmapGenerator.jsx";
import RoadmapTimeline from "./RoadmapTimeline.jsx";
import { useRoadmapStorage } from "./useRoadmapStorage.js";
import { useProgressTracker } from "./ProgressTracker.jsx";
import { getCompanyProfile } from "./company_profiles.js";

// ── Reducer ────────────────────────────────────────────────────────────────────
const INITIAL_STATE = {
  phase: "idle",          // "idle" | "skill_assess" | "generating" | "timeline"
  goalInput: null,
  skillProfile: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_GOAL":
      return { ...state, phase: "skill_assess", goalInput: action.goalInput };
    case "SET_SKILL":
      return { ...state, phase: "generating", skillProfile: action.skillProfile };
    case "ROADMAP_READY":
      return { ...state, phase: "timeline" };
    case "BACK_TO_GOAL":
      return { ...state, phase: "idle" };
    case "BACK_TO_SKILL":
      return { ...state, phase: "skill_assess" };
    case "REGENERATE":
      return { ...INITIAL_STATE }; // full reset
    case "RESTORE":
      // Restore from localStorage (returning user has existing roadmap)
      return { ...state, phase: "timeline", goalInput: action.goalInput, skillProfile: action.skillProfile };
    default:
      return state;
  }
}

// ── Page header ────────────────────────────────────────────────────────────────
function PageHeader({ onBack, phase }) {
  const stepLabels = {
    idle:         "Step 1 of 3 — Goal",
    skill_assess: "Step 2 of 3 — Self-Assessment",
    generating:   "Step 3 of 3 — Generating",
    timeline:     "Your Roadmap",
  };

  return (
    <header
      className="sticky top-0 z-30 flex-shrink-0 border-b border-white/[0.06] backdrop-blur-xl"
      style={{ background: "rgba(10,10,15,0.85)" }}
    >
      <div className="flex items-center justify-between px-5 py-3 max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}
          >
            <Map size={16} className="text-white" />
          </div>
          <div>
            <span className="text-base font-bold text-white">Career Roadmap</span>
            {stepLabels[phase] && (
              <p className="text-xs text-slate-500 -mt-0.5">{stepLabels[phase]}</p>
            )}
          </div>
        </div>

        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition-all"
        >
          <ArrowLeft size={15} />
          Back to chat
        </button>
      </div>

      {/* Step indicator for wizard phases */}
      {["idle", "skill_assess", "generating"].includes(phase) && (
        <div className="flex h-0.5">
          {[0, 1, 2].map((i) => {
            const phaseIdx = { idle: 0, skill_assess: 1, generating: 2, timeline: 3 }[phase] ?? 0;
            return (
              <div
                key={i}
                className="flex-1 transition-all duration-500"
                style={{
                  background: i <= phaseIdx
                    ? "linear-gradient(90deg, #8b5cf6, #ec4899)"
                    : "rgba(255,255,255,0.06)",
                }}
              />
            );
          })}
        </div>
      )}
    </header>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function RoadmapPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scrollToWeek = searchParams.get("week") ? Number(searchParams.get("week")) : null;

  const [uiState, dispatch] = useReducer(reducer, INITIAL_STATE);

  const storage = useRoadmapStorage();
  const {
    roadmapState,
    saveGoalInput,
    saveSkillProfile,
    saveRoadmap,
    toggleChecklistItem,
    extendTimeline,
    replaceRemainingWeeks,
    clearRoadmap,
    isItemDone,
    getOverallProgress,
    getCurrentWeek,
    getWeekProgress,
  } = storage;

  // ── On mount: restore existing roadmap from localStorage ──────────────────
  useEffect(() => {
    const stored = roadmapState;
    if (stored?.roadmap && uiState.phase === "idle") {
      dispatch({
        type: "RESTORE",
        goalInput: stored.goalInput,
        skillProfile: stored.skillProfile,
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Company profile lookup ────────────────────────────────────────────────
  const { profile: companyProfile, usedFallback } = uiState.goalInput
    ? getCompanyProfile(uiState.goalInput.targetCompany)
    : { profile: null, usedFallback: false };

  // ── Progress tracker ──────────────────────────────────────────────────────
  const tracker = useProgressTracker({
    roadmapState,
    getWeekProgress,
    extendTimeline,
    replaceRemainingWeeks,
  });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleGoalSubmit = useCallback((goalInput) => {
    saveGoalInput(goalInput);
    dispatch({ type: "SET_GOAL", goalInput });
  }, [saveGoalInput]);

  const handleSkillSubmit = useCallback((skillProfile) => {
    saveSkillProfile(skillProfile);
    dispatch({ type: "SET_SKILL", skillProfile });
  }, [saveSkillProfile]);

  const handleRoadmapGenerated = useCallback((roadmap) => {
    saveRoadmap(roadmap);
    dispatch({ type: "ROADMAP_READY" });
  }, [saveRoadmap]);

  const handleRegenerate = useCallback(() => {
    clearRoadmap(false);
    dispatch({ type: "REGENERATE" });
  }, [clearRoadmap]);

  return (
    <AppShell>
      <div className="flex flex-col h-screen overflow-hidden">
        <PageHeader
          onBack={() => navigate("/")}
          phase={uiState.phase}
        />

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">

            {/* ── STEP 1: Goal form ──────────────────────────────────────── */}
            {uiState.phase === "idle" && (
              <motion.div key="goal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <RoadmapGoalForm
                  initialValues={roadmapState?.goalInput}
                  onSubmit={handleGoalSubmit}
                />
              </motion.div>
            )}

            {/* ── STEP 2: Skill assessment ──────────────────────────────── */}
            {uiState.phase === "skill_assess" && (
              <motion.div key="skill" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SkillAssessment
                  goalInput={uiState.goalInput}
                  onSubmit={handleSkillSubmit}
                  onBack={() => dispatch({ type: "BACK_TO_GOAL" })}
                />
              </motion.div>
            )}

            {/* ── STEP 3: Generation ────────────────────────────────────── */}
            {uiState.phase === "generating" && uiState.goalInput && uiState.skillProfile && (
              <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <RoadmapGenerator
                  goalInput={uiState.goalInput}
                  skillProfile={uiState.skillProfile}
                  companyProfile={companyProfile}
                  usedFallback={usedFallback}
                  onGenerated={handleRoadmapGenerated}
                  onError={(err) => console.error("[RoadmapPage] generation error:", err)}
                />
              </motion.div>
            )}

            {/* ── TIMELINE: Active roadmap ──────────────────────────────── */}
            {uiState.phase === "timeline" && roadmapState?.roadmap && (
              <motion.div key="timeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <RoadmapTimeline
                  roadmap={roadmapState.roadmap}
                  roadmapState={roadmapState}
                  weekStatuses={tracker.weekStatuses}
                  pendingAdjustment={tracker.pendingAdjustment}
                  onChecklistToggle={toggleChecklistItem}
                  onExtend={tracker.handleExtend}
                  onCompress={tracker.handleCompress}
                  onDismiss={tracker.handleDismiss}
                  onRegenerate={handleRegenerate}
                  isCompressing={tracker.isCompressing}
                  compressionError={tracker.compressionError}
                  scrollToWeek={scrollToWeek}
                  getWeekProgress={getWeekProgress}
                  getOverallProgress={getOverallProgress}
                  isItemDone={isItemDone}
                />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </AppShell>
  );
}
