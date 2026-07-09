import React from "react";
import { motion } from "framer-motion";
import GlassCard from "../components/ui/GlassCard";
import ResultsSummary from "../components/results/ResultsSummary";
import ExplanationList from "../components/results/ExplanationList";
import TopicBreakdown from "../components/results/TopicBreakdown";
import { useQuiz } from "../context/QuizContext";
import { useQuizEngine } from "../hooks/useQuizEngine";
import { getQuestions } from "../data/questionLoader";

export default function ResultsPage() {
  const { state, startQuiz, resetQuiz } = useQuiz();
  const { handleRetryMistakes } = useQuizEngine();
  const results = state.results;

  if (!results) return null;

  const handleRetake = () => {
    const questions = getQuestions(state.selectedTopicIds, true);
    startQuiz(state.selectedTopicIds, questions);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-2xl px-4 py-6 flex flex-col gap-6"
    >
      {/* Score summary */}
      <GlassCard className="overflow-hidden">
        <ResultsSummary
          results={results}
          onRetryMistakes={handleRetryMistakes}
          onRetake={handleRetake}
          onHome={resetQuiz}
        />
      </GlassCard>

      {/* Topic breakdown (only if multi-topic) */}
      {state.selectedTopicIds?.length > 1 && (
        <GlassCard className="p-5">
          <TopicBreakdown results={results} />
        </GlassCard>
      )}

      {/* Explanation list */}
      <div>
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Question Review
        </h3>
        <ExplanationList results={results} />
      </div>
    </motion.div>
  );
}
