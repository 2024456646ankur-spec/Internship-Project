/**
 * SkillAssessment.jsx
 * Step 2 of the Career Roadmap flow.
 * Shows pillar self-rating + optional calibration questions.
 * Detects mismatch → soft warning (never auto-overrides user's rating).
 * Outputs SkillProfile.
 *
 * Props:
 *   goalInput       {GoalInput}
 *   onSubmit        {fn(SkillProfile)}
 *   onBack          {fn()}
 */
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, AlertCircle, CheckCircle2, HelpCircle } from "lucide-react";
import {
  ROLE_TRACK_MAP,
  SDE_PILLARS,
  DATA_ML_PILLARS,
} from "./roadmapTypes.js";

// ── Level selector ─────────────────────────────────────────────────────────────
const LEVELS = [
  {
    value: "beginner",
    label: "Beginner",
    desc: "Little to no exposure — need to learn from fundamentals",
    color: "#f87171",
    bg: "rgba(248,113,113,0.1)",
    border: "rgba(248,113,113,0.35)",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    desc: "Comfortable with fundamentals, inconsistent on harder problems",
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.1)",
    border: "rgba(251,191,36,0.35)",
  },
  {
    value: "advanced",
    label: "Advanced",
    desc: "Comfortable — need polish/speed, not fundamentals",
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.35)",
  },
];

