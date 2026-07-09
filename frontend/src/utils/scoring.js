// scoring.js — pure functions for quiz result calculations

/**
 * @param {Object} answers - map of questionId → selectedIndex
 * @param {Array}  questions - array of question objects
 * @returns {{ correct, total, percent, grade }}
 */
export function calculateScore(answers, questions) {
  let correct = 0;
  for (const q of questions) {
    if (answers[q.id] === q.correctIndex) correct++;
  }
  const total = questions.length;
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
  return { correct, total, percent, grade: getGrade(percent) };
}

export function getGrade(percent) {
  if (percent >= 90) return { letter: "A+", label: "Outstanding", color: "#22c55e" };
  if (percent >= 80) return { letter: "A",  label: "Excellent",    color: "#4ade80" };
  if (percent >= 70) return { letter: "B",  label: "Good",         color: "#facc15" };
  if (percent >= 60) return { letter: "C",  label: "Satisfactory", color: "#fb923c" };
  return                     { letter: "D",  label: "Needs Work",   color: "#f87171" };
}

/**
 * For mixed-topic quizzes: accuracy broken down per topic.
 * @param {Object} answers
 * @param {Array}  questions
 * @returns {Array<{ topicId, correct, total, percent }>}
 */
export function getTopicBreakdown(answers, questions) {
  const map = {};
  for (const q of questions) {
    if (!map[q.topicId]) map[q.topicId] = { correct: 0, total: 0 };
    map[q.topicId].total++;
    if (answers[q.id] === q.correctIndex) map[q.topicId].correct++;
  }
  return Object.entries(map).map(([topicId, { correct, total }]) => ({
    topicId,
    correct,
    total,
    percent: Math.round((correct / total) * 100),
  }));
}

/** Returns only questions the user answered incorrectly */
export function getMistakes(answers, questions) {
  return questions.filter((q) => answers[q.id] !== q.correctIndex);
}
