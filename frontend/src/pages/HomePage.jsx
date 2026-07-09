import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap } from "lucide-react";
import CategoryFilter from "../components/home/CategoryFilter";
import TopicBentoGrid from "../components/home/TopicBentoGrid";
import { topics, getTopicsByCategory } from "../data/topics";
import { getQuestions } from "../data/questionLoader";
import { useQuiz } from "../context/QuizContext";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { startQuiz } = useQuiz();

  const filteredTopics = getTopicsByCategory(activeCategory);

  const handleTopicSelect = (topic) => {
    const questions = getQuestions([topic.id], true);
    startQuiz([topic.id], questions);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-300 mb-4">
          <Sparkles size={12} />
          315 questions · 21 topics · 4 categories
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight">
          Level up your{" "}
          <span className="text-gradient">dev & AI</span> knowledge
        </h1>
        <p className="text-slate-400 text-base max-w-xl mx-auto">
          Practice quizzes for JavaScript, Machine Learning, GenAI, LLMs, and more.
          Pick a topic and test yourself.
        </p>
      </motion.div>

      {/* Category filter */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6"
      >
        <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
      </motion.div>

      {/* Topic grid */}
      <TopicBentoGrid topics={filteredTopics} onTopicSelect={handleTopicSelect} />
    </div>
  );
}