// ── Calibration question (self-rated confidence, not graded) ──────────────────
function CalibrationQuestion({ question, value, onChange }) {
  return (
    <div className="py-2">
      <p className="text-xs text-slate-400 leading-relaxed mb-2">{question}</p>
      <div className="flex gap-2">
        {[
          { val: "yes",     label: "Yes ✓", color: "#34d399" },
          { val: "partial", label: "Partially ~", color: "#fbbf24" },
          { val: "no",      label: "Not yet ✗", color: "#f87171" },
        ].map(({ val, label, color }) => (
          <button
            key={val}
            type="button"
            onClick={() => onChange(val)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150"
            style={
              value === val
                ? { borderColor: color, background: color + "22", color }
                : { borderColor: "rgba(255,255,255,0.08)", background: "transparent", color: "#64748b" }
            }
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Mismatch detector ─────────────────────────────────────────────────────────
// Returns true if user selected "advanced" but answered "no"/"partial" on 3+ calibration Qs
// OR selected "beginner" but answered "yes" to 4+ calibration Qs.
function detectCalibrationMismatch(selectedLevel, calibrationAnswers) {
  const answers = Object.values(calibrationAnswers);
  if (answers.length === 0) return null;

  const noOrPartial = answers.filter((a) => a === "no" || a === "partial").length;
  const yes = answers.filter((a) => a === "yes").length;

  if (selectedLevel === "advanced" && noOrPartial >= 3) {
    return "intermediate";
  }
  if (selectedLevel === "beginner" && yes >= 4) {
    return "intermediate";
  }
  return null;
}

// ── Single pillar card ────────────────────────────────────────────────────────
function PillarCard({ pillar, rating, onRatingChange, isLanguagePillar, languageName, onLanguageChange }) {
  const [showCalibration, setShowCalibration] = useState(false);
  const [calibrationAnswers, setCalibrationAnswers] = useState({});
  const [mismatchSuggestion, setMismatchSuggestion] = useState(null);
  const [mismatchDismissed, setMismatchDismissed] = useState(false);

  const selectedLevel = LEVELS.find((l) => l.value === rating);

  const handleCalibrationAnswer = useCallback((qIdx, val) => {
    setCalibrationAnswers((prev) => {
      const next = { ...prev, [qIdx]: val };
      // Re-run mismatch detection
      const suggestion = detectCalibrationMismatch(rating, next);
      setMismatchSuggestion(suggestion);
      setMismatchDismissed(false);
      return next;
    });
  }, [rating]);

  const handleRatingChange = useCallback((level) => {
    onRatingChange(level);
    // Reset calibration state when rating changes
    setCalibrationAnswers({});
    setMismatchSuggestion(null);
    setMismatchDismissed(false);
  }, [onRatingChange]);

  return (
    <div
      className="rounded-2xl border p-4 transition-all"
      style={{
        borderColor: selectedLevel ? selectedLevel.border : "rgba(255,255,255,0.08)",
        background: selectedLevel ? selectedLevel.bg : "rgba(255,255,255,0.02)",
      }}
    >
      {/* Pillar header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-sm font-semibold text-white">{pillar.label}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{pillar.description}</p>
        </div>
        {selectedLevel && (
          <span
            className="flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: selectedLevel.bg, color: selectedLevel.color, border: `1px solid ${selectedLevel.border}` }}
          >
            {selectedLevel.label}
          </span>
        )}
      </div>

      {/* Language picker (language pillar only) */}
      {isLanguagePillar && (
        <div className="mb-3">
          <p className="text-xs text-slate-500 mb-1">Primary Language</p>
          <div className="flex flex-wrap gap-2">
            {["Python", "Java", "C++", "JavaScript", "Go", "Rust"].map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => onLanguageChange(lang)}
                className="px-3 py-1 rounded-lg text-xs font-medium border transition-all"
                style={
                  languageName === lang
                    ? { borderColor: "rgba(139,92,246,0.5)", background: "rgba(139,92,246,0.15)", color: "#c4b5fd" }
                    : { borderColor: "rgba(255,255,255,0.08)", background: "transparent", color: "#64748b" }
                }
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Level selectors */}
      <div className="flex flex-col gap-2 mb-3">
        {LEVELS.map((level) => (
          <button
            key={level.value}
            type="button"
            onClick={() => handleRatingChange(level.value)}
            className="flex items-start gap-3 rounded-xl border p-3 text-left transition-all duration-150"
            style={
              rating === level.value
                ? { borderColor: level.border, background: level.bg }
                : { borderColor: "rgba(255,255,255,0.06)", background: "transparent" }
            }
          >
            <div
              className="flex-shrink-0 w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center"
              style={{ borderColor: rating === level.value ? level.color : "#374151" }}
            >
              {rating === level.value && (
                <div className="w-2 h-2 rounded-full" style={{ background: level.color }} />
              )}
            </div>
            <div>
              <div className="text-xs font-semibold" style={{ color: rating === level.value ? level.color : "#94a3b8" }}>
                {level.label}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">{level.desc}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Calibration toggle */}
      {rating && (
        <button
          type="button"
          onClick={() => setShowCalibration((v) => !v)}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          <HelpCircle size={12} />
          {showCalibration ? "Hide" : "Optional: take a quick calibration check"}
        </button>
      )}

      {/* Calibration questions */}
      <AnimatePresence>
        {showCalibration && rating && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-white/[0.06]">
              <p className="text-xs text-slate-500 mb-3 italic">
                Not graded — just a confidence nudge. Be honest with yourself.
              </p>
              {pillar.calibrationQuestions.map((q, i) => (
                <CalibrationQuestion
                  key={i}
                  question={q}
                  value={calibrationAnswers[i]}
                  onChange={(val) => handleCalibrationAnswer(i, val)}
                />
              ))}
            </div>

            {/* Mismatch warning (soft, never auto-overrides) */}
            {mismatchSuggestion && !mismatchDismissed && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/8 p-3"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle size={13} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-amber-300/90 leading-relaxed">
                      Your calibration answers suggest this might be closer to{" "}
                      <strong className="text-amber-300">
                        {mismatchSuggestion.charAt(0).toUpperCase() + mismatchSuggestion.slice(1)}
                      </strong>
                      . Want to adjust your rating?
                    </p>
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => { handleRatingChange(mismatchSuggestion); setMismatchDismissed(true); }}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 transition-all"
                      >
                        Adjust to {mismatchSuggestion.charAt(0).toUpperCase() + mismatchSuggestion.slice(1)}
                      </button>
                      <button
                        type="button"
                        onClick={() => setMismatchDismissed(true)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/[0.08] text-slate-400 hover:text-slate-300 transition-all"
                      >
                        Keep my rating
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function SkillAssessment({ goalInput, onSubmit, onBack }) {
  const roleTrack = ROLE_TRACK_MAP[goalInput.targetRole] ?? "sde";
  const pillars = roleTrack === "sde" ? SDE_PILLARS : DATA_ML_PILLARS;

  // ratings: { [pillarKey]: "beginner" | "intermediate" | "advanced" }
  const [ratings, setRatings] = useState({});
  const [languageName, setLanguageName] = useState("Python");

  const allRated = pillars.every((p) => ratings[p.key]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Build SkillProfile
    const skillProfile = {
      role_track: roleTrack,
      pillars: Object.fromEntries(
        pillars.map((p) => [
          p.key,
          { level: ratings[p.key], calibration_flag: false }, // calibration_flag is managed per-pillar internally
        ])
      ),
      language: roleTrack === "sde"
        ? { name: languageName, level: ratings["language"] ?? "intermediate" }
        : null,
    };

    onSubmit(skillProfile);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className="mx-auto max-w-2xl px-4 py-8"
    >
      {/* Header */}
      <div className="mb-6">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 mb-4 transition-colors"
        >
          <ChevronLeft size={14} /> Back
        </button>
        <h2 className="text-2xl font-bold text-white mb-1">Skill Self-Assessment</h2>
        <p className="text-slate-400 text-sm">
          Rate yourself honestly on each pillar for a{" "}
          <span className="text-indigo-400">{goalInput.targetRole}</span> role.
          A calibrated starting point produces a more useful plan.
        </p>
      </div>

      {/* Progress note */}
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <CheckCircle2 size={13} className="text-indigo-400" />
        Step 2 of 3 — Self-assessment
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4 mb-6">
          {pillars.map((pillar) => (
            <PillarCard
              key={pillar.key}
              pillar={pillar}
              rating={ratings[pillar.key]}
              onRatingChange={(level) => setRatings((prev) => ({ ...prev, [pillar.key]: level }))}
              isLanguagePillar={pillar.key === "language"}
              languageName={languageName}
              onLanguageChange={setLanguageName}
            />
          ))}
        </div>

        {!allRated && (
          <p className="text-xs text-slate-600 text-center mb-4">
            Rate all {pillars.length} pillars to continue
          </p>
        )}

        <button
          type="submit"
          disabled={!allRated}
          className="w-full flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={
            allRated
              ? { background: "linear-gradient(135deg, #8b5cf6, #ec4899)", boxShadow: "0 0 24px rgba(139,92,246,0.35)" }
              : { background: "rgba(255,255,255,0.06)" }
          }
        >
          Generate My Roadmap
          <ChevronRight size={16} />
        </button>
      </form>
    </motion.div>
  );
}
