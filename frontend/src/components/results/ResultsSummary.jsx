import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, RotateCcw } from "lucide-react";
import ScoreRing from "./ScoreRing";
import { useCountUp } from "../../hooks/useCountUp";
import Button from "../ui/Button";

export default function ResultsSummary({ results, onRetryMistakes, onRetake, onHome }) {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 300);
    return () => clearTimeout(t);
  }, []);

  const animPercent = useCountUp(results.percent, 1400, started);
  const animCorrect = useCountUp(results.correct, 1200, started);

  const grade = results.grade;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center text-center py-8 px-4"
    >
      {/* Trophy icon */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{ background: `${grade.color}22`, border: `1px solid ${grade.color}44` }}
      >
        <Trophy size={30} style={{ color: grade.color }} />
      </motion.div>

      {/* Score ring + number */}
      <div className="relative mb-6">
        <ScoreRing
          percent={started ? results.percent : 0}
          size={180}
          stroke={14}
          color={grade.color}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold text-white tabular-nums">
            {animPercent}%
          </span>
          <span className="text-xs text-slate-400 font-medium mt-0.5">score</span>
        </div>
      </div>

      {/* Grade */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-2 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold"
        style={{ background: `${grade.color}22`, border: `1px solid ${grade.color}55`, color: grade.color }}
      >
        {grade.letter} · {grade.label}
      </motion.div>

      {/* Correct / total */}
      <p className="text-2xl font-bold text-white mb-1">
        <span className="tabular-nums">{animCorrect}</span>
        <span className="text-slate-500"> / {results.total}</span>
      </p>
      <p className="text-sm text-slate-400 mb-8">correct answers</p>

      {/* Action buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        {results.mistakes?.length > 0 && (
          <Button variant="primary" onClick={onRetryMistakes}>
            <RotateCcw size={15} /> Retry {results.mistakes.length} Mistakes
          </Button>
        )}
        <Button variant="secondary" onClick={onRetake}>
          Retake Full Quiz
        </Button>
        <Button variant="ghost" onClick={onHome}>
          ← All Topics
        </Button>
      </div>
    </motion.div>
  );
}
