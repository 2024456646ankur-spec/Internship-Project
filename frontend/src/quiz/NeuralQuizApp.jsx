import React, { useState } from "react";
import { QuizProvider, useQuiz } from "../context/QuizContext";
import AppShell from "../components/layout/AppShell";
import Navbar from "../components/layout/Navbar";
import HomePage from "../pages/HomePage";
import QuizPage from "../pages/QuizPage";
import ResultsPage from "../pages/ResultsPage";
import HistoryPage from "../pages/HistoryPage";

// Phase-based router + history toggle — must be inside QuizProvider
function QuizAppInner() {
  const { state, resetQuiz } = useQuiz();
  const [showHistory, setShowHistory] = useState(false);

  // Auto-exit history when a quiz starts
  React.useEffect(() => {
    if (state.phase !== "home") setShowHistory(false);
  }, [state.phase]);

  const handleGoHistory = () => {
    resetQuiz();          // go back to home phase
    setShowHistory(true);
  };

  let content;
  if (showHistory) {
    content = <HistoryPage />;
  } else {
    switch (state.phase) {
      case "quiz":    content = <QuizPage />;    break;
      case "results": content = <ResultsPage />; break;
      default:        content = <HomePage />;    break;
    }
  }

  return (
    <AppShell>
      <Navbar onGoHistory={handleGoHistory} />
      {content}
    </AppShell>
  );
}

export default function NeuralQuizApp() {
  return (
    <QuizProvider>
      <QuizAppInner />
    </QuizProvider>
  );
}
