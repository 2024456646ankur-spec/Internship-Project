/**
 * RoadmapTimeline.jsx
 * Displays the generated Roadmap as a vertical stepper.
 *
 * Props:
 *   roadmap             {Roadmap}
 *   roadmapState        {object}         — from useRoadmapStorage
 *   weekStatuses        {object}         — from useProgressTracker
 *   pendingAdjustment   {object|null}    — from useProgressTracker
 *   onChecklistToggle   {fn(weekNum, itemId)}
 *   onExtend            {fn(weekNum)}
 *   onCompress          {fn(weekNum)}
 *   onDismiss           {fn(weekNum)}
 *   onRegenerate        {fn()}
 *   isCompressing       {boolean}
 *   compressionError    {string|null}
 *   scrollToWeek        {number|null}   — expand+scroll to this week on mount
 *   getWeekProgress     {fn(weekNum)}
 *   getOverallProgress  {fn()}
 */
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, ChevronUp, RefreshCw, CheckCircle2, Circle,
  BookOpen, Code2, Wrench, Target, Zap, AlertCircle, Trophy,
  Calendar, ExternalLink
} from "lucide-react";
import { AdjustmentBanner } from "./ProgressTracker.jsx";
import { isProfileStale } from "./company_profiles.js";

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function levelBadgeStyle(level) {
  if (level === "beginner") return { color: "#f87171", bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.3)" };
  if (level === "intermediate") return { color: "#fbbf24", bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.3)" };
  return { color: "#34d399", bg: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.3)" };
}

// ── "Why this plan" hero card ─────────────────────────────────────────────────
function WhyThisPlan({ text, goalInput, skillProfile, companyProfile }) {
  const stale = companyProfile && isProfileStale(companyProfile.last_updated);

  return (
    <div
      className="rounded-2xl border border-purple-500/20 p-5 mb-6"
      style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.07), rgba(236,72,153,0.04))" }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}
        >
          <Zap size={16} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-400 mb-2">
            Why this plan
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">{text}</p>

          {/* Skill summary badges */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {Object.entries(skillProfile.pillars).map(([key, { level }]) => {
              const s = levelBadgeStyle(level);
              return (
                <span
                  key={key}
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}
                >
                  {key.replace(/_/g, " ")}: {level}
                </span>
              );
            })}
          </div>

          {/* Staleness disclaimer */}
          {stale && (
            <p className="mt-3 text-xs text-slate-500 italic">
              📅 Company data last verified {companyProfile.last_updated} — treat company-specific guidance as directional.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Week status indicator dot ─────────────────────────────────────────────────
function StatusDot({ status }) {
  const dotStyle = {
    complete:  { bg: "#34d399", shadow: "0 0 8px rgba(52,211,153,0.5)" },
    current:   { bg: "#8b5cf6", shadow: "0 0 8px rgba(139,92,246,0.5)" },
    overdue:   { bg: "#f87171", shadow: "0 0 8px rgba(248,113,113,0.5)" },
    upcoming:  { bg: "#374151", shadow: "none" },
  }[status] ?? { bg: "#374151", shadow: "none" };

  return (
    <div
      className="w-3.5 h-3.5 rounded-full flex-shrink-0"
      style={{ background: dotStyle.bg, boxShadow: dotStyle.shadow, transition: "all 0.3s" }}
    />
  );
}

// ── Checklist item row ────────────────────────────────────────────────────────
function ChecklistRow({ item, weekNumber, done, onToggle }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(weekNumber, item.id)}
      className="flex items-start gap-2.5 text-left w-full group py-1.5 rounded-lg hover:bg-white/[0.03] px-2 -mx-2 transition-colors"
    >
      <div className="mt-0.5 flex-shrink-0">
        {done ? (
          <CheckCircle2 size={15} className="text-emerald-400" />
        ) : (
          <Circle size={15} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
        )}
      </div>
      <span
        className="text-xs leading-relaxed transition-colors"
        style={{ color: done ? "#64748b" : "#cbd5e1", textDecoration: done ? "line-through" : "none" }}
      >
        {item.label}
      </span>
    </button>
  );
}

