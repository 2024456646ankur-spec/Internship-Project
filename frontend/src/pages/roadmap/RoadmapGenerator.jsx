/**
 * RoadmapGenerator.jsx
 * Constructs the LLM prompt from GoalInput + SkillProfile + company profile,
 * calls the existing /chat backend, parses the JSON response into a Roadmap.
 *
 * API: POST /chat — same endpoint used by PublicSpeakingPage and the main chat.
 *   ChatRequest requires a REAL conversation_id (str, no default) — the backend
 *   uses it to fetch conversation history and check ownership, so we must create
 *   a conversation first via POST /conversation, then use its returned id.
 *   Body: { message: string, conversation_id: string }
 *   Response: { response: string } — expected to contain JSON roadmap
 *
 * Props:
 *   goalInput       {GoalInput}
 *   skillProfile    {SkillProfile}
 *   companyProfile  {object}       — from company_profiles.js
 *   usedFallback    {boolean}      — true if company fell back to generic
 *   onGenerated     {fn(Roadmap)}
 *   onError         {fn(string)}
 */
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, RefreshCw, AlertCircle, Map, Sparkles } from "lucide-react";
import { getMinRecommendedMonths } from "./roadmapTypes.js";
import { isProfileStale } from "./company_profiles.js";

const API = "http://127.0.0.1:8000";

// ─── Prompt construction ──────────────────────────────────────────────────────
function buildPrompt(goalInput, skillProfile, companyProfile) {
  const totalWeeks = goalInput.durationMonths * 4;

  // Pillar summary for the prompt
  const pillarLines = Object.entries(skillProfile.pillars)
    .map(([key, { level }]) => `  - ${key}: ${level}`)
    .join("\n");

  const langLine =
    skillProfile.language
      ? `Primary language: ${skillProfile.language.name} (${skillProfile.language.level})`
      : "";

  // Compact company context to avoid token waste
  const companyContext = JSON.stringify({
    company: companyProfile.displayName,
    dsa_weighting: companyProfile.dsa_weighting,
    system_design_expected: companyProfile.system_design_expected,
    known_focus_areas: companyProfile.known_focus_areas.slice(0, 3),
    leadership_principles: companyProfile.leadership_principles
      ? "(Amazon-style LPs — heavy behavioral prep required)"
      : null,
    prep_focus:
      companyProfile.prep_focus_for_role?.[
        goalInput.track === "internship" ? "sde_intern" : "sde1_fulltime"
      ] ?? [],
  }, null, 2);

  const finalWeeksCount = totalWeeks <= 4 ? 1 : totalWeeks <= 12 ? 2 : 2;

  return `You are a senior engineering career coach. Generate a personalized, week-by-week interview preparation roadmap in strict JSON format.

== USER GOAL ==
Role: ${goalInput.targetRole} (${goalInput.track === "internship" ? "Internship" : "Full-Time"})
Company: ${companyProfile.displayName}
Duration: ${goalInput.durationMonths} month(s) = ${totalWeeks} weeks total
Weekly commitment: ${goalInput.weeklyHours} hours/week

== SKILL PROFILE ==
Track: ${skillProfile.role_track}
${langLine}
Pillar ratings:
${pillarLines}

== COMPANY CONTEXT ==
${companyContext}

== GENERATION RULES ==
1. Beginner pillars get MORE weeks, start from FIRST PRINCIPLES (e.g., DSA-beginner starts with arrays/strings/complexity before trees/graphs).
2. Advanced pillars get COMPRESSED — skip theory entirely, go straight to timed mixed problem sets.
3. Intermediate pillars: spend moderate time, fill specific known gaps.
4. Allocate weeks proportionally: weight beginner pillars by their company emphasis (dsa_weighting=very_high means DSA gets most weeks for a beginner).
5. The final ${finalWeeksCount} week(s) MUST be "Resume Polish & Mock Interview Intensive" regardless of what's behind schedule — this cannot be crowded out.
6. mockInterviewStartWeek should be around 60-70% through the total weeks.
7. Resources must be REAL and SPECIFIC (e.g., "CTCI Chapter 4", "Neetcode 150", "MIT 6.006 lectures", "Designing Data-Intensive Applications Chapter 5") — never invent fake resource names.
8. Practice targets must be SPECIFIC (e.g., "20 LeetCode medium array/string problems, focus on two-pointer tag" not "practice arrays").
9. checklistItems derive from the milestone — make them concrete and verifiable.
10. whyThisPlan must be 3-4 sentences explaining the week allocation logic for THIS user's specific inputs.

== STRICT JSON OUTPUT (no markdown, no explanation, just JSON) ==
{
  "whyThisPlan": "...",
  "mockInterviewStartWeek": <number>,
  "weeks": [
    {
      "weekNumber": 1,
      "theme": "...",
      "topics": ["...", "..."],
      "resources": ["...", "..."],
      "practiceTargets": ["...", "..."],
      "tools": ["...", "..."],
      "milestone": "By end of this week you should be able to ...",
      "checklistItems": [
        { "id": "w1_c1", "label": "...", "done": false },
        { "id": "w1_c2", "label": "...", "done": false }
      ]
    }
  ]
}

Generate all ${totalWeeks} weeks. Return ONLY valid JSON.`;
}

