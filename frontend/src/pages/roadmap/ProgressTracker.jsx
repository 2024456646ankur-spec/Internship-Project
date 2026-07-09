/**
 * ProgressTracker.jsx
 * Pure logic hook — no rendering. Provides behind/ahead detection and adjustment actions.
 *
 * Usage:
 *   const tracker = useProgressTracker({ roadmapState, getWeekProgress,
 *                                        extendTimeline, replaceRemainingWeeks });
 *
 * Returns:
 *   { weekStatuses, currentWeekStatus, adjustmentOffer, handleExtend,
 *     handleCompress, handleDismiss, isCompressing }
 */
import { useState, useCallback, useMemo } from "react";
import { ensureConversationId } from "./RoadmapGenerator.jsx";

const API = "http://127.0.0.1:8000";

// ── Week status classifier ────────────────────────────────────────────────────
// calendarStatus: "upcoming" | "current" | "overdue" | "complete"
export function classifyWeek(week, checklistPct, today = new Date()) {
  const start = new Date(week.calendarStartDate);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  if (checklistPct >= 100) return "complete";
  if (today < start) return "upcoming";
  if (today >= start && today < end) return "current";
  return "overdue"; // past end date, not 100% done
}

// ── Behind/ahead thresholds ───────────────────────────────────────────────────
const BEHIND_THRESHOLD_PCT = 100;  // overdue AND <100% → behind
const AHEAD_DAYS_REMAINING = 2;    // current week, 100% done, ≥2 days left → ahead

function getDaysRemainingInWeek(week) {
  const start = new Date(week.calendarStartDate);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  return Math.max(0, Math.ceil((end - new Date()) / (1000 * 60 * 60 * 24)));
}

