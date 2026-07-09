import React from "react";
import { motion } from "framer-motion";

export default function ProgressBar({ current, total }) {
  const percent = total > 0 ? Math.round(((current + 1) / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-slate-500">
          Question {current + 1} of {total}
        </span>
        <span className="text-xs font-semibold text-slate-400">{percent}%</span>
      </div>
      <div className="relative h-1.5 w-full rounded-full bg-white/[0.07] overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: "linear-gradient(90deg, #8b5cf6, #3b82f6)",
            boxShadow: "0 0 8px rgba(139,92,246,0.5)",
          }}
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
        />
      </div>
    </div>
  );
}
