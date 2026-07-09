import React from "react";
import { BookOpen, History, Zap } from "lucide-react";
import { useQuiz } from "../../context/QuizContext";

export default function Navbar({ onGoHistory }) {
  const { state, resetQuiz } = useQuiz();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <button
          onClick={resetQuiz}
          className="flex items-center gap-2.5 group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/30">
            <Zap size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white group-hover:text-gradient transition-colors">
            Neural<span className="text-gradient">Quiz</span>
          </span>
        </button>

        {/* Right nav */}
        <nav className="flex items-center gap-2">
          {state.phase !== "home" && (
            <button
              onClick={resetQuiz}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition-all"
            >
              <BookOpen size={15} />
              Topics
            </button>
          )}
          <button
            onClick={onGoHistory}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition-all"
          >
            <History size={15} />
            History
          </button>
        </nav>
      </div>
    </header>
  );
}