// ── LLM compression prompt ────────────────────────────────────────────────────
// NOTE: previously this sent conversation_id: null directly, which the backend
// rejects (ChatRequest.conversation_id is a required str with no default) —
// that caused the "Conversation not found" 404s from the Compress flow.
// Now reuses the same ensureConversationId() helper RoadmapGenerator uses,
// including its stale-cache self-heal on a 404 retry below.
async function requestCompression(roadmap, currentWeekNumber) {
  const remainingWeeks = roadmap.weeks.filter((w) => w.weekNumber >= currentWeekNumber);
  const originalEndDate = roadmap.weeks[roadmap.weeks.length - 1]?.calendarStartDate;

  const prompt = `You are a career coach. A student is behind on their interview preparation roadmap.

Original remaining weeks (${remainingWeeks.length} weeks):
${remainingWeeks.map((w) => `Week ${w.weekNumber}: ${w.theme}`).join("\n")}

They want to keep the original end date (${originalEndDate}) but have fallen behind.
Generate a COMPRESSED version of these remaining weeks that fits the same timeframe.
Be explicit about what is being deprioritized or merged.

Return ONLY valid JSON (no markdown):
{
  "compressionNote": "1-2 sentences explaining what was cut and why",
  "weeks": [
    {
      "weekNumber": <number>,
      "theme": "...",
      "topics": ["..."],
      "resources": ["..."],
      "practiceTargets": ["..."],
      "tools": ["..."],
      "milestone": "...",
      "calendarStartDate": "YYYY-MM-DD",
      "checklistItems": [{"id": "wN_c1", "label": "...", "done": false}]
    }
  ]
}`;

  const token = localStorage.getItem("access_token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  // Get a REAL conversation_id (creates one or reuses the cached one) —
  // this was the bug: it used to send conversation_id: null here.
  let conversationId = await ensureConversationId(headers);

  let res = await fetch(`${API}/chat`, {
    method: "POST",
    headers,
    body: JSON.stringify({ message: prompt, conversation_id: conversationId }),
  });

  // Same self-heal as RoadmapGenerator: a stale cached conversation_id
  // (e.g. backend restarted / DB reset) would otherwise 404 forever.
  if (res.status === 404) {
    console.warn(
      "[ProgressTracker] /chat 404'd for cached conversation_id, retrying with a new conversation:",
      conversationId
    );
    sessionStorage.removeItem("friday.roadmapConversationId");
    conversationId = await ensureConversationId(headers, /* forceNew */ true);

    res = await fetch(`${API}/chat`, {
      method: "POST",
      headers,
      body: JSON.stringify({ message: prompt, conversation_id: conversationId }),
    });
  }

  if (!res.ok) {
    let detail = "";
    try {
      const errBody = await res.json();
      detail = errBody?.detail
        ? (Array.isArray(errBody.detail) ? JSON.stringify(errBody.detail) : errBody.detail)
        : (errBody?.response ?? "");
    } catch {}
    throw new Error(`Server error: ${res.status}${detail ? ` — ${detail}` : ""}`);
  }

  const data = await res.json();
  const raw = data.response || data.message || "";

  // Strip fences + parse
  const stripped = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();
  try {
    return JSON.parse(stripped);
  } catch {
    const match = raw.match(/\{[\s\S]+\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("Could not parse compression response");
  }
}

// ── Main hook ─────────────────────────────────────────────────────────────────
export function useProgressTracker({
  roadmapState,
  getWeekProgress,
  extendTimeline,
  replaceRemainingWeeks,
}) {
  const [adjustmentOffer, setAdjustmentOffer] = useState(null); // { type: "behind"|"ahead", week }
  const [dismissedWeeks, setDismissedWeeks] = useState(new Set());
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionError, setCompressionError] = useState(null);

  const roadmap = roadmapState?.roadmap;
  const today = useMemo(() => new Date(), []);

  // ── Compute per-week status ────────────────────────────────────────────────
  const weekStatuses = useMemo(() => {
    if (!roadmap) return {};
    const result = {};
    roadmap.weeks.forEach((week) => {
      const pct = getWeekProgress(week.weekNumber);
      const calendarStatus = classifyWeek(week, pct, today);
      const daysLeft = getDaysRemainingInWeek(week);
      result[week.weekNumber] = { calendarStatus, checklistPct: pct, daysLeft };
    });
    return result;
  }, [roadmap, getWeekProgress, today]);

  // ── Find first "attention-needed" week ────────────────────────────────────
  const currentWeekStatus = useMemo(() => {
    if (!roadmap) return null;
    for (const week of roadmap.weeks) {
      const st = weekStatuses[week.weekNumber];
      if (!st) continue;
      if (st.calendarStatus === "current") return { week, ...st };
    }
    return null;
  }, [roadmap, weekStatuses]);

  // ── Detect behind/ahead for an offer (first actionable, non-dismissed) ────
  const pendingAdjustment = useMemo(() => {
    if (!roadmap) return null;
    for (const week of roadmap.weeks) {
      const st = weekStatuses[week.weekNumber];
      if (!st || dismissedWeeks.has(week.weekNumber)) continue;
      if (st.calendarStatus === "overdue" && st.checklistPct < BEHIND_THRESHOLD_PCT) {
        return { type: "behind", week, ...st };
      }
      if (
        st.calendarStatus === "current" &&
        st.checklistPct >= 100 &&
        st.daysLeft >= AHEAD_DAYS_REMAINING
      ) {
        return { type: "ahead", week, ...st };
      }
    }
    return null;
  }, [roadmap, weekStatuses, dismissedWeeks]);

  // ── Extend timeline ────────────────────────────────────────────────────────
  const handleExtend = useCallback((weekNum) => {
    // Calculate how many weeks overdue → push by that many weeks (7 days each)
    const overdueWeeks = roadmap.weeks.filter((w) => {
      const st = weekStatuses[w.weekNumber];
      return st?.calendarStatus === "overdue";
    }).length;
    extendTimeline(overdueWeeks * 7);
    setDismissedWeeks((prev) => new Set([...prev, weekNum]));
  }, [roadmap, weekStatuses, extendTimeline]);

  // ── Compress remaining plan (LLM call) ───────────────────────────────────
  const handleCompress = useCallback(async (currentWeekNumber) => {
    if (!roadmap) return;
    setIsCompressing(true);
    setCompressionError(null);
    try {
      const result = await requestCompression(roadmap, currentWeekNumber);
      if (!Array.isArray(result.weeks)) throw new Error("Invalid compression response");
      replaceRemainingWeeks(currentWeekNumber, result.weeks);
      setDismissedWeeks((prev) => new Set([...prev, currentWeekNumber]));
    } catch (err) {
      setCompressionError(err.message ?? "Compression failed — try extending instead.");
    } finally {
      setIsCompressing(false);
    }
  }, [roadmap, replaceRemainingWeeks]);

  // ── Dismiss adjustment for this week ─────────────────────────────────────
  const handleDismiss = useCallback((weekNum) => {
    setDismissedWeeks((prev) => new Set([...prev, weekNum]));
  }, []);

  return {
    weekStatuses,
    currentWeekStatus,
    pendingAdjustment,
    handleExtend,
    handleCompress,
    handleDismiss,
    isCompressing,
    compressionError,
  };
}

// ── AdjustmentBanner — rendered inside RoadmapTimeline ───────────────────────
export function AdjustmentBanner({ adjustment, onExtend, onCompress, onDismiss, isCompressing, compressionError }) {
  if (!adjustment) return null;

  const isBehind = adjustment.type === "behind";
  const weekNum = adjustment.week.weekNumber;

  return (
    <div
      className="rounded-2xl border p-4 mb-6"
      style={
        isBehind
          ? { borderColor: "rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.05)" }
          : { borderColor: "rgba(52,211,153,0.3)", background: "rgba(52,211,153,0.05)" }
      }
    >
      <div className="flex items-start gap-3">
        <div className="text-lg flex-shrink-0">{isBehind ? "⚠️" : "🚀"}</div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white mb-1">
            {isBehind
              ? `You're behind on Week ${weekNum} — ${adjustment.checklistPct}% of checklist done`
              : `You're ahead of Week ${weekNum} — fully checked off with ${adjustment.daysLeft} days left`}
          </p>
          <p className="text-xs text-slate-400 mb-3">
            {isBehind
              ? "Choose how you'd like to handle this:"
              : "Would you like to pull the next week forward?"}
          </p>

          {compressionError && (
            <p className="text-xs text-red-400 mb-2">{compressionError}</p>
          )}

          <div className="flex flex-wrap gap-2">
            {isBehind && (
              <>
                <button
                  onClick={() => onExtend(weekNum)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-all"
                >
                  📅 Extend Timeline
                </button>
                <button
                  onClick={() => onCompress(weekNum)}
                  disabled={isCompressing}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border border-purple-500/40 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition-all disabled:opacity-40"
                >
                  {isCompressing ? "Compressing…" : "⚡ Compress Remaining Plan"}
                </button>
                <button
                  onClick={() => onDismiss(weekNum)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/[0.08] text-slate-400 hover:text-slate-200 transition-all"
                >
                  ✓ I caught up
                </button>
              </>
            )}
            {!isBehind && (
              <>
                <button
                  onClick={() => onExtend(weekNum)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 transition-all"
                >
                  ⚡ Pull Weeks Forward
                </button>
                <button
                  onClick={() => onDismiss(weekNum)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/[0.08] text-slate-400 hover:text-slate-200 transition-all"
                >
                  Keep Current Pace
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}