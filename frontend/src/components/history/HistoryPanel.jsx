import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, Target, TrendingUp, Trash2 } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import Button from "../ui/Button";
import { useLocalHistory } from "../../hooks/useLocalHistory";
import { getTopicById } from "../../data/topics";

function timeAgo(isoString) {
  const secs = Math.floor((Date.now() - new Date(isoString)) / 1000);
  if (secs < 60)   return "just now";
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

function gradeColor(letter) {
  if (letter === "A+" || letter === "A") return "#22c55e";
  if (letter === "B") return "#facc15";
  if (letter === "C") return "#fb923c";
  return "#f87171";
}

export default function HistoryPanel({ onClose }) {
  const { getHistory, clearHistory } = useLocalHistory();
  const history = useMemo(() => getHistory(), [getHistory]);

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="text-5xl mb-4">📊</div>
        <h3 className="text-lg font-semibold text-slate-200 mb-2">No attempts yet</h3>
        <p className="text-sm text-slate-500">Complete a quiz to see your history here.</p>
        <Button variant="secondary" className="mt-6" onClick={onClose}>
          ← Pick a Topic
        </Button>
      </div>
    );
  }

  const avgScore = Math.round(history.reduce((s, h) => s + h.percent, 0) / history.length);
  const best = Math.max(...history.map(h => h.percent));

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      {/* Stats banner */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { icon: <Target size={18} />, label: "Attempts", value: history.length },
          { icon: <TrendingUp size={18} />, label: "Avg Score", value: `${avgScore}%` },
          { icon: <TrendingUp size={18} />, label: "Best Score", value: `${best}%` },
        ].map(stat => (
          <GlassCard key={stat.label} className="p-4 text-center">
            <div className="text-violet-400 flex justify-center mb-1">{stat.icon}</div>
            <div className="text-xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
          </GlassCard>
        ))}
      </div>

      {/* History list */}
      <div className="flex flex-col gap-2.5">
        {history.map((item, i) => {
          const topicNames = (item.topicIds ?? [])
            .map(id => getTopicById(id)?.name ?? id)
            .join(", ") || "Unknown Topic";
          const color = gradeColor(item.grade);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <GlassCard className="p-4 flex items-center gap-4">
                {/* Grade circle */}
                <div
                  className="h-12 w-12 shrink-0 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: `${color}22`, border: `1px solid ${color}55`, color }}
                >
                  {item.grade}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{topicNames}</p>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <Clock size={11} /> {timeAgo(item.completedAt)}
                  </p>
                </div>

                {/* Score */}
                <div className="text-right shrink-0">
                  <p className="text-base font-bold" style={{ color }}>
                    {item.percent}%
                  </p>
                  <p className="text-xs text-slate-500">
                    {item.correct}/{item.total}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Clear button */}
      <div className="mt-6 flex justify-center">
        <Button
          variant="ghost"
          className="text-red-400 hover:text-red-300"
          onClick={() => {
            if (window.confirm("Clear all quiz history?")) {
              clearHistory();
              window.location.reload();
            }
          }}
        >
          <Trash2 size={14} /> Clear History
        </Button>
      </div>
    </div>
  );
}
