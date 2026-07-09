/**
 * interviewQuestions.js
 * Built-in question bank for the AI Interview Simulator.
 *
 * Question shape:
 * {
 *   id: string,
 *   type: "behavioral" | "coding",   // "coding" shows the right panel
 *   topic: string,
 *   difficulty: "easy" | "medium" | "hard",
 *   text: string,                    // read aloud via TTS
 *   starterCode?: { js: string, python: string },  // coding only
 *   idealAnswer: string,             // shown in feedback phase
 *   feedbackHints: {
 *     strengths: string[],
 *     improvements: string[],
 *   }
 * }
 */

export const INTERVIEW_TOPICS = [
  { id: "dsa",       label: "Data Structures & Algorithms" },
  { id: "system",    label: "System Design" },
  { id: "react",     label: "React & Frontend" },
  { id: "ml",        label: "Machine Learning" },
  { id: "behavioral",label: "Behavioral / HR" },
  { id: "python",    label: "Python & Backend" },
  { id: "os",        label: "Operating Systems" },
  { id: "db",        label: "Databases" },
];

// ─────────────────────────────────────────────────────────────────────────────
// BEHAVIORAL QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────
const behavioral = [
  {
    id: "beh-1",
    type: "behavioral",
    topic: "behavioral",
    difficulty: "easy",
    text: "Tell me about yourself — your background, what you've been working on recently, and what you're looking for in your next role.",
    idealAnswer:
      "A strong answer covers: brief educational or professional background, 1-2 notable recent projects with impact metrics, and a clear, role-aligned reason for the move. Keep it to 2-3 minutes.",
    feedbackHints: {
      strengths: [
        "Clear structure (past → present → future)",
        "Quantified achievements with impact numbers",
        "Tailored motivation aligned to the role",
      ],
      improvements: [
        "Avoid reciting the entire résumé — pick 2-3 highlights",
        "Be specific about the 'why this role' part",
        "Practice keeping it under 2 minutes",
      ],
    },
  },
  {
    id: "beh-2",
    type: "behavioral",
    topic: "behavioral",
    difficulty: "medium",
    text: "Describe a time you had a significant conflict with a teammate or manager. How did you handle it, and what was the outcome?",
    idealAnswer:
      "Use STAR (Situation, Task, Action, Result). Focus on how you managed disagreement constructively — active listening, seeking common ground, escalating appropriately. Show growth.",
    feedbackHints: {
      strengths: [
        "Uses STAR format with clear context",
        "Takes ownership of your part in the conflict",
        "Emphasises resolution and learning",
      ],
      improvements: [
        "Avoid making the other party sound entirely at fault",
        "Quantify the outcome where possible (project delivered on time, team satisfaction improved)",
        "Mention what you'd do differently",
      ],
    },
  },
  {
    id: "beh-3",
    type: "behavioral",
    topic: "behavioral",
    difficulty: "hard",
    text: "Tell me about a project where you had to make a critical technical decision under significant uncertainty. How did you approach it, and how did it turn out?",
    idealAnswer:
      "Highlight: framing the problem, data/information gathered, stakeholders consulted, the decision made and rationale, outcome, and retrospective learnings. Show comfort with ambiguity.",
    feedbackHints: {
      strengths: [
        "Demonstrates structured decision-making under uncertainty",
        "Acknowledges trade-offs rather than claiming a perfect choice",
        "Reflects on what worked and what didn't",
      ],
      improvements: [
        "Be specific about the decision criteria used",
        "Quantify impact (latency reduced by X%, cost savings, etc.)",
        "Don't skip the learning — it's often the most memorable part",
      ],
    },
  },
  {
    id: "beh-4",
    type: "behavioral",
    topic: "behavioral",
    difficulty: "easy",
    text: "What's your greatest professional strength, and can you give me a concrete example of it in action?",
    idealAnswer:
      "Pick one specific, relevant strength. Back it with a brief STAR story. Tie it directly to the role you're applying for. Avoid generic answers like 'I'm a hard worker.'",
    feedbackHints: {
      strengths: [
        "Single clear strength, not a laundry list",
        "Concrete example that demonstrates it, not just claims it",
        "Relevant to the target role",
      ],
      improvements: [
        "Avoid saying 'I work hard' or 'I'm a perfectionist'",
        "Include the outcome or impact of that strength",
        "Practice brevity — keep this under 90 seconds",
      ],
    },
  },
  {
    id: "beh-5",
    type: "behavioral",
    topic: "behavioral",
    difficulty: "medium",
    text: "Describe a situation where you had to learn a new technology or skill very quickly. How did you get up to speed, and what was the result?",
    idealAnswer:
      "Demonstrate a structured learning approach: identify knowledge gaps, find resources, practice deliberately, ship something. Quantify the timeline and the outcome.",
    feedbackHints: {
      strengths: [
        "Shows self-directed learning ability",
        "Concrete timeline makes it credible",
        "Outcome demonstrates the skill was actually acquired",
      ],
      improvements: [
        "Be specific about which resources and why you chose them",
        "Include what you built or shipped as proof",
        "Mention what you'd do differently if time were even shorter",
      ],
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// DSA / ALGORITHMIC QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────
const dsa = [
  {
    id: "dsa-1",
    type: "behavioral",
    topic: "dsa",
    difficulty: "medium",
    text: "Explain the time and space complexity of QuickSort in both the average and worst cases. When would you prefer it over MergeSort?",
    idealAnswer:
      "Average O(n log n) time, O(log n) space (stack). Worst O(n²) time when the pivot is always min/max (e.g. sorted input without randomisation). Prefer QuickSort for cache-friendly in-place sorting on arrays where worst-case can be avoided with random pivot. Prefer MergeSort for linked lists or when stable sort is required.",
    feedbackHints: {
      strengths: [
        "Mentions both average and worst case with correct values",
        "Explains the pivot-selection cause of worst case",
        "Gives a practical use-case comparison",
      ],
      improvements: [
        "Mention randomised pivot as the mitigation",
        "Note that MergeSort is stable but QuickSort typically isn't",
        "Discuss space: MergeSort needs O(n) auxiliary space",
      ],
    },
  },
  {
    id: "dsa-2",
    type: "coding",
    topic: "dsa",
    difficulty: "medium",
    text: "Given an array of integers, write a function that returns all pairs of elements that sum to a given target. Each pair should be returned only once, and you should aim for better than O(n²) time complexity.",
    starterCode: {
      js: `/**
 * @param {number[]} nums
 * @param {number} target
 * @returns {number[][]}  // array of [a, b] pairs
 */
function twoSumPairs(nums, target) {
  // Your solution here
}

// Test cases
console.log(twoSumPairs([1, 5, 3, 2, 4], 6));   // [[1,5],[2,4],[3,3]? depends] 
console.log(twoSumPairs([1, 2, 3, 4, 5], 5));   // [[1,4],[2,3]]
console.log(twoSumPairs([3, 3], 6));             // [[3,3]]
`,
      python: `def two_sum_pairs(nums: list[int], target: int) -> list[tuple]:
    """Return all unique pairs that sum to target."""
    # Your solution here
    pass

# Test cases
print(two_sum_pairs([1, 5, 3, 2, 4], 6))
print(two_sum_pairs([1, 2, 3, 4, 5], 5))
print(two_sum_pairs([3, 3], 6))
`,
    },
    idealAnswer:
      "Use a hash set. Iterate nums, for each num check if (target - num) is in the seen set. If yes, add the pair (sorted) to a result set. If no, add num to seen. Returns O(n) time, O(n) space.",
    feedbackHints: {
      strengths: [
        "O(n) solution using a hash set",
        "Handles duplicates correctly",
        "Clean, readable code with test cases run",
      ],
      improvements: [
        "Make sure to avoid duplicate pairs (e.g. [1,5] and [5,1])",
        "Edge case: what if nums is empty or has one element?",
        "Consider what happens with negative numbers",
      ],
    },
  },
  {
    id: "dsa-3",
    type: "coding",
    topic: "dsa",
    difficulty: "hard",
    text: "Implement a function that validates whether a given string of brackets — containing '(', ')', '{', '}', '[', ']' — is properly balanced. Return true if valid, false otherwise.",
    starterCode: {
      js: `/**
 * @param {string} s
 * @returns {boolean}
 */
function isValid(s) {
  // Your solution here
}

// Tests
console.log(isValid("()[]{}"));   // true
console.log(isValid("([)]"));     // false
console.log(isValid("{[]}"));     // true
console.log(isValid(""));         // true
console.log(isValid("]"));        // false
`,
      python: `def is_valid(s: str) -> bool:
    """Return True if brackets are properly balanced."""
    # Your solution here
    pass

# Tests
print(is_valid("()[]{}"))   # True
print(is_valid("([)]"))     # False
print(is_valid("{[]}"))     # True
print(is_valid(""))         # True
print(is_valid("]"))        # False
`,
    },
    idealAnswer:
      "Use a stack. For each char: if opening bracket, push to stack. If closing bracket, check stack top matches the corresponding opener. If not, return false. At end, stack should be empty. O(n) time, O(n) space.",
    feedbackHints: {
      strengths: [
        "Stack-based approach is optimal — O(n) time",
        "Handles edge cases: empty string, single closer",
        "Uses a map for clean open/close matching",
      ],
      improvements: [
        "Check stack is empty at the end — extra openers are also invalid",
        "Handle the case where stack is empty when a closer arrives",
        "Avoid a large if/else chain — a dictionary/map is cleaner",
      ],
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM DESIGN QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────
const system = [
  {
    id: "sys-1",
    type: "behavioral",
    topic: "system",
    difficulty: "hard",
    text: "Design a URL shortener like bit.ly. Walk me through your high-level architecture, your choice of data store, how you'd handle scale, and any trade-offs you'd make.",
    idealAnswer:
      "Cover: API design (POST to shorten, GET to redirect), unique key generation (base62, ~7 chars), data store choice (SQL vs KV store), read-heavy workload → CDN + Redis cache, analytics (async write to Kafka/stream), scale: horizontal API servers, DB sharding by hash. Discuss: collision handling, TTL, custom aliases, rate limiting.",
    feedbackHints: {
      strengths: [
        "Clear API contract before implementation",
        "Addresses the read/write asymmetry (reads >> writes)",
        "Mentions caching and the rationale for it",
      ],
      improvements: [
        "Quantify scale: how many URLs/day, QPS, storage?",
        "Explain key generation in detail — hash vs counter vs UUID",
        "Address redirect latency target (should be <50ms)",
      ],
    },
  },
  {
    id: "sys-2",
    type: "behavioral",
    topic: "system",
    difficulty: "hard",
    text: "How would you design a real-time notification system that needs to deliver messages to millions of users with low latency? Consider web, mobile, and offline scenarios.",
    idealAnswer:
      "Use WebSockets or Server-Sent Events for real-time web; APNs/FCM for mobile push. Fan-out: for low-follower users, fan-out on write (push to all followers' queues); for celebrities, fan-out on read (pull). Broker: Kafka or Redis Pub/Sub. Store undelivered in DB, send on reconnect. Handle offline: store in inbox table, mark read.",
    feedbackHints: {
      strengths: [
        "Identifies both push (WebSocket) and pull (polling) options",
        "Distinguishes fan-out strategies based on user follower count",
        "Mentions offline handling — delivery guarantees",
      ],
      improvements: [
        "Be specific about the message broker and why you chose it",
        "Discuss notification deduplication",
        "Address rate limiting to avoid spam",
      ],
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// REACT / FRONTEND QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────
const reactFrontend = [
  {
    id: "react-1",
    type: "behavioral",
    topic: "react",
    difficulty: "medium",
    text: "Explain what the Virtual DOM is, how React's reconciliation algorithm works, and what 'keys' are for in lists — and why a random key like Math.random() is dangerous.",
    idealAnswer:
      "Virtual DOM is a lightweight in-memory representation of the DOM. React diffs old vs new VDOM trees (reconciliation) using a heuristic O(n) algorithm. Keys help React identify list items across renders to avoid unnecessary remounts. Random keys cause every item to remount on every render (React thinks every element is new), destroying state and killing performance.",
    feedbackHints: {
      strengths: [
        "Explains VDOM as an abstraction layer, not a performance trick",
        "Covers reconciliation heuristics (type-based, key-based)",
        "Gives a concrete reason why Math.random() keys are harmful",
      ],
      improvements: [
        "Mention that VDOM diffing has O(n) complexity (with assumptions)",
        "Discuss when to use index as key (stable, non-reordered lists)",
        "Note that React Fiber is the modern reconciler name",
      ],
    },
  },
  {
    id: "react-2",
    type: "coding",
    topic: "react",
    difficulty: "medium",
    text: "Write a custom React hook called useDebounce that takes a value and a delay, and returns the debounced value — one that only updates after the specified delay has passed without the value changing.",
    starterCode: {
      js: `// Implement the useDebounce hook
// Note: React hooks are not available in this sandbox — 
// implement the core debounce logic as a pure function instead,
// and describe how you'd wrap it in a hook.

function debounce(fn, delay) {
  // Your implementation here
}

// Demonstrate it works:
let callCount = 0;
const debouncedFn = debounce(() => {
  callCount++;
  console.log("Called! Count:", callCount);
}, 100);

// Rapid calls — should only fire once after 100ms
debouncedFn();
debouncedFn();
debouncedFn();

// Simulate waiting
setTimeout(() => {
  console.log("Final call count (should be 1):", callCount);
}, 200);
`,
      python: "import time\nimport threading\n\ndef debounce(fn, delay_seconds):\n    \"\"\"\n    Returns a debounced version of fn that only fires\n    after delay_seconds of inactivity.\n    \"\"\"\n    # Your implementation here\n    pass\n\n# Test it\ncall_count = [0]\n\ndef on_call():\n    call_count[0] += 1\n    print('Called! Count:', call_count[0])\n\ndebounced = debounce(on_call, 0.1)\n\n# Rapid calls\ndebounced()\ndebounced()\ndebounced()\n\nimport time\ntime.sleep(0.3)\nprint('Final call count (should be 1):', call_count[0])\n",
    },
    idealAnswer:
      "useDebounce uses useState to hold debounced value and useEffect with a setTimeout. The effect runs on value/delay change, sets a timer, and clears it on cleanup (the returned function). This ensures only the final value in a burst gets through.",
    feedbackHints: {
      strengths: [
        "Cleanup function in useEffect prevents stale state updates",
        "Handles edge case of immediate unmount",
        "Correct use of useState for the debounced value",
      ],
      improvements: [
        "Ensure the delay is in the dependency array",
        "Consider memoizing with useCallback if the debounced fn is passed as prop",
        "Test with rapid input changes to verify only last fires",
      ],
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MACHINE LEARNING QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────
const ml = [
  {
    id: "ml-1",
    type: "behavioral",
    topic: "ml",
    difficulty: "medium",
    text: "Explain overfitting and underfitting. What are the signs of each, and what techniques would you use to address them?",
    idealAnswer:
      "Overfitting: model memorises training data, high train accuracy but low validation accuracy. Fix: regularisation (L1/L2), dropout, more data, data augmentation, early stopping, simpler model. Underfitting: model too simple to capture patterns, high bias, low accuracy on both sets. Fix: larger/more complex model, more features, longer training, remove regularisation.",
    feedbackHints: {
      strengths: [
        "Clear definitions with train vs validation gap framing",
        "Lists multiple techniques for each with correct categorisation",
        "Mentions bias-variance tradeoff implicitly or explicitly",
      ],
      improvements: [
        "Use the bias-variance tradeoff terminology explicitly",
        "Give concrete examples (e.g. polynomial degree for underfitting)",
        "Mention cross-validation as a diagnostic tool",
      ],
    },
  },
  {
    id: "ml-2",
    type: "behavioral",
    topic: "ml",
    difficulty: "hard",
    text: "Walk me through how you would approach building and deploying a machine learning model from scratch — from problem framing to production monitoring.",
    idealAnswer:
      "1. Problem framing (define metric, baseline). 2. Data collection & EDA. 3. Feature engineering & preprocessing. 4. Model selection & training. 5. Evaluation (held-out test, fairness checks). 6. Deployment (API wrapper, containerisation). 7. Monitoring (data drift, model drift, latency). 8. Retraining pipeline.",
    feedbackHints: {
      strengths: [
        "End-to-end thinking — doesn't skip monitoring",
        "Mentions choosing the right metric before building",
        "Addresses deployment infrastructure",
      ],
      improvements: [
        "Discuss A/B testing for safe production rollout",
        "Mention data versioning (DVC, MLflow) for reproducibility",
        "Address class imbalance and fairness evaluation",
      ],
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PYTHON / BACKEND QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────
const python = [
  {
    id: "py-1",
    type: "behavioral",
    topic: "python",
    difficulty: "medium",
    text: "Explain Python's Global Interpreter Lock — what it is, why it exists, and what its practical implications are for multi-threaded programs. How would you work around it?",
    idealAnswer:
      "GIL is a mutex that allows only one thread to execute Python bytecode at a time, even on multi-core hardware. Exists to simplify CPython's memory management. Implication: CPU-bound multi-threaded code doesn't get true parallelism. Workarounds: multiprocessing (separate processes, separate GIL), asyncio for I/O-bound tasks, C extensions that release the GIL (numpy, etc.), PyPy doesn't have it.",
    feedbackHints: {
      strengths: [
        "Accurately defines GIL as a mutex on bytecode execution",
        "Distinguishes CPU-bound vs I/O-bound implications",
        "Mentions multiprocessing as the primary CPU-bound workaround",
      ],
      improvements: [
        "Mention that I/O-bound threads aren't affected much (GIL released during I/O)",
        "Note that asyncio is single-threaded cooperative concurrency",
        "Discuss the ongoing PEP 703 no-GIL work in Python 3.13+",
      ],
    },
  },
  {
    id: "py-2",
    type: "coding",
    topic: "python",
    difficulty: "medium",
    text: "Write a Python function that flattens a deeply nested list — for example, [[1, [2, 3]], [4, [5, [6]]]] should become [1, 2, 3, 4, 5, 6]. Handle arbitrary nesting depth.",
    starterCode: {
      js: `/**
 * @param {Array} arr - Arbitrarily nested array
 * @returns {number[]} - Flat array
 */
function flatten(arr) {
  // Your solution here
}

// Tests
console.log(flatten([[1, [2, 3]], [4, [5, [6]]]]));  // [1,2,3,4,5,6]
console.log(flatten([1, 2, 3]));                      // [1,2,3]
console.log(flatten([[[[1]]]]));                      // [1]
console.log(flatten([]));                             // []
`,
      python: `def flatten(arr):
    """Flatten an arbitrarily nested list."""
    # Your solution here
    pass

# Tests
print(flatten([[1, [2, 3]], [4, [5, [6]]]]))  # [1, 2, 3, 4, 5, 6]
print(flatten([1, 2, 3]))                      # [1, 2, 3]
print(flatten([[[[1]]]]))                      # [1]
print(flatten([]))                             # []
`,
    },
    idealAnswer:
      "Recursive: for each item, if it's a list recurse, else yield/append. Iterative with a stack is also valid. In Python, can use `isinstance(item, list)`. In JS, `Array.isArray()`. Built-in: `arr.flat(Infinity)` in JS, no direct built-in in Python but `itertools.chain.from_iterable` for single level.",
    feedbackHints: {
      strengths: [
        "Handles arbitrary depth correctly",
        "Uses isinstance/Array.isArray for type checking",
        "All test cases pass",
      ],
      improvements: [
        "Mention the risk of deep recursion (RecursionError) and iterative alternative",
        "Handle non-list iterables (tuples, strings) if needed",
        "Mention Python's built-in array.flat(Infinity) equivalent in JS",
      ],
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// DATABASE QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────
const db = [
  {
    id: "db-1",
    type: "behavioral",
    topic: "db",
    difficulty: "medium",
    text: "Explain database normalisation. What are the goals of 1NF, 2NF, and 3NF, and can you give a brief example showing a table that violates 2NF and how to fix it?",
    idealAnswer:
      "Normalisation: reduce redundancy and improve integrity. 1NF: atomic values, no repeating groups. 2NF: 1NF + no partial dependencies (every non-key attribute depends on the whole primary key). 3NF: 2NF + no transitive dependencies. Example: Orders(OrderID, ProductID, ProductName, CustomerID) — ProductName depends only on ProductID (not the full composite key), violating 2NF. Fix: separate Products(ProductID, ProductName).",
    feedbackHints: {
      strengths: [
        "Defines each normal form accurately and incrementally",
        "Gives a concrete table-level example",
        "Explains the fix (decomposition)",
      ],
      improvements: [
        "Mention BCNF as a stricter variant of 3NF",
        "Discuss when to intentionally denormalise (read-heavy OLAP vs OLTP)",
        "Clarify what a 'partial dependency' means — it requires a composite key",
      ],
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// OPERATING SYSTEMS QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────
const os = [
  {
    id: "os-1",
    type: "behavioral",
    topic: "os",
    difficulty: "hard",
    text: "Explain deadlock — define it, state the four Coffman conditions required for it to occur, and describe strategies for prevention, avoidance, and detection.",
    idealAnswer:
      "Deadlock: processes indefinitely waiting on resources held by each other. Four conditions (all required simultaneously): 1. Mutual exclusion. 2. Hold and wait. 3. No preemption. 4. Circular wait. Prevention: eliminate one condition (e.g. request all resources at once). Avoidance: Banker's algorithm. Detection: resource allocation graph, then kill/rollback. Recovery: preempt resources, kill processes.",
    feedbackHints: {
      strengths: [
        "All four Coffman conditions stated correctly",
        "Distinguishes prevention vs avoidance vs detection",
        "Gives a concrete algorithm (Banker's) for avoidance",
      ],
      improvements: [
        "Explain why eliminating mutual exclusion is often impractical",
        "Discuss livelock and starvation as related but distinct concepts",
        "Mention real-world examples (database locks, mutex in OS)",
      ],
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MASTER QUESTION BANK
// ─────────────────────────────────────────────────────────────────────────────
export const ALL_QUESTIONS = [
  ...behavioral,
  ...dsa,
  ...system,
  ...reactFrontend,
  ...ml,
  ...python,
  ...db,
  ...os,
];

/**
 * Get questions filtered by topic(s) and difficulty.
 * Returns a shuffled subset of up to `limit` questions.
 */
export function getInterviewQuestions({
  topics = [],
  difficulty = "all",
  limit = 5,
  shuffle = true,
}) {
  let pool = ALL_QUESTIONS;

  // Filter by topic
  if (topics.length > 0) {
    pool = pool.filter((q) => topics.includes(q.topic));
  }

  // Filter by difficulty
  if (difficulty !== "all") {
    pool = pool.filter((q) => q.difficulty === difficulty);
  }

  // Fallback: if pool is empty after filtering, use all questions
  if (pool.length === 0) pool = ALL_QUESTIONS;

  // Shuffle
  if (shuffle) {
    const arr = [...pool];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    pool = arr;
  }

  return pool.slice(0, limit);
}
