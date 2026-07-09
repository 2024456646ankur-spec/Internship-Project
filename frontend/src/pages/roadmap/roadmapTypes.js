/**
 * roadmapTypes.js
 * Shared JSDoc type definitions for the Career Roadmap module.
 * All components import from here — never define shapes inline.
 *
 * These are documentation-only; no runtime cost.
 */

/**
 * @typedef {"SDE 1"|"SDE 2"|"SDE 3"|"Data Scientist"|"ML Engineer"|"DevOps Engineer"|"Frontend Engineer"|"Backend Engineer"|"Full Stack"} TargetRole
 */

/**
 * @typedef {"internship"|"fulltime"} Track
 */

/**
 * @typedef {"5-10"|"10-20"|"20+"} WeeklyHours
 */

/**
 * @typedef {1|2|3|6|12} DurationMonths
 */

/**
 * @typedef {Object} GoalInput
 * @property {TargetRole} targetRole
 * @property {string} targetCompany  — key into company_profiles (e.g. "google"), or "generic"
 * @property {Track} track
 * @property {DurationMonths} durationMonths
 * @property {WeeklyHours} weeklyHours
 */

/**
 * @typedef {"beginner"|"intermediate"|"advanced"} SkillLevel
 */

/**
 * @typedef {Object} PillarRating
 * @property {SkillLevel} level
 * @property {boolean} calibration_flag  — true if self-rating conflicts with calibration answers
 */

/**
 * @typedef {Object} SkillProfile
 * @property {"sde"|"data_ml"} role_track
 * @property {Object.<string, PillarRating>} pillars
 *   For sde:     dsa | system_design | language | cs_fundamentals | projects
 *   For data_ml: statistics | ml_fundamentals | frameworks | sql | projects
 * @property {{ name: string, level: SkillLevel } | null} language  — sde only
 */

/**
 * @typedef {Object} ChecklistItem
 * @property {string} id
 * @property {string} label
 * @property {boolean} done
 */

/**
 * @typedef {Object} RoadmapWeek
 * @property {number} weekNumber
 * @property {string} theme
 * @property {string[]} topics
 * @property {string[]} resources
 * @property {string[]} practiceTargets
 * @property {string[]} tools
 * @property {string} milestone
 * @property {string} calendarStartDate   — ISO date string; recalculated on extend/compress
 * @property {ChecklistItem[]} checklistItems
 */

/**
 * @typedef {Object} Roadmap
 * @property {GoalInput} goalInput
 * @property {SkillProfile} skillProfile
 * @property {string} whyThisPlan          — 3-4 sentence reasoning summary from the LLM
 * @property {RoadmapWeek[]} weeks
 * @property {number} mockInterviewStartWeek
 * @property {string} createdAt            — ISO date string
 * @property {string|null} lastRegeneratedAt
 */

// ── Role → role_track mapping ─────────────────────────────────────────────────
// Determines which pillar set SkillAssessment shows.
export const ROLE_TRACK_MAP = {
  "SDE 1":              "sde",
  "SDE 2":              "sde",
  "SDE 3":              "sde",
  "Frontend Engineer":  "sde",
  "Backend Engineer":   "sde",
  "Full Stack":         "sde",
  "DevOps Engineer":    "sde",
  "Data Scientist":     "data_ml",
  "ML Engineer":        "data_ml",
};

// ── SDE pillar definitions ────────────────────────────────────────────────────
export const SDE_PILLARS = [
  {
    key: "dsa",
    label: "Data Structures & Algorithms",
    description: "Arrays, trees, graphs, sorting, dynamic programming, complexity",
    calibrationQuestions: [
      "Can you explain when to use BFS vs DFS and give an example use-case for each?",
      "What is the time complexity of lookup, insert, and delete in a balanced BST?",
      "Can you implement binary search correctly from memory on the first try?",
      "Are you comfortable solving medium-difficulty graph problems (e.g., cycle detection, shortest path)?",
      "Have you solved dynamic programming problems (e.g., knapsack, LCS) independently?",
    ],
  },
  {
    key: "system_design",
    label: "System Design",
    description: "Distributed systems, databases, scalability, caching, load balancing",
    calibrationQuestions: [
      "Can you explain what load balancing is and name two strategies?",
      "What is the difference between horizontal and vertical scaling?",
      "Can you sketch a high-level design for a URL shortener (data model + API + scaling)?",
      "Do you understand the CAP theorem and its practical implications?",
      "Have you designed any distributed system component at work or in a project?",
    ],
  },
  {
    key: "language",
    label: "Programming Language Proficiency",
    description: "Idiomatic code, standard library, memory model, concurrency in your primary language",
    calibrationQuestions: [
      "Can you explain how memory management works in your chosen language (GC, ownership, etc.)?",
      "Can you implement core OOP/functional concepts from scratch without looking things up?",
      "Are you comfortable with async/concurrent programming patterns in your language?",
      "Do you know the performance characteristics of the most common data structures in your language's stdlib?",
      "Can you write clean, idiomatic code that a senior engineer would not need to significantly refactor?",
    ],
  },
  {
    key: "cs_fundamentals",
    label: "CS Fundamentals (OS / DBMS / Networks)",
    description: "Operating systems, databases, networking protocols",
    calibrationQuestions: [
      "Can you explain the difference between a process and a thread?",
      "What is a deadlock and what conditions are required for it to occur?",
      "What happens when you type a URL in a browser (DNS, TCP, HTTP)?",
      "What is database normalization and why does it matter?",
      "Can you explain how virtual memory works?",
    ],
  },
  {
    key: "projects",
    label: "Projects / Portfolio Strength",
    description: "Meaningful shipped projects, GitHub activity, demonstrable impact",
    calibrationQuestions: [
      "Do you have at least one project you can speak about in depth for 10+ minutes?",
      "Have any of your projects been used by people other than yourself?",
      "Does your GitHub/portfolio show consistent recent activity?",
      "Can you quantify the impact of at least one project (users, performance, scale)?",
      "Have you contributed to any open-source project?",
    ],
  },
];