// ─── JSON parser with fence-stripping fallback ────────────────────────────────
function parseRoadmapResponse(rawText) {
  // Attempt 1: direct parse
  try {
    return JSON.parse(rawText);
  } catch {}

  // Attempt 2: strip markdown code fences
  const stripped = rawText
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();
  try {
    return JSON.parse(stripped);
  } catch {}

  // Attempt 3: find first { ... } block
  const match = rawText.match(/\{[\s\S]+\}/);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch {}
  }

  return null;
}

// ─── Assign calendar dates to weeks ──────────────────────────────────────────
function assignCalendarDates(weeks, startDate = new Date()) {
  return weeks.map((week, idx) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + idx * 7);
    return {
      ...week,
      calendarStartDate: d.toISOString().split("T")[0],
    };
  });
}

// ─── Ensure we have a real conversation_id before calling /chat ──────────────
// The backend's ChatRequest.conversation_id is a required `str` with no default,
// and the /chat handler uses it to create_message() / get_messages() against a
// real Conversation row. Sending null (or a made-up id) fails validation or
// 404s, so we create a conversation first and reuse its id for this session.
//
// Exported so other flows that need to hit /chat (e.g. ProgressTracker's
// compression flow) reuse this exact logic instead of reimplementing it —
// a previous bug came from a second, incorrect copy that sent conversation_id: null.
//
// forceNew=true skips the sessionStorage cache and always creates a fresh
// conversation. Used as a self-heal when the cached id turns out to be stale
// (e.g. backend restarted / DB reset / conversation was deleted server-side).
export async function ensureConversationId(headers, forceNew = false) {
  const cached = sessionStorage.getItem("friday.roadmapConversationId");
  if (cached && !forceNew) {
    console.log("[RoadmapGenerator] using cached conversation_id:", cached);
    return cached;
  }

  console.log("[RoadmapGenerator] creating new conversation...");
  const res = await fetch(`${API}/conversation`, {
    method: "POST",
    headers,
    body: JSON.stringify({ title: "Career Roadmap" }),
  });

  if (!res.ok) {
    // Most common cause here: 401 — /conversation requires a logged-in user
    // (get_optional_user still returns None for an invalid/expired token,
    // and the route explicitly rejects that case with 401).
    if (res.status === 401) {
      throw new Error("Please sign in to generate a roadmap — conversations are saved to your account.");
    }
    throw new Error(`Couldn't start a session: ${res.status}`);
  }

  const data = await res.json();
  console.log("[RoadmapGenerator] /conversation response:", data);

  // Defensive: different backend response shapes have been seen in this repo
  // (bare {id}, {conversation_id}, or nested {conversation: {id}}). If your
  // backend always returns one specific shape, feel free to simplify this
  // to just `data.id`.
  const newId = data.id ?? data.conversation_id ?? data.conversation?.id;
  if (!newId) {
    throw new Error("Backend didn't return a conversation id — check the /conversation response shape.");
  }

  sessionStorage.setItem("friday.roadmapConversationId", newId);
  return newId;
}

