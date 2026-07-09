import React from "react";
import HistoryPanel from "../components/history/HistoryPanel";
import { useQuiz } from "../context/QuizContext";

export default function HistoryPage() {
  const { resetQuiz } = useQuiz();
  return <HistoryPanel onClose={resetQuiz} />;
}
