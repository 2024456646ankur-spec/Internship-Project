import React from "react";
import { motion } from "framer-motion";
import QuizRunner from "../components/quiz/QuizRunner";
import { useQuiz } from "../context/QuizContext";
import { getTopicById } from "../data/topics";
import * as LucideIcons from "lucide-react";
import { HelpCircle } from "lucide-react";

export default function QuizPage() {
  const { state } = useQuiz();
  const topicId = state.selectedTopicIds?.[0];
  const topic = topicId ? getTopicById(topicId) : null;
  const Icon = topic?.icon ? (LucideIcons[topic.icon] ?? HelpCircle) : HelpCircle;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      {/* Topic header */}
      {topic && (
        <div className="mx-auto max-w-2xl px-4 pt-6 pb-2 flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{
              background: `linear-gradient(135deg, ${topic.colorFrom}33, ${topic.colorTo}33)`,
              border: `1px solid ${topic.colorFrom}44`,
            }}
          >
            <Icon size={18} style={{ color: topic.colorFrom }} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white leading-tight">{topic.name}</h2>
            <p className="text-xs text-slate-500">{state.questions.length} questions</p>
          </div>
        </div>
      )}

      {/* Quiz runner */}
      <QuizRunner />
    </motion.div>
  );
}
