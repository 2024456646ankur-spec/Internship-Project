import React from "react";
import { getTopicById } from "../../data/topics";

export default function TopicBreakdown({ results }) {
  const { questions, answers } = results;

  // Build per-topic stats
  const topicMap = {};
  for (const q of questions) {
    if (!topicMap[q.topicId]) topicMap[q.topicId] = { correct: 0, total: 0 };
    topicMap[q.topicId].total++;
    if (answers[q.id] === q.correctIndex) topicMap[q.topicId].correct++;
  }

  const rows = Object.entries(topicMap).map(([topicId, { correct, total }]) => {
    const topic = getTopicById(topicId);
    const percent = Math.round((correct / total) * 100);
    return { topicId, topic, correct, total, percent };
  });

  if (rows.length <= 1) return null; // Only show breakdown for multi-topic quizzes

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">
        Topic Breakdown
      </h3>
      <div className="flex flex-col gap-3">
        {rows.map(({ topicId, topic, correct, total, percent }) => {
          const color = topic?.colorFrom ?? "#8b5cf6";
          return (
            <div key={topicId}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-slate-300 truncate max-w-[60%]">
                  {topic?.name ?? topicId}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {correct}/{total} · {percent}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${percent}%`,
                    background: `linear-gradient(90deg, ${color}, ${topic?.colorTo ?? color})`,
                    boxShadow: `0 0 8px ${color}55`,
                    transitionDelay: "200ms",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
