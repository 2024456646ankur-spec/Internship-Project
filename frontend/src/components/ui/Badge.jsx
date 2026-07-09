import React from "react";

export default function Badge({ children, color = "default", className = "" }) {
  const colors = {
    default:  "bg-white/[0.08] text-slate-300 border-white/[0.1]",
    violet:   "bg-violet-500/20 text-violet-300 border-violet-500/30",
    cyan:     "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    emerald:  "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    pink:     "bg-pink-500/20 text-pink-300 border-pink-500/30",
    amber:    "bg-amber-500/20 text-amber-300 border-amber-500/30",
    red:      "bg-red-500/20 text-red-300 border-red-500/30",
    green:    "bg-green-500/20 text-green-300 border-green-500/30",
    blue:     "bg-blue-500/20 text-blue-300 border-blue-500/30",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold
        border tracking-wide
        ${colors[color] ?? colors.default}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
