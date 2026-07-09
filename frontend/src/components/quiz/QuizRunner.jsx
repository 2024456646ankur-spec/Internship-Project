import React from "react";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import Button from "../ui/Button";
import QuestionCard from "./QuestionCard";
import ProgressBar from "./ProgressBar";
import QuestionNav from "./QuestionNav";
import { useQuizEngine } from "../../hooks/useQuizEngine";
import { useQuiz } from "../../context/QuizContext";

export default function QuizRunner() {
  const { state } = useQuiz();
  const {
    total, currentIndex, currentQuestion, answers,
    isFirst, isLast, selectAnswer, next, prev, goToQuestion, handleSubmit,
  } = useQuizEngine();

  const selectedIndex = currentQuestion ? answers[currentQuestion.id] ?? null : null;
  const answeredCount = Object.keys(answers).length;
  const unanswered = total - answeredCount;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 flex flex-col gap-4">
      {/* Progress */}
      <ProgressBar current={currentIndex} total={total} />

      {/* Question */}
      <GlassCard className="p-6">
        <QuestionCard
          question={currentQuestion}
          selectedIndex={selectedIndex}
          onSelect={selectAnswer}
          questionNumber={currentIndex + 1}
          total={total}
        />
      </GlassCard>

      {/* Navigation buttons */}
      <div className="flex gap-3">
        <Button
          variant="secondary"
          onClick={prev}
          disabled={isFirst}
          className="flex-shrink-0"
        >
          <ChevronLeft size={16} /> Prev
        </Button>

        <div className="flex-1" />

        {isLast ? (
          <Button
            variant="primary"
            onClick={() => {
              if (unanswered > 0) {
                const ok = window.confirm(
                  `You have ${unanswered} unanswered question${unanswered > 1 ? "s" : ""}. Submit anyway?`
                );
                if (!ok) return;
              }
              handleSubmit();
            }}
          >
            <Send size={15} /> Submit Quiz
          </Button>
        ) : (
          <Button variant="secondary" onClick={next}>
            Next <ChevronRight size={16} />
          </Button>
        )}
      </div>

      {/* Question dot nav */}
      <GlassCard className="p-4">
        <p className="text-center text-xs text-slate-500 mb-3">
          {answeredCount}/{total} answered
        </p>
        <QuestionNav
          total={total}
          current={currentIndex}
          answers={answers}
          questions={state.questions}
          onGoTo={goToQuestion}
        />
      </GlassCard>
    </div>
  );
}
