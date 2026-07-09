import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import SearchApp from "./searchbar/search";
import Sidebar from "./sidebar/Sidebar";
import { useAuth } from "./Auth/AuthContext";
import { usePrefs } from "./Auth/PrefsContext";
import NeuralQuizApp from "./quiz/NeuralQuizApp";
import InterviewPage from "./pages/InterviewPage";
import PublicSpeakingPage from "./pages/PublicSpeakingPage";
import RoadmapPage from "./pages/roadmap/RoadmapPage";

const API = "http://127.0.0.1:8000";

// Theme color maps
const THEMES = {
  dark: {
    appBg:  "#131314",
    chatBg: "#1a1a1b",
    text:   "#e3e3e3",
  },
  light: {
    appBg:  "#f9fafb",
    chatBg: "#ffffff",
    text:   "#1f1f1f",
  },
  system: null, // resolved at runtime below
};

export default function App() {
  const { token } = useAuth();
  const { prefs }  = usePrefs();

  // Resolve "system" theme
  const resolvedTheme =
    prefs.theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      : prefs.theme;

  const theme = THEMES[resolvedTheme] ?? THEMES.dark;

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messages, setMessages] = useState([]);

  const loadConversations = useCallback(async () => {
    try {
      const t = localStorage.getItem("access_token");
      const headers = {};
      if (t) headers["Authorization"] = `Bearer ${t}`;
      const res = await fetch(`${API}/conversations`, { headers });
      const data = await res.json();
      setConversations(data);
    } catch (err) {
      console.error("Failed to load conversations:", err);
    }
  }, []);

  const loadMessages = useCallback(async (conversationId) => {
    try {
      const t = localStorage.getItem("access_token");
      const headers = {};
      if (t) headers["Authorization"] = `Bearer ${t}`;
      const res = await fetch(
        `${API}/conversation/${conversationId}/messages`,
        { headers }
      );
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Failed to load messages:", err);
      setMessages([]);
    }
  }, []);

  const handleSelectConversation = useCallback(
    async (id) => {
      setSelectedConversationId(id);
      await loadMessages(id);
    },
    [loadMessages]
  );

  const handleNewChat = useCallback(() => {
    setSelectedConversationId(null);
    setMessages([]);
  }, []);

  const handleAutoCreate = useCallback(async (title) => {
    const cleanTitle =
      title
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace(/📎/g, "")
        .replace(/I've uploaded.*$/i, "")
        .replace(/Please analyze it.*$/i, "")
        .split("\n")[0]
        .trim()
        .slice(0, 60) || "New Chat";

    try {
      const t = localStorage.getItem("access_token");
      const headers = { "Content-Type": "application/json" };
      if (t) headers["Authorization"] = `Bearer ${t}`;

      const res = await fetch(`${API}/conversation`, {
        method: "POST",
        headers,
        body: JSON.stringify({ title: cleanTitle }),
      });
      const newConv = await res.json();
      setSelectedConversationId(newConv.id);
      setConversations((prev) => [newConv, ...prev]);
      return newConv.id;
    } catch (err) {
      console.error("Failed to auto-create conversation:", err);
      return null;
    }
  }, []);

  const handleDeleteConversation = useCallback(
    (deletedId) => {
      setConversations((prev) => {
        const remaining = prev.filter((c) => c.id !== deletedId);
        if (deletedId === selectedConversationId) {
          if (remaining.length > 0) {
            setSelectedConversationId(remaining[0].id);
            const t = localStorage.getItem("access_token");
            const headers = t ? { Authorization: `Bearer ${t}` } : {};
            fetch(`${API}/conversation/${remaining[0].id}/messages`, { headers })
              .then((r) => r.json())
              .then((data) => setMessages(data))
              .catch(() => setMessages([]));
          } else {
            setSelectedConversationId(null);
            setMessages([]);
          }
        }
        return remaining;
      });
    },
    [selectedConversationId]
  );

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        overflow: "hidden",
        background: theme.appBg,
        // Pass font-size as CSS var so SearchApp can consume it
        fontSize:
          prefs.fontSize === "small" ? 13 :
          prefs.fontSize === "large" ? 17 : 15,
        transition: prefs.animations ? "background 0.3s ease" : "none",
      }}
    >
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        conversations={conversations}
        selectedConversationId={selectedConversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onConversationDeleted={handleDeleteConversation}
      />

      <div
        style={{
          flex: 1,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: theme.chatBg,
          overflow: "hidden",
          transition: prefs.animations ? "background 0.3s ease" : "none",
        }}
      >
        <Routes>
          <Route
            path="/"
            element={
              <SearchApp
                conversationId={selectedConversationId}
                messages={messages}
                setMessages={setMessages}
                onConversationUpdated={loadConversations}
                onAutoCreateConversation={handleAutoCreate}
              />
            }
          />
          <Route path="/practice-quiz/*" element={<NeuralQuizApp />} />
          <Route path="/practice-interview" element={<InterviewPage />} />
          <Route path="/practice-speaking" element={<PublicSpeakingPage />} />
          <Route path="/practice-roadmap" element={<RoadmapPage />} />
        </Routes>
      </div>
    </div>
  );
}