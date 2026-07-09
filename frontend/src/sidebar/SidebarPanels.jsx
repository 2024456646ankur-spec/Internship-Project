import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../Auth/AuthContext";
import { usePrefs } from "../Auth/PrefsContext";

// ── Modal shell ────────────────────────────────────────────────────────────
// Replaces the old full-height, edge-to-edge Drawer with a compact, centered
// modal: fixed width (~420px), auto height up to a max, rounded corners,
// dimmed backdrop. Same open/close/Escape-key behavior as before, just a
// different shell around the same panel content.
function Modal({ open, onClose, children }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.5)",
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transition: "opacity 0.2s ease",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 420,
          maxHeight: "min(640px, 90vh)",
          background: "#1a1a1b",
          border: "1px solid #2a2a2e",
          borderRadius: 16,
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
          transform: open ? "scale(1) translateY(0)" : "scale(0.96) translateY(8px)",
          opacity: open ? 1 : 0,
          transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 14, right: 14, zIndex: 1,
            background: "#2a2a2e", border: "none", borderRadius: "50%",
            width: 28, height: 28, cursor: "pointer", color: "#9ca3af",
            fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#3a3a3e"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#2a2a2e"; e.currentTarget.style.color = "#9ca3af"; }}
        >✕</button>
        <div style={{ overflowY: "auto" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
      color: "#6b7280", textTransform: "uppercase",
      padding: "16px 24px 8px", fontFamily: "monospace",
    }}>{children}</div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 44, height: 24, borderRadius: 12,
        background: value ? "#7c3aed" : "#374151",
        cursor: "pointer", position: "relative",
        transition: "background 0.2s", flexShrink: 0,
      }}
    >
      <div style={{
        position: "absolute", top: 3,
        left: value ? 23 : 3,
        width: 18, height: 18, borderRadius: "50%",
        background: "#fff", transition: "left 0.2s",
        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
      }} />
    </div>
  );
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        background: "#2a2a2e", color: "#e5e7eb",
        border: "1px solid #3a3a3e", borderRadius: 8,
        padding: "6px 12px", fontSize: 13,
        cursor: "pointer", outline: "none", fontFamily: "inherit",
      }}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function Row({ label, desc, children }) {
  return (
    <div style={{
      display: "flex", alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 24px", borderBottom: "1px solid #222226",
    }}>
      <div>
        <div style={{ fontSize: 14, color: "#e5e7eb", fontWeight: 500 }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{desc}</div>}
      </div>
      {children}
    </div>
  );
}

function PanelHeader({ icon, title, subtitle }) {
  return (
    <div style={{ padding: "28px 24px 16px", borderBottom: "1px solid #2a2a2e" }}>
      <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: "#f9fafb", letterSpacing: "-0.3px" }}>{title}</div>
      {subtitle && <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{subtitle}</div>}
    </div>
  );
}