// ── Section in expanded week card ─────────────────────────────────────────────
function WeekSection({ icon: Icon, title, items, iconColor }) {
  if (!items?.length) return null;
  return (
    <div className="mb-4">
      <div className="flex items-center gap-1.5 mb-2">
        <Icon size={13} style={{ color: iconColor }} />
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
      </div>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-xs text-slate-300 leading-relaxed flex gap-2">
            <span className="text-slate-600 flex-shrink-0 mt-0.5">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Week card ─────────────────────────────────────────────────────────────────
function WeekCard({
  week,
  status,
  checklistPct,
  expanded,
  onToggleExpand,
  onChecklistToggle,
  isItemDone,
  isMockWeekStart,
  isLast,
}) {
  const cardRef = useRef(null);

  const statusColors = {
    complete:  { border: "rgba(52,211,153,0.25)",  bg: "rgba(52,211,153,0.04)" },
    current:   { border: "rgba(139,92,246,0.35)",  bg: "rgba(139,92,246,0.06)" },
    overdue:   { border: "rgba(248,113,113,0.3)",  bg: "rgba(248,113,113,0.04)" },
    upcoming:  { border: "rgba(255,255,255,0.07)", bg: "rgba(255,255,255,0.02)" },
  }[status] ?? { border: "rgba(255,255,255,0.07)", bg: "rgba(255,255,255,0.02)" };

  const statusLabel = {
    complete: "✓ Complete",
    current:  "→ This week",
    overdue:  "⚠ Overdue",
    upcoming: null,
  }[status];

  return (
    <div className="flex gap-3 mb-2" ref={cardRef}>
      {/* Timeline spine + dot */}
      <div className="flex flex-col items-center flex-shrink-0 w-6">
        <StatusDot status={status} />
        {!isLast && (
          <div
            className="w-px flex-1 mt-1"
            style={{
              background: status === "complete"
                ? "linear-gradient(180deg, rgba(52,211,153,0.4), rgba(255,255,255,0.06))"
                : "rgba(255,255,255,0.06)",
              minHeight: 24,
            }}
          />
        )}
      </div>

      {/* Card */}
      <div
        className="flex-1 rounded-2xl border mb-4 overflow-hidden transition-all duration-200"
        style={{ borderColor: cardRef.current && expanded ? cardColors(status).border : cardColors(status).border, background: cardColors(status).bg }}
      >
        {/* Header (always visible) */}
        <button
          type="button"
          onClick={onToggleExpand}
          className="w-full flex items-start gap-3 p-4 text-left"
        >
          {/* Week number */}
          <span
            className="flex-shrink-0 text-xs font-bold rounded-lg px-2 py-1"
            style={{
              background: "rgba(139,92,246,0.15)",
              color: "#a78bfa",
              border: "1px solid rgba(139,92,246,0.2)",
            }}
          >
            W{week.weekNumber}
          </span>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-white">{week.theme}</span>
              {statusLabel && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={
                    status === "complete"
                      ? { background: "rgba(52,211,153,0.15)", color: "#34d399", border: "1px solid rgba(52,211,153,0.3)" }
                      : status === "current"
                      ? { background: "rgba(139,92,246,0.15)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.3)" }
                      : { background: "rgba(248,113,113,0.15)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)" }
                  }
                >
                  {statusLabel}
                </span>
              )}
              {isMockWeekStart && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-rose-500/15 text-rose-400 border border-rose-500/30">
                  🎭 Mock interviews begin
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{week.milestone}</p>

            {/* Progress bar for this week */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${checklistPct}%`,
                    background: checklistPct >= 100 ? "#34d399" : "linear-gradient(90deg, #8b5cf6, #ec4899)",
                  }}
                />
              </div>
              <span className="text-xs text-slate-600 flex-shrink-0">{checklistPct}%</span>
            </div>
          </div>

          {/* Calendar date + expand chevron */}
          <div className="flex-shrink-0 flex flex-col items-end gap-1">
            <span className="text-xs text-slate-600 flex items-center gap-1">
              <Calendar size={11} />
              {fmtDate(week.calendarStartDate)}
            </span>
            {expanded ? (
              <ChevronUp size={14} className="text-slate-500" />
            ) : (
              <ChevronDown size={14} className="text-slate-500" />
            )}
          </div>
        </button>

        {/* Expanded content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 border-t border-white/[0.06] pt-4">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <WeekSection
                    icon={BookOpen}
                    title="Topics"
                    items={week.topics}
                    iconColor="#a78bfa"
                  />
                  <WeekSection
                    icon={ExternalLink}
                    title="Resources"
                    items={week.resources}
                    iconColor="#67e8f9"
                  />
                  <WeekSection
                    icon={Target}
                    title="Practice Targets"
                    items={week.practiceTargets}
                    iconColor="#4ade80"
                  />
                  <WeekSection
                    icon={Wrench}
                    title="Tools"
                    items={week.tools}
                    iconColor="#fb923c"
                  />
                </div>

                {/* Checklist */}
                {week.checklistItems?.length > 0 && (
                  <div className="border-t border-white/[0.06] pt-4">
                    <div className="flex items-center gap-1.5 mb-3">
                      <Code2 size={13} className="text-indigo-400" />
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Milestone Checklist
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      {week.checklistItems.map((item) => (
                        <ChecklistRow
                          key={item.id}
                          item={item}
                          weekNumber={week.weekNumber}
                          done={isItemDone(week.weekNumber, item.id)}
                          onToggle={onChecklistToggle}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Helper to avoid closure issues in cardRef style
function cardColors(status) {
  return {
    complete:  { border: "rgba(52,211,153,0.25)",  bg: "rgba(52,211,153,0.04)" },
    current:   { border: "rgba(139,92,246,0.35)",  bg: "rgba(139,92,246,0.06)" },
    overdue:   { border: "rgba(248,113,113,0.3)",  bg: "rgba(248,113,113,0.04)" },
    upcoming:  { border: "rgba(255,255,255,0.07)", bg: "rgba(255,255,255,0.02)" },
  }[status] ?? { border: "rgba(255,255,255,0.07)", bg: "rgba(255,255,255,0.02)" };
}

// ── Regenerate confirmation modal ─────────────────────────────────────────────
function RegenerateModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="rounded-2xl border border-white/[0.08] p-6 w-full max-w-sm"
        style={{ background: "#13131f" }}
      >
        <AlertCircle size={28} className="text-amber-400 mb-3" />
        <h3 className="text-base font-bold text-white mb-2">Regenerate Roadmap?</h3>
        <p className="text-sm text-slate-400 leading-relaxed mb-5">
          This will clear your current roadmap and progress. If you change your target role or company, 
          the plan will change substantially — past checklist items won't carry over.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-white/[0.08] text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}
          >
            Yes, Regenerate
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function RoadmapTimeline({
  roadmap,
  roadmapState,
  weekStatuses,
  pendingAdjustment,
  onChecklistToggle,
  onExtend,
  onCompress,
  onDismiss,
  onRegenerate,
  isCompressing,
  compressionError,
  scrollToWeek,
  getWeekProgress,
  getOverallProgress,
  isItemDone,
}) {
  const [expandedWeeks, setExpandedWeeks] = useState(new Set());
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const weekRefs = useRef({});

  // Auto-expand + scroll to a specific week on mount (from LoginProgressSummary click)
  useEffect(() => {
    if (scrollToWeek == null) return;
    setExpandedWeeks((prev) => new Set([...prev, scrollToWeek]));
    setTimeout(() => {
      weekRefs.current[scrollToWeek]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  }, [scrollToWeek]);

  // Auto-expand current week on first load
  useEffect(() => {
    const currentWeek = roadmap.weeks.find((w) => {
      const st = weekStatuses[w.weekNumber];
      return st?.calendarStatus === "current" || st?.calendarStatus === "overdue";
    });
    if (currentWeek) {
      setExpandedWeeks((prev) => new Set([...prev, currentWeek.weekNumber]));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleWeek = useCallback((weekNum) => {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(weekNum)) next.delete(weekNum);
      else next.add(weekNum);
      return next;
    });
  }, []);

  const overallPct = getOverallProgress();
  const currentWeekNum = (() => {
    const today = new Date();
    let cur = roadmap.weeks[0];
    for (const w of roadmap.weeks) {
      if (new Date(w.calendarStartDate) <= today) cur = w;
      else break;
    }
    return cur?.weekNumber ?? 1;
  })();

  const totalWeeks = roadmap.weeks.length;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* ── Global progress header ───────────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-xl font-bold text-white">
              {roadmap.goalInput.targetRole} Roadmap
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {roadmap.goalInput.targetCompany !== "generic"
                ? `Targeting ${roadmap.goalInput.targetCompany.charAt(0).toUpperCase() + roadmap.goalInput.targetCompany.slice(1)}`
                : "General industry plan"}{" "}
              · {totalWeeks} weeks · {roadmap.goalInput.weeklyHours} hrs/week
            </p>
          </div>

          <button
            onClick={() => setShowRegenerateModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-white/[0.08] text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition-all"
          >
            <RefreshCw size={12} />
            Regenerate
          </button>
        </div>

        {/* Overall progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #8b5cf6, #ec4899)" }}
              initial={{ width: 0 }}
              animate={{ width: `${overallPct}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <span className="text-xs text-slate-400 flex-shrink-0">
            Week {currentWeekNum} of {totalWeeks} · {overallPct}%
          </span>
        </div>

        {/* Mock interview badge */}
        {roadmap.mockInterviewStartWeek && currentWeekNum < roadmap.mockInterviewStartWeek && (
          <p className="text-xs text-rose-400/80 mt-2 flex items-center gap-1.5">
            <Trophy size={11} />
            Mock interviews start Week {roadmap.mockInterviewStartWeek}
          </p>
        )}
      </div>

      {/* ── Adjustment banner (behind/ahead) ─────────────────────────────── */}
      <AdjustmentBanner
        adjustment={pendingAdjustment}
        onExtend={onExtend}
        onCompress={onCompress}
        onDismiss={onDismiss}
        isCompressing={isCompressing}
        compressionError={compressionError}
      />

      {/* ── Why this plan ────────────────────────────────────────────────── */}
      <WhyThisPlan
        text={roadmap.whyThisPlan}
        goalInput={roadmap.goalInput}
        skillProfile={roadmap.skillProfile}
        companyProfile={null} // passed from parent if needed
      />

      {/* ── Week cards (vertical timeline) ───────────────────────────────── */}
      <div>
        {roadmap.weeks.map((week, idx) => {
          const st = weekStatuses[week.weekNumber] ?? {};
          return (
            <div
              key={week.weekNumber}
              ref={(el) => { weekRefs.current[week.weekNumber] = el; }}
            >
              <WeekCard
                week={week}
                status={st.calendarStatus ?? "upcoming"}
                checklistPct={getWeekProgress(week.weekNumber)}
                expanded={expandedWeeks.has(week.weekNumber)}
                onToggleExpand={() => toggleWeek(week.weekNumber)}
                onChecklistToggle={onChecklistToggle}
                isItemDone={isItemDone}
                isMockWeekStart={week.weekNumber === roadmap.mockInterviewStartWeek}
                isLast={idx === roadmap.weeks.length - 1}
              />
            </div>
          );
        })}
      </div>

      {/* ── Footer note ──────────────────────────────────────────────────── */}
      <div className="mt-6 pt-4 border-t border-white/[0.06] text-xs text-slate-600 text-center leading-relaxed">
        Progress saved locally.{" "}
        <span className="italic">
          v1 limitation: data is device-specific and will be lost if browser cache is cleared.
        </span>
      </div>

      {/* ── Regenerate modal ─────────────────────────────────────────────── */}
      {showRegenerateModal && (
        <RegenerateModal
          onConfirm={() => { setShowRegenerateModal(false); onRegenerate(); }}
          onCancel={() => setShowRegenerateModal(false)}
        />
      )}
    </div>
  );
}
