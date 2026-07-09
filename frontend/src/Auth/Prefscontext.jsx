import React, { createContext, useContext, useState, useEffect } from "react";

const STORAGE_KEY = "friday_prefs";

// Default values match every field used in SidebarPanels.jsx
const defaultPrefs = {
  theme:         "dark",      // "dark" | "light" | "system"
  fontSize:      "medium",    // "small" | "medium" | "large"
  compactMode:   false,
  animations:    true,
  language:      "en",        // "en" | "hi" | "es" | "fr" | "de" | "zh" | "ja"
  responseStyle: "balanced",  // "concise" | "balanced" | "detailed"
  codeTheme:     "oneDark",   // "oneDark" | "github" | "dracula" | "monokai"
  timestamps:    false,
};

const PrefsContext = createContext(null);

// ── Theme CSS variables ─────────────────────────────────────────────────────
// Injected once into <head> on first mount. Every color used across Sidebar
// and SidebarPanels should reference one of these var(--token) names instead
// of a hardcoded hex, so flipping data-theme on <html> repaints everything
// instantly with no per-component logic needed.
const THEME_STYLE_ID = "friday-theme-vars";

const THEME_CSS = `
:root, [data-theme="dark"] {
  --bg-app:            #1e1f20;
  --bg-surface:        #1a1a1b;
  --bg-surface-raised: #2a2a2e;
  --bg-surface-hover:  #3c3d3e;
  --bg-sunken:         #1e1e22;
  --bg-input:          #2a2a2e;
  --bg-code-block:     #0f172a;

  --border-subtle:     #2a2a2e;
  --border-default:    #3a3a3e;
  --border-strong:     #4c1d95;

  --text-primary:      #f9fafb;
  --text-secondary:    #e5e7eb;
  --text-tertiary:     #9ca3af;
  --text-muted:        #6b7280;
  --text-faint:        #4b5563;

  --accent:            #7c3aed;
  --accent-hover:      #6d28d9;
  --accent-soft:       #a78bfa;
  --accent-indigo:     #6366f1;

  --success:           #22c55e;
  --success-soft:      #4ade80;
  --danger:            #ef4444;
  --danger-soft:       #f87171;
  --warning:           #f59e0b;
  --warning-soft:      #fbbf24;

  --chat-bg:           #0f0f12;
  --chat-bubble-ai:    #2a2a2e;
  --shadow-color:      rgba(0,0,0,0.5);
  --overlay:           rgba(0,0,0,0.5);

  /* ── Premium chat surface tokens ── */
  --glass-surface:     rgba(255,255,255,0.035);
  --glass-surface-2:   rgba(255,255,255,0.06);
  --glass-border:      rgba(255,255,255,0.08);
  --glass-blur:        20px;

  --gradient-accent:   linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  --gradient-accent-soft: linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.15) 100%);
  --glow-accent:       rgba(139,92,246,0.35);

  --code-bg:           #0a0a0d;
  --code-header-bg:    rgba(255,255,255,0.04);
  --code-gutter:       #3a3a45;
  --code-line-hover:   rgba(255,255,255,0.03);

  --scrollbar-thumb:   rgba(255,255,255,0.12);
}

[data-theme="light"] {
  --bg-app:            #f7f7f8;
  --bg-surface:        #ffffff;
  --bg-surface-raised: #f1f3f4;
  --bg-surface-hover:  #e5e7eb;
  --bg-sunken:         #f1f3f4;
  --bg-input:          #ffffff;
  --bg-code-block:     #eef2ff;

  --border-subtle:     #e5e7eb;
  --border-default:    #d1d5db;
  --border-strong:     #c4b5fd;

  --text-primary:      #1f1f1f;
  --text-secondary:    #27272a;
  --text-tertiary:     #52525b;
  --text-muted:        #6b7280;
  --text-faint:        #9ca3af;

  --accent:            #7c3aed;
  --accent-hover:      #6d28d9;
  --accent-soft:       #6d28d9;
  --accent-indigo:     #6366f1;

  --success:           #16a34a;
  --success-soft:      #22c55e;
  --danger:            #dc2626;
  --danger-soft:       #ef4444;
  --warning:           #d97706;
  --warning-soft:      #f59e0b;

  --chat-bg:           #ffffff;
  --chat-bubble-ai:    #f1f3f4;
  --shadow-color:      rgba(0,0,0,0.12);
  --overlay:           rgba(0,0,0,0.3);

  /* ── Premium chat surface tokens ── */
  --glass-surface:     rgba(0,0,0,0.02);
  --glass-surface-2:   rgba(0,0,0,0.04);
  --glass-border:      rgba(0,0,0,0.08);
  --glass-blur:        20px;

  --gradient-accent:   linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  --gradient-accent-soft: linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.08) 100%);
  --glow-accent:       rgba(139,92,246,0.25);

  --code-bg:           #fafafa;
  --code-header-bg:    rgba(0,0,0,0.03);
  --code-gutter:       #c7c7d1;
  --code-line-hover:   rgba(0,0,0,0.025);

  --scrollbar-thumb:   rgba(0,0,0,0.12);
}
`;

function ensureThemeStyleTag() {
  if (typeof document === "undefined") return;
  if (document.getElementById(THEME_STYLE_ID)) return;
  const tag = document.createElement("style");
  tag.id = THEME_STYLE_ID;
  tag.textContent = THEME_CSS;
  document.head.appendChild(tag);
}

function resolveTheme(theme) {
  if (theme === "system") {
    if (typeof window === "undefined" || !window.matchMedia) return "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme;
}

function applyTheme(theme) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", resolveTheme(theme));
}

export function PrefsProvider({ children }) {
  const [prefs, setPrefs] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored
        ? { ...defaultPrefs, ...JSON.parse(stored) }
        : defaultPrefs;
    } catch {
      return defaultPrefs;
    }
  });

  // Inject the CSS variable stylesheet once, before first paint of children.
  ensureThemeStyleTag();

  // Apply the theme attribute whenever it changes.
  useEffect(() => {
    applyTheme(prefs.theme);
  }, [prefs.theme]);

  // If the user has "system" selected, keep it in sync with OS-level changes
  // (e.g. they switch their OS from light to dark while the app is open).
  useEffect(() => {
    if (prefs.theme !== "system" || typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener ? mq.addEventListener("change", handler) : mq.addListener(handler);
    return () => {
      mq.removeEventListener ? mq.removeEventListener("change", handler) : mq.removeListener(handler);
    };
  }, [prefs.theme]);

  const savePrefs = (newPrefs) => {
    const merged = { ...prefs, ...newPrefs };
    setPrefs(merged);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  };

  return (
    <PrefsContext.Provider value={{ prefs, savePrefs }}>
      {children}
    </PrefsContext.Provider>
  );
}

export function usePrefs() {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("usePrefs must be used inside <PrefsProvider>");
  return ctx;
}