import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle, XCircle } from "lucide-react";
import GlassCard from "../ui/GlassCard";

function QuestionReview({ q, index, userIndex }) {
  const [expanded, setExpanded] = useState(false);
  const isCorrect = userIndex === q.correctIndex;
  const userLabel = ["A", "B", "C", "D"][userIndex] ?? "—";
  const correctLabel = ["A", "B", "C", "D"][q.correctIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <GlassCard
        className={`border ${isCorrect ? "border-emerald-500/30" : "border-red-500/30"}`}
      >
        {/* Header row */}
        <button
          onClick={() => setExpanded(v => !v)}
          className="w-full flex items-start gap-3 p-4 text-left focus:outline-none group"
        >
          {/* Status icon */}
          <div className="mt-0.5 shrink-0">
            {isCorrect
              ? <CheckCircle size={18} className="text-emerald-400" />
              : <XCircle size={18} className="text-red-400" />
            }
          </div>

          {/* Question */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-500 mb-0.5">Q{index + 1}</p>
            <p className="text-sm text-slate-200 leading-snug">{q.question}</p>

            {/* Quick answer summary */}
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {!isCorrect && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/15 text-red-300 border border-red-500/25">
                  Your answer: {userLabel} — {q.options[userIndex] ?? "Not answered"}
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                Correct: {correctLabel} — {q.options[q.correctIndex]}
              </span>
            </div>
          </div>

          {/* Expand chevron */}
          <ChevronDown
            size={16}
            className={`shrink-0 mt-1 text-slate-500 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          />
        </button>

        {/* Expanded explanation */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-0 border-t border-white/[0.06]">
                <p className="text-xs font-semibold text-violet-400 mb-1.5 mt-3">💡 Explanation</p>
                <p className="text-sm text-slate-300 leading-relaxed">{q.explanation}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  );
}

export default function ExplanationList({ results }) {
  const { questions, answers } = results;
  const [filter, setFilter] = useState("all"); // all | correct | incorrect

  const filtered = questions.filter(q => {
    const userIndex = answers[q.id] ?? null;
    const isCorrect = userIndex === q.correctIndex;
    if (filter === "correct") return isCorrect;
    if (filter === "incorrect") return !isCorrect;
    return true;
  });

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { key: "all",       label: "All" },
          { key: "incorrect", label: "❌ Wrong" },
          { key: "correct",   label: "✓ Correct" },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150
              ${filter === f.key
                ? "bg-violet-500/20 text-violet-300 border border-violet-500/40"
                : "text-slate-500 border border-white/[0.07] hover:bg-white/[0.05] hover:text-slate-300"
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Question reviews */}
      <div className="flex flex-col gap-2.5">
        {filtered.map((q, i) => (
          <QuestionReview
            key={q.id}
            q={q}
            index={questions.indexOf(q)}
            userIndex={answers[q.id] ?? null}
          />
        ))}
      </div>
    </div>
  );
}
