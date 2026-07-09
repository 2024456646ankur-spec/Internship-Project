import React from "react";
import { motion } from "framer-motion";

export default function QuestionNav({ total, current, answers, questions, onGoTo }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {Array.from({ length: total }, (_, i) => {
        const q = questions[i];
        const answered = q && answers[q.id] !== undefined;
        const isActive = i === current;
        return (
          <motion.button
            key={i}
            whileTap={{ scale: 0.85 }}
            onClick={() => onGoTo(i)}
            title={`Question ${i + 1}${answered ? " (answered)" : ""}`}
            className={`
              relative h-7 w-7 rounded-full text-xs font-semibold
              transition-all duration-200 focus:outline-none
              ${isActive
                ? "bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-lg shadow-violet-500/40 scale-110"
                : answered
                  ? "bg-violet-500/20 border border-violet-500/50 text-violet-300 hover:bg-violet-500/30"
                  : "bg-white/[0.05] border border-white/[0.1] text-slate-500 hover:bg-white/[0.1] hover:text-slate-300"
              }
            `}
          >
            {i + 1}
          </motion.button>
        );
      })}
    </div>
  );
}
