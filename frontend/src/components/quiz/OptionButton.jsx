import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function OptionButton({ option, index, isSelected, onClick }) {
  const labels = ["A", "B", "C", "D"];

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.99 }}
      className={`
        group w-full flex items-start gap-3 rounded-xl border px-4 py-3.5 text-left
        transition-all duration-200 focus:outline-none
        ${isSelected
          ? "border-violet-500/70 bg-violet-500/15 shadow-[0_0_0_1px_rgba(139,92,246,0.5),0_4px_20px_rgba(139,92,246,0.15)]"
          : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.16] hover:bg-white/[0.07]"
        }
      `}
    >
      {/* Letter label */}
      <span
        className={`
          mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold
          transition-all duration-200
          ${isSelected
            ? "bg-violet-500 text-white"
            : "bg-white/[0.07] text-slate-400 group-hover:bg-white/[0.12] group-hover:text-slate-200"
          }
        `}
      >
        {isSelected ? <Check size={12} strokeWidth={3} /> : labels[index]}
      </span>

      {/* Option text */}
      <span className={`text-sm leading-relaxed ${isSelected ? "text-white font-medium" : "text-slate-300"}`}>
        {option}
      </span>
    </motion.button>
  );
}
