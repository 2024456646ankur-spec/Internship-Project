import React from "react";

/**
 * Base glassmorphic container.
 * Props: className, style, children, hover (bool), onClick
 */
export default function GlassCard({ children, className = "", style = {}, hover = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl
        shadow-[0_4px_24px_rgba(0,0,0,0.3)]
        ${hover ? "transition-all duration-300 hover:bg-white/[0.07] hover:border-white/[0.14] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]" : ""}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
      style={style}
    >
      {children}
    </div>
  );
}