// ─── Loading state UI ─────────────────────────────────────────────────────────
function LoadingState({ stage }) {
  const stages = [
    { label: "Analysing your skill profile", done: stage >= 1 },
    { label: "Allocating weeks across pillars", done: stage >= 2 },
    { label: "Generating week-by-week plan", done: stage >= 3 },
    { label: "Building checklist items", done: stage >= 4 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-lg px-4 py-20 flex flex-col items-center text-center"
    >
      {/* Animated orb */}
      <div
        className="w-24 h-24 rounded-full mb-8 flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
          boxShadow: "0 0 48px rgba(139,92,246,0.5)",
          animation: "float 3.5s ease-in-out infinite",
        }}
      >
        <Map size={32} className="text-white" />
      </div>

      <h2 className="text-xl font-bold text-white mb-2">Building your roadmap…</h2>
      <p className="text-slate-400 text-sm mb-8">
        Personalising based on your goal and skill profile
      </p>

      <div className="w-full space-y-3">
        {stages.map((s, i) => (
          <div key={i} className="flex items-center gap-3 text-sm">
            <div
              className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
              style={{
                background: s.done ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.05)",
                border: s.done ? "1px solid rgba(139,92,246,0.5)" : "1px solid rgba(255,255,255,0.08)",
                transition: "all 0.3s",
              }}
            >
              {s.done ? (
                <Sparkles size={10} className="text-purple-400" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
              )}
            </div>
            <span className={s.done ? "text-slate-300" : "text-slate-600"}>
              {s.label}
            </span>
            {i === stage - 1 && !s.done && (
              <Loader2 size={13} className="text-indigo-400 animate-spin ml-auto" />
            )}
          </div>
        ))}
      </div>

      <style>{`@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }`}</style>
    </motion.div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function RoadmapGenerator({
  goalInput,
  skillProfile,
  companyProfile,
  usedFallback,
  onGenerated,
  onError,
}) {
  const [loadingStage, setLoadingStage] = useState(0);
  const [error, setError] = useState(null);
  const hasRun = useRef(false);

  // Warn if timeline may be unrealistic given skill profile
  const minRecommended = getMinRecommendedMonths(goalInput, skillProfile);
  const timelineTight = goalInput.durationMonths < minRecommended;

  // Show staleness disclaimer if company data is old
  const stale = isProfileStale(companyProfile?.last_updated);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    generate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const generate = async () => {
    setError(null);
    setLoadingStage(1);

    try {
      const prompt = buildPrompt(goalInput, skillProfile, companyProfile);

      setLoadingStage(2);
      const token = localStorage.getItem("access_token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      // Backend requires a real conversation_id (str, required, no default) —
      // create one (or reuse this tab's cached one) before calling /chat.
      let conversationId = await ensureConversationId(headers);

      setLoadingStage(3);
      let res = await fetch(`${API}/chat`, {
        method: "POST",
        headers,
        body: JSON.stringify({ message: prompt, conversation_id: conversationId }),
      });

      // Self-heal: if the cached conversation_id is stale (e.g. backend was
      // restarted / DB reset / conversation deleted server-side), the cache
      // will keep returning the same dead id forever unless we clear it and
      // retry once with a freshly created conversation.
      if (res.status === 404) {
        console.warn(
          "[RoadmapGenerator] /chat 404'd for cached conversation_id, retrying with a new conversation:",
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
        // Surface the backend's actual validation/error detail instead of
        // just the status code, so failures are debuggable from the UI.
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
      const rawText = data.response || data.message || data.content || "";

      setLoadingStage(4);
      const parsed = parseRoadmapResponse(rawText);

      if (!parsed || !Array.isArray(parsed.weeks) || parsed.weeks.length === 0) {
        throw new Error("The AI returned an unexpected format. Please try generating again.");
      }

      // Assign calendar dates starting from today
      const weeksWithDates = assignCalendarDates(parsed.weeks);

      const roadmap = {
        goalInput,
        skillProfile,
        whyThisPlan: parsed.whyThisPlan ?? "Roadmap generated based on your inputs.",
        weeks: weeksWithDates,
        mockInterviewStartWeek: parsed.mockInterviewStartWeek ?? Math.ceil(weeksWithDates.length * 0.65),
        createdAt: new Date().toISOString(),
        lastRegeneratedAt: null,
      };

      onGenerated(roadmap);
    } catch (err) {
      console.error("[RoadmapGenerator]", err);
      const msg = err.message ?? "Unknown error during generation.";
      setError(msg);
      onError?.(msg);
    }
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mx-auto max-w-lg px-4 py-16 flex flex-col items-center text-center"
      >
        <AlertCircle size={36} className="text-red-400 mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">Generation failed</h3>
        <p className="text-slate-400 text-sm mb-6">{error}</p>
        <button
          onClick={() => { hasRun.current = false; generate(); setError(null); }}
          className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all"
          style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}
        >
          <RefreshCw size={15} />
          Try Again
        </button>
      </motion.div>
    );
  }

  return (
    <div>
      {/* Disclaimers above loading state */}
      <div className="mx-auto max-w-lg px-4 pt-8 space-y-3">
        {timelineTight && (
          <div
            className="rounded-xl border border-amber-500/30 bg-amber-500/8 px-4 py-3 text-xs text-amber-300/90 leading-relaxed"
          >
            ⚠️ Based on your self-assessment, {goalInput.durationMonths} month(s) is tight for this goal.
            A more realistic timeline is {minRecommended}–{Math.min(minRecommended + 2, 12)} months.
            We're generating the plan anyway — it will focus on the highest-impact topics given your constraint.
          </div>
        )}
        {usedFallback && (
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-4 py-3 text-xs text-indigo-300/80 leading-relaxed">
            ℹ️ We don't have specific data for that company yet — using a general industry hiring bar as a baseline.
          </div>
        )}
        {stale && !usedFallback && (
          <div className="rounded-xl border border-slate-600/30 bg-slate-600/5 px-4 py-3 text-xs text-slate-400 leading-relaxed">
            📅 Company data last verified {companyProfile.last_updated} — processes can change. Treat company-specific guidance as directional.
          </div>
        )}
      </div>

      <LoadingState stage={loadingStage} />
    </div>
  );
}