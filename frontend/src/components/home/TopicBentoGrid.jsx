import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import TopicCard from "./TopicCard";

// Bento grid layout: mix of 2×1 wide cards and 1×1 normal cards
// We'll give the first card in each category group a "wide" span
function buildGrid(topics) {
  return topics.map((t, i) => ({
    topic: t,
    // Make every 5th card (0-indexed) a wide bento cell
    wide: i % 5 === 0,
  }));
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  show:   { opacity: 1, y: 0,  scale: 1, transition: { type: "spring", stiffness: 280, damping: 24 } },
};

export default function TopicBentoGrid({ topics, onTopicSelect }) {
  const grid = buildGrid(topics);

  if (topics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <p className="text-lg font-medium">No topics found</p>
        <p className="text-sm mt-1">Try selecting a different category</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid gap-3"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      }}
    >
      <AnimatePresence mode="popLayout">
        {grid.map(({ topic, wide }) => (
          <motion.div
            key={topic.id}
            layout
            variants={itemVariants}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            style={{
              gridColumn: wide ? "span 2" : "span 1",
              minHeight: wide ? 160 : 160,
            }}
          >
            <TopicCard
              topic={topic}
              size={wide ? "wide" : "normal"}
              onClick={() => onTopicSelect(topic)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
