import React from "react";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { ArrowRight, HelpCircle } from "lucide-react";
import Badge from "../ui/Badge";

const categoryBadgeColor = {
  "webdev":          "cyan",
  "ml-fundamentals": "emerald",
  "genai-llms":      "violet",
  "ai-infra":        "pink",
};

const categoryLabel = {
  "webdev":          "Web Dev",
  "ml-fundamentals": "ML",
  "genai-llms":      "GenAI",
  "ai-infra":        "Infra",
};

export default function TopicCard({ topic, onClick, size = "normal" }) {
  const Icon = LucideIcons[topic.icon] ?? HelpCircle;
  const badgeColor = categoryBadgeColor[topic.category] ?? "default";

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group relative h-full cursor-pointer rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.034)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(16px)",
      }}
    >
      {/* Hover gradient glow border */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${topic.colorFrom}22, ${topic.colorTo}22)`,
          boxShadow: `0 0 0 1px ${topic.colorFrom}55, 0 8px 32px ${topic.colorFrom}22`,
        }}
      />

      {/* Card inner */}
      <div className={`relative z-10 flex flex-col h-full ${size === "wide" ? "p-6" : "p-5"}`}>
        {/* Icon */}
        <div
          className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl shrink-0"
          style={{
            background: `linear-gradient(135deg, ${topic.colorFrom}33, ${topic.colorTo}33)`,
            border: `1px solid ${topic.colorFrom}44`,
          }}
        >
          <Icon
            size={22}
            style={{ color: topic.colorFrom }}
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <Badge color={badgeColor} className="mb-2">
            {categoryLabel[topic.category] ?? topic.category}
          </Badge>
          <h3 className={`font-bold text-white leading-tight mb-1 ${size === "wide" ? "text-lg" : "text-base"}`}>
            {topic.name}
          </h3>
          <p className="text-xs text-slate-500">{topic.questionCount} questions</p>
        </div>

        {/* CTA arrow */}
        <div className="mt-4 flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-0 group-hover:translate-x-1"
          style={{ color: topic.colorFrom }}
        >
          Start Quiz <ArrowRight size={13} />
        </div>
      </div>
    </motion.div>
  );
}
