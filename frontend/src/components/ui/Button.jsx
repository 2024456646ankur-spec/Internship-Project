import React from "react";

const variants = {
  primary: "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 shadow-[0_4px_20px_rgba(99,102,241,0.4)] hover:shadow-[0_6px_24px_rgba(99,102,241,0.55)]",
  secondary: "bg-white/[0.07] text-slate-200 border border-white/[0.1] hover:bg-white/[0.12] hover:border-white/[0.18]",
  ghost: "bg-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]",
  danger: "bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 shadow-[0_4px_20px_rgba(239,68,68,0.35)]",
  success: "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-[0_4px_20px_rgba(16,185,129,0.35)]",
};

const sizes = {
  sm: "px-4 py-2 text-sm rounded-xl",
  md: "px-6 py-3 text-sm rounded-xl",
  lg: "px-8 py-4 text-base rounded-2xl",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  onClick,
  type = "button",
  fullWidth = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        inline-flex items-center justify-center gap-2 font-semibold
        transition-all duration-200 active:scale-[0.97]
        disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none
        focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f]
        ${className}
      `}
    >
      {children}
    </button>
  );
}
