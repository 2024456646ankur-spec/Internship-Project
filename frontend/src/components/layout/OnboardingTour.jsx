/**
 * OnboardingTour.jsx
 * First-run guided tour of the sidebar for new signups.
 *
 * Behavior:
 *   - Shows automatically once, the first time a signed-in user reaches the
 *     app, gated by localStorage key "friday.onboardingComplete.v1".
 *   - User-advanced only (click "Next" / "Skip tour"), no auto-play timers.
 *   - Spotlights a real DOM element (found via data-tour="<step.target>")
 *     with a dimmed backdrop everywhere else, and a tooltip card describing
 *     that part of the UI.
 *   - Recomputes the spotlight position on resize/scroll so it stays locked
 *     to the real element rather than a frozen snapshot.
 *
 * Wiring required in Sidebar.jsx (already applied):
 *   data-tour="new-chat"        on the "+ New chat" button
 *   data-tour="practice"        on the Practice section wrapper div
 *   data-tour="career-roadmap"  on the Career Roadmap practice button
 *   data-tour="account"         on the account/profile button at the bottom
 *
 * Usage (already wired into App.jsx-equivalent, see integration note at
 * bottom of this file):
 *   <OnboardingTour />
 * Render it once, anywhere inside the same tree as the sidebar, after the
 * user is authenticated and the sidebar has mounted.
 */
import React, { useState, useEffect, useCallback, useLayoutEffect } from "react";

const STORAGE_KEY = "friday.onboardingComplete.v1";

// ── Step definitions ──────────────────────────────────────────────────────
// Each target must match a data-tour attribute present in the real DOM.
// If a target isn't found (e.g. sidebar collapsed, element not yet mounted),
// that step is skipped automatically rather than showing a broken spotlight.
const STEPS = [
  {
    target: "new-chat",
    eyebrow: "01 · Start here",
    title: "Start a new conversation",
    body: "Click here any time to open a fresh chat with Friday. Your old conversations stay saved in the list below — nothing gets overwritten.",
    placement: "right",
  },
  {
    target: "practice",
    eyebrow: "02 · Practice tools",
    title: "Four ways to get interview-ready",
    body: "Mock interviews, a public speaking coach, quick-fire quizzes, and a personalized prep roadmap — all built into the sidebar so you're never more than a click away.",
    placement: "right",
  },
  {
    target: "career-roadmap",
    eyebrow: "03 · Your prep plan",
    title: "Build a week-by-week roadmap",
    body: "Tell Friday your target role and company, rate your own skills honestly, and get a personalized study plan with real resources and checkable milestones.",
    placement: "right",
  },
  {
    target: "account",
    eyebrow: "04 · Make it yours",
    title: "Your account lives here",
    body: "Theme, font size, response style, profile details — everything personal is one click away at the bottom of the sidebar.",
    placement: "top",
  },
];

const PAD = 10; // spotlight padding around the real element, in px

function getRectFor(targetName) {
  const el = document.querySelector(`[data-tour="${targetName}"]`);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return {
    top: r.top - PAD,
    left: r.left - PAD,
    width: r.width + PAD * 2,
    height: r.height + PAD * 2,
  };
}

