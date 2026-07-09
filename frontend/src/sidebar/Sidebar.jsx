import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import SidebarPanels from "./SidebarPanels";

const API = "http://127.0.0.1:8000";

const PRACTICE_ROUTES = {
  neural_quiz:      "/practice-quiz",
  interview:        "/practice-interview",
  public_speaking:  "/practice-speaking",
  career_roadmap:   "/practice-roadmap",
};

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  conversations,
  selectedConversationId,
  onSelectConversation,
  onNewChat,
  onConversationDeleted,
  authHeaders,
}) {
  // `user` is guaranteed non-null here: App.jsx only mounts Sidebar once a
  // user is authenticated (see the auth gate in App.jsx). There is no guest
  // rendering path in this component anymore — sign in / sign up now only
  // happen on LandingPage before the app itself is reachable.
  const { user, logout }              = useAuth();
  const navigate                      = useNavigate();
  const location                      = useLocation();
  const W                             = isSidebarOpen ? 260 : 64;
  const [hoveredId, setHoveredId]     = useState(null);
  const [deletingId, setDeletingId]   = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const openPanel = (name) => {
    setShowDropdown(false);
    setActivePanel(name);
  };

  const handlePracticeClick = (key) => {
    const route = PRACTICE_ROUTES[key];
    if (route) {
      // These practice tools are full pages, not slide-in drawers
      navigate(route);
      return;
    }
    openPanel(key);
  };

  // ── New chat ───────────────────────────────────────────────────────────────
  // Bug fix: previously this only called onNewChat(), which does nothing
  // visible if you're sitting on a practice sub-route like /practice-interview
  // (a totally separate page). We now always navigate back to the main chat
  // route first, THEN reset conversation state, so it works from anywhere.
  const handleNewChat = () => {
    if (location.pathname !== "/") {
      navigate("/");
    }
    if (onNewChat) onNewChat();
  };

  // ── Delete conversation ──────────────────────────────────────────────────
  // Bug fix: previously this called onConversationDeleted() unconditionally,
  // even if the fetch failed (401/403/500/network error). That made the UI
  // remove the conversation from the list even though it was never actually
  // deleted server-side — it would reappear after a refresh. Now we check
  // res.ok before touching UI state, and surface a real error otherwise.
  const handleDelete = async (e, convId) => {
    e.stopPropagation();
    setDeletingId(convId);
    setDeleteError("");
    try {
      const token = localStorage.getItem("access_token");
      const headers = { ...(authHeaders || {}) };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API}/conversation/${convId}`, {
        method: "DELETE",
        headers,
      });

      if (res.status === 401 || res.status === 403) {
        setDeleteError("You need to be signed in to delete this conversation.");
        return;
      }
      if (!res.ok) {
        let msg = "Failed to delete conversation.";
        try {
          const data = await res.json();
          if (data?.message) msg = data.message;
        } catch {}
        setDeleteError(msg);
        return;
      }

      // Only update UI state after a confirmed successful delete
      if (onConversationDeleted) onConversationDeleted(convId);
    } catch (err) {
      console.error("Failed to delete conversation:", err);
      setDeleteError("Network error — could not reach the server.");
    } finally {
      setDeletingId(null);
    }
  };

  const initials = user
    ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase() || user.username?.[0]?.toUpperCase()
    : "";

  return (
    <>
      <div style={{
        width: W, minWidth: W, height: "100vh",
        background: "#1e1f20", display: "flex", flexDirection: "column",
        transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
        overflow: "hidden", flexShrink: 0, borderRight: "1px solid #2a2b2c",
      }}>

        {/* ── Top controls ── */}
        <div style={{ padding: "12px 12px 8px", flexShrink: 0 }}>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: "50%", border: "none", background: "transparent", color: "#9aa0a6", cursor: "pointer", marginBottom: 8, transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#282a2c"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </button>

          <button
            onClick={handleNewChat}
            title="New chat"
            data-tour="new-chat"
            style={{
              display: "flex", alignItems: "center", gap: 10,
              width: isSidebarOpen ? "100%" : 40, height: 40,
              borderRadius: isSidebarOpen ? 20 : "50%",
              border: "none", background: "#2a2b2c", color: "#e3e3e3",
              cursor: "pointer",
              padding: isSidebarOpen ? "0 16px 0 12px" : "0",
              justifyContent: isSidebarOpen ? "flex-start" : "center",
              fontSize: 14, fontWeight: 500,
              transition: "background 0.15s, border-radius 0.25s, width 0.25s",
              whiteSpace: "nowrap", overflow: "hidden", marginBottom: 4,
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#3c3d3e"}
            onMouseLeave={e => e.currentTarget.style.background = "#2a2b2c"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            {isSidebarOpen && <span>New chat</span>}
          </button>
        </div>

        {/* ── Conversation list ── */}
        {isSidebarOpen && (
          <div style={{ flex: 1, overflowY: "auto", padding: "4px 8px 12px" }}>
            {deleteError && (
              <div style={{
                margin: "0 4px 8px", padding: "8px 10px",
                background: "#ef444422", border: "1px solid #ef444455",
                borderRadius: 8, color: "#f87171", fontSize: 12,
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8,
              }}>
                <span>{deleteError}</span>
                <button
                  onClick={() => setDeleteError("")}
                  style={{ background: "transparent", border: "none", color: "#f87171", cursor: "pointer", fontSize: 14, flexShrink: 0, padding: 0 }}
                >✕</button>
              </div>
            )}
            {conversations.length > 0 && (
              <p style={{ fontSize: 11, fontWeight: 600, color: "#5f6368", padding: "8px 8px 6px", letterSpacing: "0.5px", textTransform: "uppercase", margin: 0 }}>Recent</p>
            )}
            {conversations.length === 0 && (
              <p style={{ fontSize: 13, color: "#5f6368", padding: "8px 8px", margin: 0, fontStyle: "italic" }}>No conversations yet</p>
            )}
            {conversations.map((conv) => {
              const isSelected = conv.id === selectedConversationId;
              const isHovered  = hoveredId === conv.id;
              const isDeleting = deletingId === conv.id;
              return (
                <div
                  key={conv.id}
                  onMouseEnter={() => setHoveredId(conv.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    display: "flex", alignItems: "center", borderRadius: 8, marginBottom: 2,
                    background: isSelected ? "#2e3034" : isHovered ? "#282a2c" : "transparent",
                    transition: "background 0.15s", cursor: "pointer",
                  }}
                >
                  <button
                    onClick={() => {
                      if (location.pathname !== "/") navigate("/");
                      onSelectConversation(conv.id);
                    }}
                    title={conv.title}
                    style={{
                      flex: 1, textAlign: "left", background: "transparent",
                      color: isSelected ? "#e8eaed" : "#bdc1c6",
                      border: "none", borderRadius: 8,
                      padding: "9px 4px 9px 12px", fontSize: 14,
                      cursor: "pointer", whiteSpace: "nowrap",
                      overflow: "hidden", textOverflow: "ellipsis",
                      fontFamily: "inherit", lineHeight: 1.4, minWidth: 0,
                    }}
                  >{conv.title}</button>

                  {(isHovered || isSelected) && (
                    <button
                      onClick={(e) => handleDelete(e, conv.id)}
                      title="Delete conversation"
                      disabled={isDeleting}
                      style={{
                        flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                        width: 28, height: 28, borderRadius: 6, border: "none", background: "transparent",
                        color: isDeleting ? "#5f6368" : "#9aa0a6",
                        cursor: isDeleting ? "not-allowed" : "pointer", marginRight: 6, padding: 0,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#3c3d3e"; e.currentTarget.style.color = "#f28b82"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9aa0a6"; }}
                    >
                      {isDeleting ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ animation: "spin 0.7s linear infinite" }}>
                          <path d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z"/>
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Practice Tools ── */}
        <div data-tour="practice" style={{ padding: "8px 8px 4px", borderTop: "1px solid #2a2b2c", flexShrink: 0 }}>
          {isSidebarOpen && (
            <p style={{ fontSize: 11, fontWeight: 600, color: "#5f6368", padding: "8px 8px 4px", letterSpacing: "0.5px", textTransform: "uppercase", margin: 0 }}>Practice</p>
          )}
          {[
            { icon: "🎯", label: "Interview", key: "interview", title: "Interview Practice" },
            { icon: "🎤", label: "Public Speaking", key: "public_speaking", title: "Public Speaking Coach" },
            { icon: "🧠", label: "NeuralQuiz", key: "neural_quiz", title: "NeuralQuiz — Practice Quizzes" },
            { icon: "🗺️", label: "Career Roadmap", key: "career_roadmap", title: "Career Roadmap Planner" },
          ].map(({ icon, label, key, title }) => {
            const isActive = activePanel === key;
            return (
              <button
                key={key}
                onClick={() => handlePracticeClick(key)}
                title={title}
                data-tour={key === "career_roadmap" ? "career-roadmap" : undefined}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  width: isSidebarOpen ? "100%" : 40, height: 40,
                  borderRadius: isSidebarOpen ? 10 : "50%",
                  border: isActive ? "1px solid #6366f133" : "none",
                  background: isActive ? "#6366f122" : "transparent",
                  color: isActive ? "#a5b4fc" : "#9aa0a6",
                  cursor: "pointer",
                  padding: isSidebarOpen ? "0 12px" : "0",
                  justifyContent: isSidebarOpen ? "flex-start" : "center",
                  fontSize: 14, fontWeight: 500, marginBottom: 2,
                  transition: "background 0.15s, color 0.15s",
                  whiteSpace: "nowrap", overflow: "hidden", fontFamily: "inherit",
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "#282a2c"; e.currentTarget.style.color = "#e3e3e3"; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9aa0a6"; } }}
              >
                <span style={{ fontSize: 18, flexShrink: 0, width: 22, textAlign: "center" }}>{icon}</span>
                {isSidebarOpen && <span>{label}</span>}
              </button>
            );
          })}
        </div>

        {/* ── Bottom: Account section ── */}
        {/* No guest state to handle here — Sidebar only ever mounts for a
            logged-in user (see the auth gate in App.jsx), so `user` below
            is always truthy. */}
        <div style={{ flexShrink: 0, padding: "8px 12px 16px", borderTop: "1px solid #2a2b2c" }}>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowDropdown(v => !v)}
              data-tour="account"
              style={{
                display: "flex", alignItems: "center",
                gap: isSidebarOpen ? 10 : 0,
                width: "100%", padding: "8px",
                background: showDropdown ? "#282a2c" : "transparent",
                border: "none", borderRadius: 10,
                cursor: "pointer", color: "#e3e3e3",
                fontFamily: "inherit",
                justifyContent: isSidebarOpen ? "flex-start" : "center",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#282a2c"}
              onMouseLeave={e => !showDropdown && (e.currentTarget.style.background = "transparent")}
            >
              <div style={{
                width: 34, height: 34, borderRadius: "50%",
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0,
              }}>
                {user.avatar_url
                  ? <img src={user.avatar_url} alt="" style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover" }} />
                  : initials}
              </div>

              {isSidebarOpen && (
                <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#e3e3e3", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {user.first_name} {user.last_name}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 1 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 600, letterSpacing: "0.4px",
                      padding: "1px 6px", borderRadius: 4,
                      background: user.subscription_type === "pro" ? "#7c4dff22" : "#22c55e22",
                      color: user.subscription_type === "pro" ? "#a78bfa" : "#4ade80",
                      textTransform: "uppercase",
                    }}>
                      {user.subscription_type === "pro" ? "Pro" : "Free"}
                    </span>
                    <span style={{ fontSize: 12, color: "#5f6368", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      @{user.username}
                    </span>
                  </div>
                </div>
              )}

              {isSidebarOpen && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#5f6368" style={{ flexShrink: 0, transform: showDropdown ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              )}
            </button>

            {/* Dropdown */}
            {showDropdown && isSidebarOpen && (
              <div style={{
                position: "absolute", bottom: "calc(100% + 6px)", left: 0,
                width: "100%", background: "#2a2b2c",
                borderRadius: 12, border: "1px solid #3a3b3c",
                boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                overflow: "hidden", zIndex: 100,
              }}>
                {[
                  { icon: "🎨", label: "Personalization", key: "personalization" },
                  { icon: "👤", label: "Profile",         key: "profile" },
                  { icon: "⚙️", label: "Settings",        key: "settings" },
                  { icon: "❓", label: "Help",            key: "help" },
                  { icon: "ℹ️", label: "About",           key: "about" },
                ].map(({ icon, label, key }) => (
                  <button
                    key={key}
                    onClick={() => openPanel(key)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      width: "100%", padding: "11px 14px",
                      background: "transparent", border: "none",
                      color: "#bdc1c6", fontSize: 14,
                      cursor: "pointer", fontFamily: "inherit",
                      textAlign: "left", transition: "background 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#3c3d3e"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <span style={{ fontSize: 16 }}>{icon}</span>
                    {label}
                  </button>
                ))}

                <div style={{ height: 1, background: "#3a3b3c", margin: "4px 0" }} />

                <button
                  onClick={async () => { setShowDropdown(false); await logout(); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    width: "100%", padding: "11px 14px",
                    background: "transparent", border: "none",
                    color: "#f28b82", fontSize: 14,
                    cursor: "pointer", fontFamily: "inherit",
                    textAlign: "left", transition: "background 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#3c3d3e"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <span style={{ fontSize: 16 }}>🚪</span>
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Sidebar panels (slide-in drawers) ── */}
      <SidebarPanels activePanel={activePanel} onClose={() => setActivePanel(null)} />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}