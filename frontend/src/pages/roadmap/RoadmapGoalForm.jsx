/**
 * RoadmapGoalForm.jsx
 * Step 1 of the Career Roadmap flow.
 * Collects GoalInput fields, validates, and calls onSubmit(goalInput).
 *
 * Props:
 *   initialValues?  {GoalInput}   — pre-fill if user is editing
 *   onSubmit        {fn(GoalInput)} — advance to Step 2
 */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Map, AlertTriangle, Info } from "lucide-react";
import {
  TARGET_ROLES,
  DURATION_OPTIONS,
  WEEKLY_HOURS_OPTIONS,
} from "./roadmapTypes.js";
import { COMPANY_OPTIONS } from "./company_profiles.js";

// ── Shared mini-components (matching existing app style) ─────────────────────
function Label({ children }) {
  return (
    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
      {children}
    </p>
  );
}

function SelectField({ value, onChange, options, placeholder }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none focus:border-indigo-500/50 transition-colors appearance-none cursor-pointer"
      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='%2394a3b8'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}
    >
      {placeholder && <option value="" disabled>{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value ?? o} value={o.value ?? o}>
          {o.label ?? o}
        </option>
      ))}
    </select>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200"
      style={
        active
          ? { background: "rgba(139,92,246,0.2)", borderColor: "rgba(139,92,246,0.5)", color: "#c4b5fd", boxShadow: "0 0 12px rgba(139,92,246,0.2)" }
          : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)", color: "#64748b" }
      }
    >
      {children}
    </button>
  );
}

// ── Unrealistic timeline warning heuristic ────────────────────────────────────
// Runs BEFORE skill assessment; uses conservative defaults.
// More accurate warning shown after skill assessment in RoadmapPage.
function getBasicTimelineWarning(goalInput) {
  const { durationMonths, weeklyHours, track, targetRole } = goalInput;

  const isTight =
    (durationMonths === 1 && track === "fulltime") ||
    (durationMonths <= 2 && weeklyHours === "5-10" && track === "fulltime") ||
    (durationMonths === 1 && ["SDE 2", "SDE 3"].includes(targetRole));

  if (!isTight) return null;

  const suggestedMin = durationMonths === 1 ? 3 : 4;
  return {
    message: `${durationMonths} month${durationMonths > 1 ? "s" : ""} is an aggressive timeline for a ${track === "fulltime" ? "full-time" : "internship"} ${targetRole} role. A ${suggestedMin}–6 month plan gives more realistic depth — but you can proceed if your timeline is fixed.`,
    suggestedMin,
  };
}