// ── Live preview box shown inside the Personalization panel ──────────────────
function LivePreview({ local }) {
  const bgColor  = local.theme === "light" ? "#ffffff" : "#131314";
  const textColor = local.theme === "light" ? "#1f1f1f" : "#e3e3e3";
  const bubbleBg  = local.theme === "light" ? "#f1f3f4" : "#2a2a2e";
  const fontSize  = local.fontSize === "small" ? 12 : local.fontSize === "large" ? 16 : 14;
  const msgGap    = local.compactMode ? 8 : 20;

  return (
    <div style={{
      margin: "0 24px 4px",
      borderRadius: 12, overflow: "hidden",
      border: "1px solid #3a3a3e",
    }}>
      <div style={{ fontSize: 10, color: "#6b7280", background: "#111", padding: "6px 12px", letterSpacing: "0.05em", fontFamily: "monospace" }}>
        LIVE PREVIEW
      </div>
      <div style={{
        background: bgColor, padding: "14px 14px",
        display: "flex", flexDirection: "column", gap: msgGap,
        transition: "all 0.2s",
      }}>
        {/* User bubble */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{
            background: "#7c3aed", color: "#fff",
            padding: "7px 14px", borderRadius: 16,
            fontSize, maxWidth: "80%",
          }}>
            Hey, what's React?
            {local.timestamps && (
              <div style={{ fontSize: 9, opacity: 0.6, marginTop: 3 }}>12:00 PM</div>
            )}
          </div>
        </div>
        {/* AI bubble */}
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <div style={{
            background: bubbleBg, color: textColor,
            padding: "7px 14px", borderRadius: 16,
            fontSize, maxWidth: "80%",
          }}>
            React is a JavaScript library for building UIs.
            {local.timestamps && (
              <div style={{ fontSize: 9, opacity: 0.6, marginTop: 3 }}>12:00 PM</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PersonalizationPanel({ open, onClose }) {
  const { prefs, savePrefs } = usePrefs();
  const [local, setLocal] = useState({ ...prefs });
  const [saved, setSaved] = useState(false);

  // Sync local state whenever panel opens
  useEffect(() => { if (open) setLocal({ ...prefs }); }, [open]);

  const set = (key, val) => setLocal(prev => ({ ...prev, [key]: val }));

  const handleSave = () => {
    savePrefs(local);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 900);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <PanelHeader icon="🎨" title="Personalization" subtitle="Customize your Friday experience" />

      <SectionTitle>Appearance</SectionTitle>
      <Row label="Theme" desc="Interface color scheme">
        <Select value={local.theme} onChange={v => set("theme", v)}
          options={[{ value: "dark", label: "Dark" }, { value: "light", label: "Light" }, { value: "system", label: "System" }]} />
      </Row>
      <Row label="Font size" desc="Chat message text size">
        <Select value={local.fontSize} onChange={v => set("fontSize", v)}
          options={[{ value: "small", label: "Small" }, { value: "medium", label: "Medium" }, { value: "large", label: "Large" }]} />
      </Row>
      <Row label="Compact mode" desc="Reduce spacing between messages">
        <Toggle value={local.compactMode} onChange={v => set("compactMode", v)} />
      </Row>
      <Row label="Animations" desc="Enable UI transitions and effects">
        <Toggle value={local.animations} onChange={v => set("animations", v)} />
      </Row>
      <Row label="Show timestamps" desc="Display time on each message">
        <Toggle value={local.timestamps} onChange={v => set("timestamps", v)} />
      </Row>

      {/* Live preview updates as you change settings */}
      <SectionTitle>Preview</SectionTitle>
      <LivePreview local={local} />

      <SectionTitle>Language & Region</SectionTitle>
      <Row label="Language" desc="Display language for the UI">
        <Select value={local.language} onChange={v => set("language", v)}
          options={[
            { value: "en", label: "English" }, { value: "hi", label: "Hindi" },
            { value: "es", label: "Spanish" }, { value: "fr", label: "French" },
            { value: "de", label: "German" },  { value: "zh", label: "Chinese" },
            { value: "ja", label: "Japanese" },
          ]} />
      </Row>

      <SectionTitle>AI Behavior</SectionTitle>
      <Row label="Response style" desc="How Friday structures answers">
        <Select value={local.responseStyle} onChange={v => set("responseStyle", v)}
          options={[{ value: "concise", label: "Concise" }, { value: "balanced", label: "Balanced" }, { value: "detailed", label: "Detailed" }]} />
      </Row>
      <Row label="Code theme" desc="Syntax highlighting style">
        <Select value={local.codeTheme} onChange={v => set("codeTheme", v)}
          options={[{ value: "oneDark", label: "One Dark" }, { value: "github", label: "GitHub" }, { value: "dracula", label: "Dracula" }, { value: "monokai", label: "Monokai" }]} />
      </Row>

      <div style={{ padding: "16px 24px 24px" }}>
        <button
          onClick={handleSave}
          style={{
            width: "100%", padding: "12px",
            background: saved ? "#16a34a" : "#7c3aed",
            color: "#fff", border: "none", borderRadius: 10,
            fontSize: 14, fontWeight: 600, cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={e => { if (!saved) e.currentTarget.style.background = "#6d28d9"; }}
          onMouseLeave={e => { if (!saved) e.currentTarget.style.background = "#7c3aed"; }}
        >
          {saved ? "✓ Saved!" : "Save preferences"}
        </button>
      </div>
    </Modal>
  );
}

function ProfilePanel({ open, onClose }) {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) { setFirstName(user.first_name || ""); setLastName(user.last_name || ""); }
  }, [user]);

  const initials = user
    ? `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase()
    : "?";

  const handleSave = () => { setSaved(true); setEditing(false); setTimeout(() => setSaved(false), 2000); };

  return (
    <Modal open={open} onClose={onClose}>
      <PanelHeader icon="👤" title="Profile" subtitle="Manage your account details" />
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "24px", borderBottom: "1px solid #2a2a2e",
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 26, fontWeight: 700, color: "#fff",
          marginBottom: 12, boxShadow: "0 4px 20px rgba(124,58,237,0.4)", overflow: "hidden",
        }}>
          {user?.avatar_url
            ? <img src={user.avatar_url} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : initials}
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#f9fafb" }}>{user?.first_name} {user?.last_name}</div>
        <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>@{user?.username}</div>
        <div style={{
          marginTop: 8, padding: "3px 12px",
          background: "#7c3aed22", border: "1px solid #7c3aed55",
          borderRadius: 20, fontSize: 12, color: "#a78bfa", fontWeight: 600,
        }}>{user?.subscription_type?.toUpperCase() || "FREE"}</div>
        {saved && <div style={{ marginTop: 10, fontSize: 13, color: "#22c55e" }}>✓ Saved successfully</div>}
      </div>
      <SectionTitle>Account Info</SectionTitle>
      {editing ? (
        <div style={{ padding: "8px 24px" }}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: "#9ca3af", display: "block", marginBottom: 4 }}>First name</label>
            <input value={firstName} onChange={e => setFirstName(e.target.value)}
              style={{ width: "100%", background: "#2a2a2e", border: "1px solid #3a3a3e", borderRadius: 8, padding: "8px 12px", color: "#f9fafb", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: "#9ca3af", display: "block", marginBottom: 4 }}>Last name</label>
            <input value={lastName} onChange={e => setLastName(e.target.value)}
              style={{ width: "100%", background: "#2a2a2e", border: "1px solid #3a3a3e", borderRadius: 8, padding: "8px 12px", color: "#f9fafb", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleSave} style={{ flex: 1, padding: "10px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Save</button>
            <button onClick={() => setEditing(false)} style={{ flex: 1, padding: "10px", background: "#2a2a2e", color: "#9ca3af", border: "1px solid #3a3a3e", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <Row label="Full name" desc={`${user?.first_name || ""} ${user?.last_name || ""}`.trim()}>
            <button onClick={() => setEditing(true)} style={{ background: "#2a2a2e", color: "#9ca3af", border: "1px solid #3a3a3e", borderRadius: 6, padding: "4px 12px", fontSize: 12, cursor: "pointer" }}>Edit</button>
          </Row>
          <Row label="Username"  desc={`@${user?.username || ""}`}><span /></Row>
          <Row label="Email"     desc={user?.email || ""}><span /></Row>
          <Row label="Role"      desc={user?.role || "user"}><span /></Row>
          <Row label="Email verified" desc={user?.email_verified ? "Verified ✓" : "Not verified"}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: user?.email_verified ? "#22c55e" : "#ef4444" }} />
          </Row>
        </>
      )}
      <SectionTitle>Danger Zone</SectionTitle>
      <div style={{ padding: "12px 24px 24px" }}>
        <button
          style={{ width: "100%", padding: "10px", background: "transparent", color: "#ef4444", border: "1px solid #ef444444", borderRadius: 8, fontSize: 13, cursor: "pointer", transition: "background 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.background = "#ef444411"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >Delete account</button>
      </div>
    </Modal>
  );
}

function SettingsPanel({ open, onClose }) {
  const [notifications,  setNotifications]  = useState(true);
  const [soundEffects,   setSoundEffects]   = useState(false);
  const [autoSave,       setAutoSave]       = useState(true);
  const [dataCollection, setDataCollection] = useState(true);
  const [twoFactor,      setTwoFactor]      = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("7d");
  const [enterToSend,    setEnterToSend]    = useState(true);
  const [saved,          setSaved]          = useState(false);

  useEffect(() => {
    if (open) {
      try {
        const s = JSON.parse(localStorage.getItem("friday_settings") || "{}");
        if (s.notifications  !== undefined) setNotifications(s.notifications);
        if (s.soundEffects   !== undefined) setSoundEffects(s.soundEffects);
        if (s.autoSave       !== undefined) setAutoSave(s.autoSave);
        if (s.dataCollection !== undefined) setDataCollection(s.dataCollection);
        if (s.twoFactor      !== undefined) setTwoFactor(s.twoFactor);
        if (s.sessionTimeout !== undefined) setSessionTimeout(s.sessionTimeout);
        if (s.enterToSend    !== undefined) setEnterToSend(s.enterToSend);
      } catch {}
    }
  }, [open]);

  const handleSave = () => {
    localStorage.setItem("friday_settings", JSON.stringify({
      notifications, soundEffects, autoSave, dataCollection, twoFactor, sessionTimeout, enterToSend,
    }));
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1000);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <PanelHeader icon="⚙️" title="Settings" subtitle="Configure your app preferences" />
      <SectionTitle>Notifications</SectionTitle>
      <Row label="Push notifications"       desc="Get notified about updates"><Toggle value={notifications}  onChange={setNotifications}  /></Row>
      <Row label="Sound effects"            desc="Play sounds on send/receive"><Toggle value={soundEffects}   onChange={setSoundEffects}   /></Row>
      <SectionTitle>Chat</SectionTitle>
      <Row label="Enter to send"            desc="Press Enter to send, Shift+Enter for newline"><Toggle value={enterToSend}    onChange={setEnterToSend}    /></Row>
      <Row label="Auto-save conversations"  desc="Automatically save chat history"><Toggle value={autoSave}       onChange={setAutoSave}       /></Row>
      <SectionTitle>Privacy & Security</SectionTitle>
      <Row label="Data collection"          desc="Help improve Friday with usage data"><Toggle value={dataCollection} onChange={setDataCollection} /></Row>
      <Row label="Two-factor auth"          desc="Extra security for your account"><Toggle value={twoFactor}     onChange={setTwoFactor}     /></Row>
      <Row label="Session timeout"          desc="Auto logout after inactivity">
        <Select value={sessionTimeout} onChange={setSessionTimeout}
          options={[{ value: "1d", label: "1 day" }, { value: "7d", label: "7 days" }, { value: "30d", label: "30 days" }, { value: "never", label: "Never" }]} />
      </Row>
      <SectionTitle>Data</SectionTitle>
      <div style={{ padding: "12px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
        <button style={{ padding: "10px 16px", background: "#2a2a2e", color: "#e5e7eb", border: "1px solid #3a3a3e", borderRadius: 8, fontSize: 13, cursor: "pointer", textAlign: "left" }}>📥 Export all conversations</button>
        <button style={{ padding: "10px 16px", background: "#2a2a2e", color: "#ef4444", border: "1px solid #ef444433", borderRadius: 8, fontSize: 13, cursor: "pointer", textAlign: "left" }}>🗑 Clear all chat history</button>
      </div>
      <div style={{ padding: "12px 24px 24px" }}>
        <button onClick={handleSave} style={{ width: "100%", padding: "12px", background: saved ? "#16a34a" : "#7c3aed", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "background 0.2s" }}>
          {saved ? "✓ Saved!" : "Save settings"}
        </button>
      </div>
    </Modal>
  );
}

function HelpPanel({ open, onClose }) {
  const faqs = [
    { q: "How do I start a new conversation?",  a: "Click the '+ New chat' button in the top left sidebar to start a fresh conversation." },
    { q: "Can Friday run Python code?",          a: "Yes! When Friday generates a Python code block, you'll see a ▶ Run button. Click it to execute the code instantly, or use ✏ Edit to modify it first." },
    { q: "How do I delete a conversation?",      a: "Hover over any conversation in the sidebar and click the delete icon that appears on the right." },
    { q: "Is my data private?",                  a: "Yes. Your conversations are tied to your account only. No other user can access your chat history." },
    { q: "What AI model does Friday use?",       a: "Friday is powered by LLaMA 3.3 70B via Groq — one of the fastest inference engines available." },
    { q: "Is Friday free to use?",               a: "Yes, Friday is completely free. No hidden costs, no subscriptions." },
  ];
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <Modal open={open} onClose={onClose}>
      <PanelHeader icon="💬" title="Help & Support" subtitle="Get answers and contact us" />
      <SectionTitle>Contact Support</SectionTitle>
      <div style={{ padding: "8px 24px 16px", borderBottom: "1px solid #2a2a2e" }}>
        <div style={{ background: "#2a2a2e", borderRadius: 12, padding: "14px", border: "1px solid #3a3a3e" }}>
          <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 4 }}>Email us directly</div>
          <a href="mailto:ankurjaiswal.dataman@gmail.com" style={{ fontSize: 14, color: "#a78bfa", fontWeight: 600, textDecoration: "none", wordBreak: "break-all" }}>ankurjaiswal.dataman@gmail.com</a>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>We typically respond within 24 hours. Include your username for faster support.</div>
        </div>
        <div style={{ background: "#2a2a2e", borderRadius: 12, padding: "14px", border: "1px solid #3a3a3e", marginTop: 10 }}>
          <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 4 }}>Phone / WhatsApp</div>
          <div style={{ fontSize: 14, color: "#a78bfa", fontWeight: 600 }}>+91 9956178926</div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>Available Mon–Fri, 10am–6pm IST</div>
        </div>
      </div>
      <SectionTitle>Frequently Asked Questions</SectionTitle>
      <div style={{ paddingBottom: 20 }}>
        {faqs.map((faq, i) => (
          <div key={i} style={{ borderBottom: "1px solid #222226" }}>
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              style={{ width: "100%", textAlign: "left", background: "transparent", border: "none", padding: "12px 24px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}
            >
              <span style={{ fontSize: 13, color: "#e5e7eb", fontWeight: 500 }}>{faq.q}</span>
              <span style={{ color: "#6b7280", fontSize: 16, flexShrink: 0, transition: "transform 0.2s", transform: openIndex === i ? "rotate(45deg)" : "rotate(0)" }}>+</span>
            </button>
            {openIndex === i && <div style={{ padding: "0 24px 12px", fontSize: 12, color: "#9ca3af", lineHeight: 1.6 }}>{faq.a}</div>}
          </div>
        ))}
      </div>
    </Modal>
  );
}

function AboutPanel({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose}>
      <PanelHeader icon="✦" title="About Friday" subtitle="The fast, free AI assistant" />
      <div style={{ padding: "20px 24px", borderBottom: "1px solid #2a2a2e" }}>
        <div style={{ background: "linear-gradient(135deg, #1e1b4b, #2d1b69, #1e1b4b)", borderRadius: 16, padding: "20px", border: "1px solid #4c1d95", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.3), transparent)", pointerEvents: "none" }} />
          <div style={{ fontSize: 32, marginBottom: 8 }}>⚡</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#f9fafb", letterSpacing: "-0.5px" }}>Friday AI</div>
          <div style={{ fontSize: 13, color: "#a78bfa", marginTop: 4 }}>Version 2.0 · Free · Fast · Yours</div>
          <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 12, lineHeight: 1.6 }}>A blazing-fast AI assistant powered by LLaMA 3.3 70B via Groq. Built solo by Ankur. No subscriptions, no limits — just answers.</div>
        </div>
      </div>
      <SectionTitle>Tech Stack</SectionTitle>
      {[
        { icon: "⚛️", name: "React + Vite",              desc: "Frontend framework" },
        { icon: "🐍", name: "FastAPI + Python",           desc: "Backend API" },
        { icon: "🗄️", name: "PostgreSQL + SQLAlchemy",    desc: "Database" },
        { icon: "🤖", name: "LLaMA 3.3 70B via Groq",    desc: "AI model" },
        { icon: "🔐", name: "JWT + HTTP-only cookies",    desc: "Authentication" },
      ].map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 24px", borderBottom: "1px solid #1e1e22" }}>
          <div style={{ fontSize: 18, width: 28, textAlign: "center" }}>{item.icon}</div>
          <div>
            <div style={{ fontSize: 13, color: "#e5e7eb", fontWeight: 500 }}>{item.name}</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>{item.desc}</div>
          </div>
        </div>
      ))}
      <SectionTitle>Creator</SectionTitle>
      <div style={{ padding: "8px 24px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff", flexShrink: 0 }}>A</div>
        <div>
          <div style={{ fontSize: 14, color: "#f9fafb", fontWeight: 600 }}>Ankur</div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Built Friday from scratch · Solo developer</div>
        </div>
      </div>
      <div style={{ padding: "12px 24px 20px" }}>
        <a href="mailto:ankurjaiswal.dataman@gmail.com" style={{ display: "block", padding: "10px 16px", background: "#2a2a2e", color: "#a78bfa", border: "1px solid #3a3a3e", borderRadius: 8, fontSize: 13, textDecoration: "none", textAlign: "center", fontWeight: 500 }}>✉ ankurjaiswal.dataman@gmail.com</a>
      </div>
      <div style={{ padding: "14px 24px", borderTop: "1px solid #2a2a2e", fontSize: 12, color: "#4b5563", textAlign: "center" }}>© 2026 Friday AI · Made with ♥ by Ankur</div>
    </Modal>
  );
}

// ── Interview Panel & Public Speaking Panel ─────────────────────────────────
// Note: these two panels are opened from the "Practice" section in Sidebar.jsx
// via handlePracticeClick, NOT from the account dropdown. Sidebar currently
// routes "interview" and "public_speaking" straight to full pages
// (/practice-interview, /practice-speaking) instead of calling openPanel for
// them, so in practice these two components below are effectively unused
// dead code right now. Left them wired to the Modal shell for consistency in
// case that routing choice changes, but they won't render from the current
// Sidebar flow.

const API = "http://127.0.0.1:8000";

const INTERVIEW_TOPICS = [
  "Data Structures & Algorithms", "System Design", "Machine Learning",
  "Frontend Development", "Behavioral / HR", "Operating Systems",
  "Database Systems", "Computer Networks", "Python / Backend",
];

const FILLER_WORDS = ["um", "uh", "like", "actually", "basically", "literally", "you know", "so"];

function InterviewPanel({ open, onClose }) {
  const [topic, setTopic] = useState(INTERVIEW_TOPICS[0]);
  const [difficulty, setDifficulty] = useState("medium");
  const [phase, setPhase] = useState("setup"); // setup | question | recording | feedback
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState("");
  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");

  useEffect(() => {
    if (!open) {
      setPhase("setup"); setQuestion(""); setAnswer("");
      setFeedback(""); setError(""); setRecording(false);
    }
  }, [open]);

  const generateQuestion = async () => {
    setLoading(true); setError("");
    try {
      const token = localStorage.getItem("access_token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const prompt = `Generate exactly ONE concise ${difficulty} difficulty interview question about "${topic}". Return ONLY the question text, nothing else.`;
      const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers,
        body: JSON.stringify({ message: prompt, conversation_id: null }),
      });
      const data = await res.json();
      const q = data.response || data.message || data.content || "Tell me about your experience with this topic.";
      setQuestion(q.trim());
      setPhase("question");
    } catch {
      setError("Backend offline. Using a sample question.");
      const samples = {
        "Data Structures & Algorithms": "Explain the time complexity of QuickSort and when you would choose it over MergeSort.",
        "System Design": "Design a URL shortener like bit.ly. Walk me through your architecture.",
        "Machine Learning": "Explain the difference between overfitting and underfitting, and how you'd address each.",
        "Frontend Development": "What is the Virtual DOM and how does React use it to improve performance?",
        "Behavioral / HR": "Tell me about a time you had a conflict with a teammate. How did you resolve it?",
        "Operating Systems": "Explain deadlock and the four conditions required for it to occur.",
        "Database Systems": "What is database normalization? Explain 1NF, 2NF, and 3NF.",
        "Computer Networks": "Explain the difference between TCP and UDP. When would you use each?",
        "Python / Backend": "Explain Python's GIL and its impact on multi-threaded programs.",
      };
      setQuestion(samples[topic] || "Describe a challenging technical problem you solved recently.");
      setPhase("question");
    } finally {
      setLoading(false);
    }
  };

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { setError("Speech recognition not supported in this browser. Please type your answer below."); return; }
    const rec = new SpeechRecognition();
    rec.continuous = true; rec.interimResults = true; rec.lang = "en-US";
    transcriptRef.current = "";
    rec.onresult = (e) => {
      let t = "";
      for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
      transcriptRef.current = t;
      setAnswer(t);
    };
    rec.onerror = () => setError("Microphone error. Please type your answer below.");
    rec.start();
    recognitionRef.current = rec;
    setRecording(true); setPhase("recording");
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setRecording(false);
  };

  const getAIFeedback = async () => {
    if (!answer.trim()) { setError("Please provide an answer first."); return; }
    setLoading(true); setError("");
    try {
      const token = localStorage.getItem("access_token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const prompt = `You are a strict but fair interview coach. The question was: "${question}"\n\nThe candidate's answer: "${answer}"\n\nProvide structured feedback with:\n1. ✅ Strengths (2-3 points)\n2. ⚠️ Areas to Improve (2-3 points)\n3. 💡 Sample Better Answer (2-3 sentences)\n4. 🎯 Score: X/10\n\nBe concise and actionable.`;
      const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers,
        body: JSON.stringify({ message: prompt, conversation_id: null }),
      });
      const data = await res.json();
      setFeedback(data.response || data.message || data.content || "Good attempt! Focus on being more specific and using the STAR method.");
      setPhase("feedback");
    } catch {
      setFeedback("✅ Good attempt!\n⚠️ Be more specific with examples.\n💡 Use the STAR method for behavioral questions.\n🎯 Score: 7/10");
      setPhase("feedback");
    } finally {
      setLoading(false);
    }
  };

  const s = {
    btn: (bg, color="white") => ({
      padding: "10px 20px", background: bg, color, border: "none", borderRadius: 10,
      fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
      transition: "opacity 0.15s", display: "flex", alignItems: "center", gap: 6,
    }),
    chip: (active) => ({
      padding: "6px 14px", borderRadius: 20, fontSize: 13, cursor: "pointer",
      border: active ? "1px solid #6366f1" : "1px solid #3a3a3e",
      background: active ? "#6366f122" : "transparent",
      color: active ? "#a5b4fc" : "#9ca3af", transition: "all 0.15s", fontFamily: "inherit",
    }),
  };

  return (
    <Modal open={open} onClose={onClose}>
      <PanelHeader icon="🎯" title="Interview Practice" subtitle="AI-powered mock interviews with instant feedback" />

      {phase === "setup" && (
        <div style={{ padding: "0 0 20px" }}>
          <SectionTitle>Topic / Role</SectionTitle>
          <div style={{ padding: "0 24px", display: "flex", flexWrap: "wrap", gap: 8 }}>
            {INTERVIEW_TOPICS.map(t => (
              <button key={t} onClick={() => setTopic(t)} style={s.chip(topic === t)}>{t}</button>
            ))}
          </div>
          <SectionTitle>Difficulty</SectionTitle>
          <div style={{ padding: "0 24px", display: "flex", gap: 8 }}>
            {["easy","medium","hard"].map(d => (
              <button key={d} onClick={() => setDifficulty(d)} style={{ ...s.chip(difficulty === d), textTransform: "capitalize" }}>{d}</button>
            ))}
          </div>
          {error && <div style={{ margin: "12px 24px 0", padding: "10px 14px", background: "#ef444411", border: "1px solid #ef444433", borderRadius: 8, color: "#f87171", fontSize: 13 }}>{error}</div>}
          <div style={{ padding: "16px 24px 0" }}>
            <button onClick={generateQuestion} disabled={loading} style={{ ...s.btn(loading ? "#374151" : "#6366f1"), width: "100%", justifyContent: "center" }}>
              {loading ? "⟳ Generating Question…" : "🎯 Start Interview"}
            </button>
          </div>
        </div>
      )}

      {(phase === "question" || phase === "recording") && (
        <div style={{ padding: "0 24px 20px" }}>
          <div style={{ marginTop: 16, padding: "16px", background: "#1e1e22", borderRadius: 14, border: "1px solid #3a3a3e" }}>
            <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 8, letterSpacing: "0.05em", fontFamily: "monospace" }}>QUESTION</div>
            <div style={{ fontSize: 14, color: "#f9fafb", lineHeight: 1.6, fontWeight: 500 }}>{question}</div>
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>Your Answer (speak or type)</div>
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Type your answer here, or use the microphone button below…"
              rows={4}
              style={{ width: "100%", background: "#1e1e22", border: "1px solid #3a3a3e", borderRadius: 10, padding: "12px", color: "#f9fafb", fontSize: 14, resize: "vertical", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          {error && <div style={{ marginTop: 8, padding: "8px 12px", background: "#ef444411", borderRadius: 8, color: "#f87171", fontSize: 13 }}>{error}</div>}

          <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
            {!recording ? (
              <button onClick={startRecording} style={{ ...s.btn("#dc2626"), flex: 1, justifyContent: "center" }}>🎙️ Record</button>
            ) : (
              <button onClick={stopRecording} style={{ ...s.btn("#374151"), flex: 1, justifyContent: "center", animation: "pulse 1s infinite" }}>⏹ Stop</button>
            )}
            <button onClick={getAIFeedback} disabled={loading || !answer.trim()} style={{ ...s.btn(loading ? "#374151" : "#7c3aed"), flex: 1, justifyContent: "center", opacity: (!answer.trim() || loading) ? 0.5 : 1 }}>
              {loading ? "⟳ Analyzing…" : "🤖 Feedback"}
            </button>
          </div>
          <button onClick={() => setPhase("setup")} style={{ ...s.btn("transparent", "#6b7280"), marginTop: 8, width: "100%", justifyContent: "center" }}>← New Question</button>
        </div>
      )}

      {phase === "feedback" && (
        <div style={{ padding: "0 24px 20px" }}>
          <div style={{ marginTop: 16, padding: "14px", background: "#1e1e22", borderRadius: 12, border: "1px solid #3a3a3e" }}>
            <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 6, fontFamily: "monospace" }}>QUESTION</div>
            <div style={{ fontSize: 13, color: "#9ca3af" }}>{question}</div>
          </div>
          <div style={{ marginTop: 12, padding: "16px", background: "#0f172a", borderRadius: 12, border: "1px solid #6366f133", whiteSpace: "pre-wrap", fontSize: 14, color: "#e5e7eb", lineHeight: 1.7 }}>
            {feedback}
          </div>
          <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
            <button onClick={() => { setPhase("question"); setAnswer(""); setFeedback(""); }} style={{ ...s.btn("#374151"), flex: 1, justifyContent: "center" }}>🔄 Try Again</button>
            <button onClick={generateQuestion} style={{ ...s.btn("#6366f1"), flex: 1, justifyContent: "center" }}>⏭ Next</button>
          </div>
          <button onClick={() => setPhase("setup")} style={{ ...s.btn("transparent", "#6b7280"), marginTop: 8, width: "100%", justifyContent: "center" }}>← Change Topic</button>
        </div>
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }`}</style>
    </Modal>
  );
}

function PublicSpeakingPanel({ open, onClose }) {
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
    if (!open) {
      setPhase("setup"); setTranscript(""); setDuration(0);
      setFeedback(null); setError(""); setRecording(false);
      clearInterval(timerRef.current);
    }
  }, [open]);

  const countFillers = (text) => {
    const words = text.toLowerCase().split(/\s+/);
    const found = {};
    FILLER_WORDS.forEach(f => {
      const c = words.filter(w => w.replace(/[^a-z]/g,"") === f).length;
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
      setFeedback({ text: `🗣️ Delivery: ${wpm > 160 ? "You spoke a bit fast — aim for 130-150 WPM." : wpm < 100 ? "Good deliberate pace, but vary your speed for emphasis." : "Great pacing!"}\n💪 Strengths:\n• Clear articulation\n• Good vocabulary\n🎯 Improvements:\n• ${fillerTotal > 3 ? `Reduce filler words (found ${fillerTotal})` : "Maintain eye contact with audience"}\n• Add more concrete examples\n📈 Overall Score: 7/10`, words, wpm, fillers, fillerTotal, duration });
    } finally {
      setLoading(false); setPhase("analysis");
    }
  };

  const fmt = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
  const scoreColor = (wpm) => wpm >= 120 && wpm <= 160 ? "#22c55e" : wpm > 160 ? "#f59e0b" : "#f87171";

  const s = {
    btn: (bg, color="white") => ({
      padding: "10px 20px", background: bg, color, border: "none", borderRadius: 10,
      fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "opacity 0.15s",
      display: "flex", alignItems: "center", gap: 6, justifyContent: "center",
    }),
  };

  return (
    <Modal open={open} onClose={onClose}>
      <PanelHeader icon="🎤" title="Public Speaking Coach" subtitle="Record your speech and get AI coaching" />

      {phase === "setup" && (
        <div style={{ padding: "16px 24px 20px" }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: "#9ca3af", display: "block", marginBottom: 6 }}>Topic (optional)</label>
            <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Introduce yourself, Climate change talk…"
              style={{ width: "100%", background: "#1e1e22", border: "1px solid #3a3a3e", borderRadius: 10, padding: "10px 14px", color: "#f9fafb", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ background: "#1e1e22", borderRadius: 12, padding: "14px", border: "1px solid #3a3a3e", marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 8, fontWeight: 500 }}>💡 Tips for best results</div>
            {["Speak naturally as if presenting to an audience","Aim for 1-3 minutes for meaningful feedback","Avoid background noise for better transcription"].map((t,i) => (
              <div key={i} style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>• {t}</div>
            ))}
          </div>
          {error && <div style={{ padding: "10px 14px", background: "#ef444411", borderRadius: 8, color: "#f87171", fontSize: 13, marginBottom: 12 }}>{error}</div>}
          <button onClick={startRecording} style={{ ...s.btn("#dc2626"), width: "100%" }}>🎙️ Start Recording</button>
          <div style={{ marginTop: 10, fontSize: 12, color: "#6b7280", textAlign: "center" }}>Or paste/type your speech below and click Analyze</div>
          <textarea value={transcript} onChange={e => setTranscript(e.target.value)} placeholder="Paste or type speech here…" rows={4}
            style={{ marginTop: 8, width: "100%", background: "#1e1e22", border: "1px solid #3a3a3e", borderRadius: 10, padding: "10px 12px", color: "#f9fafb", fontSize: 13, resize: "vertical", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
          {transcript && (
            <button onClick={stopAndAnalyze} disabled={loading} style={{ ...s.btn("#7c3aed"), width: "100%", marginTop: 10 }}>
              {loading ? "⟳ Analyzing…" : "📊 Analyze My Speech"}
            </button>
          )}
        </div>
      )}

      {phase === "recording" && (
        <div style={{ padding: "20px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 56, marginBottom: 8, animation: "pulse 1.2s ease-in-out infinite" }}>🎙️</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#f9fafb", fontVariantNumeric: "tabular-nums" }}>{fmt(duration)}</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>Recording… speak clearly</div>
          </div>
          <div style={{ background: "#1e1e22", borderRadius: 12, padding: "14px", border: "1px solid #3a3a3e", maxHeight: 100, overflowY: "auto", marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 6, fontFamily: "monospace" }}>LIVE TRANSCRIPT</div>
            <div style={{ fontSize: 13, color: "#d1d5db", lineHeight: 1.6 }}>{transcript || <span style={{ color: "#4b5563", fontStyle: "italic" }}>Listening…</span>}</div>
          </div>
          <button onClick={stopAndAnalyze} style={{ ...s.btn("#7c3aed"), width: "100%" }}>⏹ Stop & Analyze</button>
        </div>
      )}

      {phase === "analysis" && feedback && (
        <div style={{ padding: "0 24px 20px" }}>
          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 16, marginBottom: 14 }}>
            {[
              { label: "Words", value: feedback.words, icon: "📝" },
              { label: "WPM", value: feedback.wpm, icon: "⚡", color: scoreColor(feedback.wpm) },
              { label: "Duration", value: fmt(feedback.duration), icon: "⏱️" },
            ].map(({ label, value, icon, color }) => (
              <div key={label} style={{ background: "#1e1e22", borderRadius: 10, padding: "10px", textAlign: "center", border: "1px solid #2a2a2e" }}>
                <div style={{ fontSize: 16, marginBottom: 4 }}>{icon}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: color || "#f9fafb" }}>{value}</div>
                <div style={{ fontSize: 11, color: "#6b7280" }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Filler words */}
          {feedback.fillerTotal > 0 && (
            <div style={{ background: "#1e1e22", borderRadius: 10, padding: "12px 14px", border: "1px solid #f59e0b33", marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: "#f59e0b", fontWeight: 600, marginBottom: 6 }}>⚠️ Filler Words ({feedback.fillerTotal})</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {Object.entries(feedback.fillers).map(([w, c]) => (
                  <span key={w} style={{ padding: "2px 10px", background: "#f59e0b22", border: "1px solid #f59e0b44", borderRadius: 20, fontSize: 12, color: "#fbbf24" }}>
                    "{w}" ×{c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* AI Feedback */}
          <div style={{ background: "#0f172a", borderRadius: 12, padding: "14px 16px", border: "1px solid #6366f133", whiteSpace: "pre-wrap", fontSize: 13, color: "#e5e7eb", lineHeight: 1.8, marginBottom: 14 }}>
            {feedback.text}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => { setPhase("recording"); setTranscript(""); setDuration(0); setFeedback(null); startRecording(); }} style={{ ...s.btn("#dc2626"), flex: 1 }}>🎙️ Again</button>
            <button onClick={() => { setPhase("setup"); setTranscript(""); setDuration(0); setFeedback(null); }} style={{ ...s.btn("#374151"), flex: 1 }}>← New</button>
          </div>
        </div>
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </Modal>
  );
}

export default function SidebarPanels({ activePanel, onClose }) {
  return (
    <>
      <PersonalizationPanel open={activePanel === "personalization"} onClose={onClose} />
      <ProfilePanel         open={activePanel === "profile"}         onClose={onClose} />
      <SettingsPanel        open={activePanel === "settings"}        onClose={onClose} />
      <HelpPanel            open={activePanel === "help"}            onClose={onClose} />
      <AboutPanel           open={activePanel === "about"}           onClose={onClose} />
    </>
  );
}