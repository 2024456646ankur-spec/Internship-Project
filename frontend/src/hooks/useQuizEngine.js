import { useCallback } from "react";
import { useQuiz } from "../context/QuizContext";
import { calculateScore, getMistakes } from "../utils/scoring";
import { useLocalHistory } from "./useLocalHistory";
import { shuffle } from "../utils/shuffle";

// Central hook for quiz engine interactions
export function useQuizEngine() {
  const { state, recordAnswer, goToQuestion, submitQuiz, retryMistakes } = useQuiz();
  const { saveAttempt } = useLocalHistory();

  const { questions, answers, currentIndex } = state;
  const total = questions.length;
  const currentQuestion = questions[currentIndex] ?? null;

  const isFirst = currentIndex === 0;
  const isLast  = currentIndex === total - 1;

  // Returns whether the given question index has been answered
  const isAnswered = useCallback((idx) => {
    const q = questions[idx];
    return q ? answers[q.id] !== undefined : false;
  }, [questions, answers]);

  // Select an answer for the current question
  const selectAnswer = useCallback((optionIndex) => {
    if (!currentQuestion) return;
    recordAnswer(currentQuestion.id, optionIndex);
  }, [currentQuestion, recordAnswer]);

  // Move to next question (no wrapping past last)
  const next = useCallback(() => {
    if (!isLast) goToQuestion(currentIndex + 1);
  }, [isLast, currentIndex, goToQuestion]);

  // Move to previous question
  const prev = useCallback(() => {
    if (!isFirst) goToQuestion(currentIndex - 1);
  }, [isFirst, currentIndex, goToQuestion]);

  // Submit quiz — compute results, persist, transition phase
  const handleSubmit = useCallback(() => {
    const { correct, total: t, percent, grade } = calculateScore(answers, questions);
    const mistakes = getMistakes(answers, questions);
    const results = {
      correct,
      total: t,
      percent,
      grade,
      answers: { ...answers },
      questions: [...questions],
      mistakes,
      completedAt: new Date().toISOString(),
    };

    // Persist to history
    saveAttempt({
      topicIds: state.selectedTopicIds,
      correct,
      total: t,
      percent,
      grade: grade.letter,
      completedAt: results.completedAt,
    });

    submitQuiz(results);
  }, [answers, questions, state.selectedTopicIds, saveAttempt, submitQuiz]);

  // Start over with only the wrong answers, shuffled
  const handleRetryMistakes = useCallback(() => {
    if (!state.results?.mistakes?.length) return;
    const retryQs = shuffle([...state.results.mistakes]);
    retryMistakes(retryQs);
  }, [state.results, retryMistakes]);

  return {
    // Derived state
    total,
    currentIndex,
    currentQuestion,
    answers,
    isFirst,
    isLast,
    isAnswered,
    answeredCount: Object.keys(answers).length,
    // Actions
    selectAnswer,
    next,
    prev,
    goToQuestion,
    handleSubmit,
    handleRetryMistakes,
  };
}
