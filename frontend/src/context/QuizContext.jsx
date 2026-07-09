import React, { createContext, useContext, useReducer, useCallback } from "react";

// ─── State shape ────────────────────────────────────────────────────────────
// phase: "home" | "quiz" | "results"
const initialState = {
  phase: "home",
  selectedTopicIds: [],   // array so we can support mixed mode later
  questions: [],          // shuffled question array for current session
  currentIndex: 0,
  answers: {},            // { questionId: selectedOptionIndex }
  results: null,          // populated on submit
};

// ─── Action types ────────────────────────────────────────────────────────────
const ACTIONS = {
  START_QUIZ:    "START_QUIZ",
  ANSWER:        "ANSWER",
  GO_TO:         "GO_TO",
  SUBMIT:        "SUBMIT",
  RESET:         "RESET",
  RETRY_MISTAKES: "RETRY_MISTAKES",
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.START_QUIZ:
      return {
        ...initialState,
        phase: "quiz",
        selectedTopicIds: action.topicIds,
        questions: action.questions,
        currentIndex: 0,
        answers: {},
      };
    case ACTIONS.ANSWER:
      return {
        ...state,
        answers: { ...state.answers, [action.questionId]: action.optionIndex },
      };
    case ACTIONS.GO_TO:
      return { ...state, currentIndex: action.index };
    case ACTIONS.SUBMIT:
      return { ...state, phase: "results", results: action.results };
    case ACTIONS.RETRY_MISTAKES:
      return {
        ...initialState,
        phase: "quiz",
        selectedTopicIds: state.selectedTopicIds,
        questions: action.questions,
        currentIndex: 0,
        answers: {},
      };
    case ACTIONS.RESET:
      return { ...initialState };
    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────
const QuizContext = createContext(null);

export function QuizProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const startQuiz = useCallback((topicIds, questions) => {
    dispatch({ type: ACTIONS.START_QUIZ, topicIds, questions });
  }, []);

  const recordAnswer = useCallback((questionId, optionIndex) => {
    dispatch({ type: ACTIONS.ANSWER, questionId, optionIndex });
  }, []);

  const goToQuestion = useCallback((index) => {
    dispatch({ type: ACTIONS.GO_TO, index });
  }, []);

  const submitQuiz = useCallback((results) => {
    dispatch({ type: ACTIONS.SUBMIT, results });
  }, []);

  const retryMistakes = useCallback((questions) => {
    dispatch({ type: ACTIONS.RETRY_MISTAKES, questions });
  }, []);

  const resetQuiz = useCallback(() => {
    dispatch({ type: ACTIONS.RESET });
  }, []);

  return (
    <QuizContext.Provider
      value={{ state, startQuiz, recordAnswer, goToQuestion, submitQuiz, retryMistakes, resetQuiz }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used inside QuizProvider");
  return ctx;
}
