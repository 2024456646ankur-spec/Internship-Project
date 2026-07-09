import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import OptionButton from "./OptionButton";

export default function QuestionCard({ question, selectedIndex, onSelect, questionNumber, total }) {
  if (!question) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -24 }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="w-full"
      >
        {/* Question text */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-3">
            Question {questionNumber} of {total}
          </p>
          <h2 className="text-lg font-semibold text-white leading-relaxed">
            {question.question}
          </h2>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2.5">
          {question.options.map((option, i) => (
            <OptionButton
              key={i}
              option={option}
              index={i}
              isSelected={selectedIndex === i}
              onClick={() => onSelect(i)}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