export default function RoadmapGoalForm({ initialValues, onSubmit }) {
  const [form, setForm] = useState({
    targetRole:     initialValues?.targetRole     ?? "SDE 1",
    targetCompany:  initialValues?.targetCompany  ?? "generic",
    track:          initialValues?.track          ?? "fulltime",
    durationMonths: initialValues?.durationMonths ?? 3,
    weeklyHours:    initialValues?.weeklyHours    ?? "10-20",
  });

  const [companySearch, setCompanySearch] = useState(
    COMPANY_OPTIONS.find((c) => c.value === (initialValues?.targetCompany ?? "generic"))?.label ?? "Any / Not sure yet"
  );
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const filteredCompanies = COMPANY_OPTIONS.filter((c) =>
    c.label.toLowerCase().includes(companySearch.toLowerCase())
  );

  const timelineWarning = getBasicTimelineWarning(form);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className="mx-auto max-w-2xl px-4 py-10"
    >
      {/* Hero */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold text-purple-300 mb-4">
          <Map size={12} />
          Personalized week-by-week roadmap
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
          Career{" "}
          <span className="text-gradient" style={{ "--grad-from": "#8b5cf6", "--grad-to": "#ec4899" }}>
            Roadmap
          </span>
        </h1>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Tell us your goal. We'll build a personalized preparation plan and track your progress week by week.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div
          className="rounded-2xl border border-white/[0.08] p-6 space-y-6"
          style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(12px)" }}
        >

          {/* Target Role */}
          <div>
            <Label>Target Role</Label>
            <SelectField
              value={form.targetRole}
              onChange={(v) => set("targetRole", v)}
              options={TARGET_ROLES.map((r) => ({ value: r, label: r }))}
            />
          </div>

          {/* Target Company — autocomplete dropdown */}
          <div className="relative">
            <Label>Target Company</Label>
            <input
              type="text"
              value={companySearch}
              onChange={(e) => { setCompanySearch(e.target.value); setShowCompanyDropdown(true); }}
              onFocus={() => setShowCompanyDropdown(true)}
              onBlur={() => setTimeout(() => setShowCompanyDropdown(false), 150)}
              placeholder="Search company or pick 'Any / Not sure yet'…"
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none focus:border-indigo-500/50 transition-colors"
            />
            {showCompanyDropdown && filteredCompanies.length > 0 && (
              <div
                className="absolute z-20 mt-1 w-full rounded-xl border border-white/[0.08] overflow-hidden shadow-2xl"
                style={{ background: "#141420" }}
              >
                {filteredCompanies.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onMouseDown={() => {
                      set("targetCompany", c.value);
                      setCompanySearch(c.label);
                      setShowCompanyDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/[0.06] transition-colors"
                  >
                    {c.label}
                    {c.value === "generic" && (
                      <span className="ml-2 text-xs text-slate-600">(uses general industry profile)</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Track */}
          <div>
            <Label>Track</Label>
            <div className="flex gap-3">
              {[
                { val: "internship", label: "🎓 Internship", desc: "Fundamentals + potential" },
                { val: "fulltime",   label: "💼 Full-Time",   desc: "Production-readiness" },
              ].map(({ val, label, desc }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => set("track", val)}
                  className="flex-1 rounded-xl border p-3 text-left transition-all duration-200"
                  style={
                    form.track === val
                      ? { borderColor: "rgba(139,92,246,0.5)", background: "rgba(139,92,246,0.1)", color: "#c4b5fd" }
                      : { borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", color: "#64748b" }
                  }
                >
                  <div className="text-sm font-semibold">{label}</div>
                  <div className="text-xs mt-0.5 opacity-70">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <Label>Preparation Duration</Label>
            <div className="flex flex-wrap gap-2">
              {DURATION_OPTIONS.map((n) => (
                <Chip key={n} active={form.durationMonths === n} onClick={() => set("durationMonths", n)}>
                  {n} {n === 1 ? "month" : "months"}
                </Chip>
              ))}
            </div>
          </div>

          {/* Weekly Hours */}
          <div>
            <Label>Weekly Time Commitment</Label>
            <div className="flex gap-2 flex-wrap">
              {WEEKLY_HOURS_OPTIONS.map((h) => (
                <Chip key={h} active={form.weeklyHours === h} onClick={() => set("weeklyHours", h)}>
                  {h} hrs/week
                </Chip>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-600">
              This determines the week-by-week density — an honest estimate gives a more realistic plan.
            </p>
          </div>

          {/* Timeline warning */}
          {timelineWarning && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/8 px-4 py-3">
              <AlertTriangle size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-300/90 leading-relaxed">
                {timelineWarning.message}
              </p>
            </div>
          )}

          {/* Info note */}
          <div className="flex items-start gap-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-4 py-3">
            <Info size={14} className="text-indigo-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-indigo-300/80 leading-relaxed">
              Next step: a short self-assessment so the roadmap reflects your actual starting point, not a generic template.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-white transition-all"
            style={{
              background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
              boxShadow: "0 0 24px rgba(139,92,246,0.35)",
            }}
          >
            Continue to Self-Assessment
            <ChevronRight size={16} />
          </button>
        </div>
      </form>
    </motion.div>
  );
}