// ── Data/ML pillar definitions ────────────────────────────────────────────────
export const DATA_ML_PILLARS = [
  {
    key: "statistics",
    label: "Statistics & Probability",
    description: "Distributions, hypothesis testing, Bayesian thinking, A/B testing",
    calibrationQuestions: [
      "Can you explain the difference between p-value and statistical power?",
      "What is the Central Limit Theorem and why does it matter in practice?",
      "Can you describe a Bayesian approach to updating beliefs with new data?",
      "Have you designed or analyzed an A/B test end-to-end?",
      "Are you comfortable deriving MLE or MAP estimates for simple models?",
    ],
  },
  {
    key: "ml_fundamentals",
    label: "ML Fundamentals",
    description: "Supervised/unsupervised learning, model evaluation, bias-variance, regularization",
    calibrationQuestions: [
      "Can you explain the bias-variance tradeoff with an example?",
      "What is regularization and when would you use L1 vs L2?",
      "Can you describe how gradient descent works and its main variants?",
      "What metrics would you use to evaluate a binary classifier with class imbalance?",
      "Have you trained and deployed a model end-to-end (data prep → serving)?",
    ],
  },
  {
    key: "frameworks",
    label: "ML Frameworks & Tools",
    description: "PyTorch, TensorFlow, scikit-learn, experiment tracking, MLOps",
    calibrationQuestions: [
      "Can you write a basic training loop in PyTorch or TensorFlow from memory?",
      "Have you used experiment tracking tools (MLflow, W&B, or similar)?",
      "Are you familiar with data pipeline tools (Spark, Airflow, dbt, or similar)?",
      "Have you deployed a model to a production or staging environment?",
      "Can you tune hyperparameters systematically (grid search, Bayesian optimization)?",
    ],
  },
  {
    key: "sql",
    label: "SQL & Data Engineering",
    description: "Complex queries, window functions, query optimization, data modeling",
    calibrationQuestions: [
      "Can you write a query with multiple JOINs, GROUP BY, and HAVING from memory?",
      "Do you understand window functions (ROW_NUMBER, LAG, LEAD, PARTITION BY)?",
      "Can you explain how a database query planner works at a high level?",
      "Have you worked with large datasets (>10M rows) and optimized slow queries?",
      "Are you familiar with dimensional modeling (star schema, fact/dimension tables)?",
    ],
  },
  {
    key: "projects",
    label: "Projects / Portfolio Strength",
    description: "ML projects with real data, notebooks, papers read/implemented",
    calibrationQuestions: [
      "Do you have at least one end-to-end ML project you can present in depth?",
      "Have you worked with real-world messy data (not just cleaned Kaggle datasets)?",
      "Can you discuss the tradeoffs in model choices you've made in a project?",
      "Have you read and implemented ideas from any ML research papers?",
      "Does your portfolio demonstrate impact (Kaggle rank, business metric, publication)?",
    ],
  },
];

// ── Available target roles ────────────────────────────────────────────────────
export const TARGET_ROLES = [
  "SDE 1",
  "SDE 2",
  "SDE 3",
  "Frontend Engineer",
  "Backend Engineer",
  "Full Stack",
  "DevOps Engineer",
  "Data Scientist",
  "ML Engineer",
];

// ── Duration options ──────────────────────────────────────────────────────────
export const DURATION_OPTIONS = [1, 2, 3, 6, 12];

// ── Weekly hours options ──────────────────────────────────────────────────────
export const WEEKLY_HOURS_OPTIONS = ["5-10", "10-20", "20+"];

// ── Minimum recommended duration heuristic ───────────────────────────────────
// Used to surface the "too short" warning before generation.
// Returns minimum recommended months given role + track + skill profile.
export function getMinRecommendedMonths(goalInput, skillProfile) {
  const avgLevel = skillProfile
    ? Object.values(skillProfile.pillars).reduce((acc, p) => {
        const w = p.level === "beginner" ? 3 : p.level === "intermediate" ? 2 : 1;
        return acc + w;
      }, 0) / Object.keys(skillProfile.pillars).length
    : 2; // default intermediate

  const isFulltime = goalInput.track === "fulltime";
  const isSenior = goalInput.targetRole === "SDE 2" || goalInput.targetRole === "SDE 3";
  const weeklyMult = goalInput.weeklyHours === "20+" ? 0.7 : goalInput.weeklyHours === "10-20" ? 1 : 1.5;

  let base = avgLevel * 2; // beginner→6, intermediate→4, advanced→2 months
  if (isFulltime) base *= 1.3;
  if (isSenior) base *= 1.4;
  base *= weeklyMult;

  return Math.ceil(Math.max(1, Math.min(base, 12)));
}