export default function OnboardingTour() {
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState(null);

  // ── Decide whether to show on mount ───────────────────────────────────────
  useEffect(() => {
    let done = false;
    try {
      done = localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      done = false; // if localStorage is unavailable, fail open to "already done" — never trap the user
      done = true;
    }
    if (!done) {
      // Small delay so the sidebar has definitely painted before we measure it
      const t = setTimeout(() => setActive(true), 400);
      return () => clearTimeout(t);
    }
  }, []);

  // ── Find the next step whose target actually exists in the DOM ───────────
  const resolveStep = useCallback((fromIndex, direction = 1) => {
    let i = fromIndex;
    while (i >= 0 && i < STEPS.length) {
      const r = getRectFor(STEPS[i].target);
      if (r) return { index: i, rect: r };
      i += direction;
    }
    return null;
  }, []);

  // ── Recompute spotlight position whenever the step changes ───────────────
  useLayoutEffect(() => {
    if (!active) return;
    const resolved = resolveStep(stepIndex, 1);
    if (!resolved) {
      finish(); // nothing left to spotlight — end gracefully instead of showing a blank overlay
      return;
    }
    if (resolved.index !== stepIndex) setStepIndex(resolved.index);
    setRect(resolved.rect);
  }, [active, stepIndex, resolveStep]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Keep the spotlight locked to the element on resize/scroll ────────────
  useEffect(() => {
    if (!active) return;
    const onReflow = () => {
      const r = getRectFor(STEPS[stepIndex].target);
      if (r) setRect(r);
    };
    window.addEventListener("resize", onReflow);
    window.addEventListener("scroll", onReflow, true);
    return () => {
      window.removeEventListener("resize", onReflow);
      window.removeEventListener("scroll", onReflow, true);
    };
  }, [active, stepIndex]);

  // ── Escape key closes the tour, same as skipping ──────────────────────────
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => { if (e.key === "Escape") finish(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  const finish = () => {
    try { localStorage.setItem(STORAGE_KEY, "true"); } catch {}
    setActive(false);
  };

  const handleNext = () => {
    const next = resolveStep(stepIndex + 1, 1);
    if (!next) { finish(); return; }
    setStepIndex(next.index);
  };

  if (!active || !rect) return null;

  const step = STEPS[stepIndex];
  const isLast = resolveStep(stepIndex + 1, 1) === null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Product tour"
      style={{ position: "fixed", inset: 0, zIndex: 500 }}
    >
      {/* Dimmed backdrop with a true cutout via SVG mask — this is what lets
          the spotlight hug any element's exact size without stacking four
          separate overlay divs (top/bottom/left/right bars). */}
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <defs>
          <mask id="tour-spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <rect
              x={rect.left}
              y={rect.top}
              width={rect.width}
              height={rect.height}
              rx="14"
              fill="black"
            />
          </mask>
        </defs>
        <rect
          x="0" y="0" width="100%" height="100%"
          fill="rgba(10,10,11,0.72)"
          mask="url(#tour-spotlight-mask)"
        />
      </svg>

      {/* Glow ring around the cutout — the one "signature" flourish, kept
          to a single soft pulse rather than layered effects */}
      <div
        style={{
          position: "absolute",
          top: rect.top, left: rect.left,
          width: rect.width, height: rect.height,
          borderRadius: 14,
          border: "1.5px solid #7c3aed",
          boxShadow: "0 0 0 4px rgba(124,58,237,0.15), 0 0 24px rgba(124,58,237,0.35)",
          pointerEvents: "none",
          animation: "tourPulse 2.2s ease-in-out infinite",
          transition: "top 0.25s cubic-bezier(0.4,0,0.2,1), left 0.25s cubic-bezier(0.4,0,0.2,1), width 0.25s, height 0.25s",
        }}
      />

      {/* Click-catcher on the dimmed area only — clicking the dimmed
          backdrop skips the tour; the spotlighted element itself is
          intentionally left clickable-through-able by not covering it. */}
      <div
        onClick={finish}
        style={{ position: "absolute", inset: 0 }}
      />

      <TourCard
        rect={rect}
        step={step}
        stepNumber={stepIndex + 1}
        totalSteps={STEPS.length}
        isLast={isLast}
        onNext={handleNext}
        onSkip={finish}
      />

      <style>{`
        @keyframes tourPulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(124,58,237,0.15), 0 0 24px rgba(124,58,237,0.35); }
          50%      { box-shadow: 0 0 0 7px rgba(124,58,237,0.22), 0 0 32px rgba(124,58,237,0.5); }
        }
        @keyframes tourCardIn {
          from { opacity: 0; transform: translateY(6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}

// ── Tooltip card, positioned relative to the spotlighted rect ─────────────
function TourCard({ rect, step, stepNumber, totalSteps, isLast, onNext, onSkip }) {
  const CARD_WIDTH = 320;
  const GAP = 16;

  // Compute position based on requested placement, then clamp to viewport
  // so the card never renders partially off-screen on smaller windows.
  let top, left;
  if (step.placement === "right") {
    top = rect.top;
    left = rect.left + rect.width + GAP;
  } else {
    // "top" placement — used for the account card pinned near the bottom
    left = rect.left;
    top = rect.top - GAP;
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  if (step.placement === "right" && left + CARD_WIDTH > vw - 12) {
    // Not enough room to the right (narrow viewport) — fall back to below
    left = Math.max(12, rect.left);
    top = rect.top + rect.height + GAP;
  }
  left = Math.min(Math.max(12, left), vw - CARD_WIDTH - 12);

  const isTopPlacement = step.placement === "top";
  const cardStyle = isTopPlacement
    ? { bottom: vh - top, left: Math.min(Math.max(12, left), vw - CARD_WIDTH - 12), top: "auto" }
    : { top: Math.min(Math.max(12, top), vh - 260), left };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        ...cardStyle,
        width: CARD_WIDTH,
        background: "#1a1a1b",
        border: "1px solid #2a2a2e",
        borderRadius: 16,
        boxShadow: "0 24px 64px rgba(0,0,0,0.55)",
        padding: "20px 20px 16px",
        animation: "tourCardIn 0.22s cubic-bezier(0.4,0,0.2,1)",
        fontFamily: "inherit",
      }}
    >
      <div style={{
        fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
        color: "#a78bfa", textTransform: "uppercase",
        fontFamily: "monospace", marginBottom: 10,
      }}>
        {step.eyebrow}
      </div>

      <div style={{ fontSize: 16, fontWeight: 700, color: "#f9fafb", letterSpacing: "-0.2px", marginBottom: 6 }}>
        {step.title}
      </div>

      <div style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.6, marginBottom: 18 }}>
        {step.body}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Progress dots — order carries real meaning here (step 1 of 4), so
            dots earn their place rather than being decoration */}
        <div style={{ display: "flex", gap: 5 }}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 6, height: 6, borderRadius: "50%",
                background: i === stepNumber - 1 ? "#7c3aed" : "#3a3a3e",
                transition: "background 0.2s",
              }}
            />
          ))}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onSkip}
            style={{
              padding: "7px 12px", background: "transparent",
              border: "none", color: "#6b7280", fontSize: 13,
              cursor: "pointer", fontFamily: "inherit",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "#9ca3af"}
            onMouseLeave={e => e.currentTarget.style.color = "#6b7280"}
          >
            Skip tour
          </button>
          <button
            onClick={onNext}
            style={{
              padding: "7px 16px", background: "#7c3aed",
              border: "none", borderRadius: 8, color: "#fff",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              fontFamily: "inherit", transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#6d28d9"}
            onMouseLeave={e => e.currentTarget.style.background = "#7c3aed"}
          >
            {isLast ? "Got it" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * ── Integration note ────────────────────────────────────────────────────
 * Render <OnboardingTour /> once, in whatever top-level component sits
 * alongside <Sidebar /> — likely App.jsx, right after the auth gate that
 * already guarantees `user` is non-null before Sidebar mounts:
 *
 *   {user && (
 *     <>
 *       <Sidebar ... />
 *       <OnboardingTour />
 *       <MainContent ... />
 *     </>
 *   )}
 *
 * It renders nothing (`return null`) once dismissed or before its 400ms
 * mount delay, so it's safe to always include in the tree — no conditional
 * wiring needed beyond "user is logged in."
 *
 * To manually re-trigger the tour during development:
 *   localStorage.removeItem("friday.onboardingComplete.v1")
 * then refresh.
 */