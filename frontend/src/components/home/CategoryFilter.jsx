import React from "react";
import { motion } from "framer-motion";
import { categories } from "../../data/topics";

const categoryColorMap = {
  "webdev":          "from-cyan-500 to-blue-500",
  "ml-fundamentals": "from-emerald-500 to-teal-500",
  "genai-llms":      "from-violet-500 to-indigo-500",
  "ai-infra":        "from-pink-500 to-purple-500",
};

export default function CategoryFilter({ active, onChange }) {
  const all = [{ id: "all", label: "All Topics", shortLabel: "All" }, ...categories];

  return (
    <div className="flex flex-wrap gap-2">
      {all.map((cat) => {
        const isActive = active === cat.id;
        const gradClass = categoryColorMap[cat.id];
        return (
          <motion.button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            whileTap={{ scale: 0.95 }}
            className={`
              relative px-4 py-2 rounded-full text-sm font-semibold
              border transition-all duration-200 outline-none
              ${isActive
                ? "text-white border-transparent shadow-lg"
                : "text-slate-400 border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] hover:text-slate-200 hover:border-white/[0.15]"
              }
            `}
            style={isActive ? {} : {}}
          >
            {isActive && gradClass && (
              <span
                className={`absolute inset-0 rounded-full bg-gradient-to-r ${gradClass} opacity-90`}
                aria-hidden
              />
            )}
            <span className="relative z-10">{cat.label ?? cat.shortLabel}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
