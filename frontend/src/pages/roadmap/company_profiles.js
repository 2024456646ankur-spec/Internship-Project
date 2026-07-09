/**
 * company_profiles.js
 * Hardcoded company-specific interview data for the Career Roadmap module.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * DATA QUALITY POLICY — READ BEFORE EDITING:
 * ─────────────────────────────────────────────────────────────────────────────
 * Every field is annotated:
 *   // SOURCED   — based on well-documented public information
 *                  (official job postings, published interview guides,
 *                   widely-corroborated candidate reports as of last_updated)
 *   // ESTIMATE  — reasonable inference, not directly confirmed
 *   // PLACEHOLDER — needs real research before showing to users
 *
 * CRITICAL: Do NOT remove the last_updated field. The UI will show a staleness
 * disclaimer if last_updated is >6 months old. This is intentional — this
 * dataset WILL go stale and we should be honest about it.
 *
 * FUTURE: A v2 version could supplement this with live search results from
 * Glassdoor/Blind/Leetcode discuss for recent candidate experiences, rather
 * than relying solely on this aging static dataset.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const COMPANY_PROFILES = {

  // ─── GOOGLE ─────────────────────────────────────────────────────────────────
  google: {
    displayName: "Google",
    last_updated: "2025-07",  // SOURCED — reflects widely reported 2024-2025 process

    interview_process: [
      // SOURCED — Consistently reported across multiple public sources
      "Resume / Recruiter screen (initial filter, no technical content)",
      "Phone screen: 1 technical coding round (45-60 min, LeetCode-style DSA)",
      "Onsite: 4-5 rounds total — 2-3 coding rounds (DSA, always), 1 Googleyness/behavioral, 1 system design (SDE2+ fulltime; lighter or absent for intern/SDE1)",
      "Hiring committee review (HC) — panel of engineers reviews your scorecard, no single interviewer decision",
      "Team matching (for full-time SDE offers — you may interview with multiple teams)",
    ],

    dsa_weighting: "very_high",   // SOURCED — DSA is the primary filter at Google
    system_design_weight: "medium", // SOURCED — grows significantly at SDE2+

    system_design_expected: {
      intern:          false,          // SOURCED — interns typically don't get system design
      sde1_fulltime:   "light",        // SOURCED — may appear but not deeply evaluated
      sde2_fulltime:   "moderate",     // SOURCED — one dedicated system design round
      sde3_fulltime:   "heavy",        // SOURCED — deep system design expected
    },

    known_focus_areas: [
      // SOURCED — consistently reported across candidate feedback
      "Optimal time + space complexity required — correct but inefficient solutions are penalized",
      "Ability to write clean, bug-free code quickly under pressure (no IDE hints)",
      "'Googleyness' behavioral round: collaboration, ambiguity handling, humility, intellectual curiosity",
      "Edge cases and testing: interviewers expect you to proactively test your own solution",
      "Clarifying requirements before coding: asking the right questions is evaluated",
    ],

    preferred_languages: [
      // SOURCED — any language is accepted; these are statistically most common
      "Python, C++, Java — any is accepted; C++ and Java have slight prevalence",
    ],

    leadership_principles: null,  // SOURCED — Google does not use an LP-style framework like Amazon

    behavioral_framework: [
      // SOURCED
      "Googleyness: vague but assessed — interviewers look for collaborative, low-ego candidates",
      "STAR format recommended for behavioral answers",
    ],

    prep_focus_for_role: {
      sde_intern:    ["DSA fundamentals", "1-2 meaningful projects to discuss", "Basic CS theory"],
      sde1_fulltime: ["DSA depth (medium-hard LeetCode)", "CS fundamentals", "Light system design awareness"],
      sde2_fulltime: ["DSA mastery", "System design (design scalable systems)", "Leadership/impact in past roles"],
      data_scientist:["Statistics/probability (heavier at Google)", "ML fundamentals", "SQL", "Product sense"],  // ESTIMATE
      ml_engineer:   ["ML fundamentals + systems", "Coding (similar to SDE bar)", "System design for ML pipelines"],  // ESTIMATE
    },

    avg_offer_timeline_weeks: 6,  // ESTIMATE — highly variable; 4-10 weeks commonly reported
  },

  // ─── AMAZON ──────────────────────────────────────────────────────────────────
  amazon: {
    displayName: "Amazon",
    last_updated: "2025-07",  // SOURCED — reflects 2024-2025 reported process

    interview_process: [
      // SOURCED — well-documented on Amazon's own career pages and candidate reports
      "Online Assessment (OA): typically 2 coding problems + work style survey (SDE roles)",
      "Phone screen: 1 coding + behavioral (Leadership Principles) round",
      "Onsite: 4-5 rounds — mix of coding, system design (SDE2+), and heavy LP behavioral questions",
      "Bar Raiser round: a senior Amazon employee from a different team with veto power; evaluates culture fit and raising the bar",
      "Hiring manager debrief — offer decision typically within 1-2 weeks of onsite",
    ],

    dsa_weighting: "high",      // SOURCED — coding rounds are DSA-focused
    system_design_weight: "high", // SOURCED — system design is significant for full-time roles

    system_design_expected: {
      intern:          false,       // SOURCED — interns generally don't get system design
      sde1_fulltime:   "light",     // ESTIMATE — may appear; LP questions dominate
      sde2_fulltime:   "heavy",     // SOURCED — system design is a key evaluation axis
      sde3_fulltime:   "very_heavy",
    },

    known_focus_areas: [
      // SOURCED — Amazon's Leadership Principles are public; their centrality in interviews is widely documented
      "Leadership Principles (LPs) are central — every behavioral question maps to one or more LPs. Know all 16.",
      "Customer Obsession, Ownership, Dive Deep, Deliver Results, Bias for Action are most frequently probed",
      "STAR format for LP answers is expected — vague answers without specifics are penalized",
      "Bar Raiser can veto an offer even if all other interviewers say hire — their bar is typically higher",
      "System design: Amazon emphasizes practical, AWS-native solutions (e.g., S3, DynamoDB, SQS) where relevant",  // ESTIMATE
      "Speed matters: Amazon interviews are known to move quickly; be direct and structured",
    ],

    preferred_languages: [
      "Java is most common among Amazon engineers; Python and C++ also accepted",  // ESTIMATE
    ],

    leadership_principles: [
      // SOURCED — Amazon's 16 LPs are public on their website
      "Customer Obsession", "Ownership", "Invent and Simplify", "Are Right, A Lot",
      "Learn and Be Curious", "Hire and Develop the Best", "Insist on the Highest Standards",
      "Think Big", "Bias for Action", "Frugality", "Earn Trust", "Dive Deep",
      "Have Backbone; Disagree and Commit", "Deliver Results", "Strive to be Earth's Best Employer",
      "Success and Scale Bring Broad Responsibility",
    ],

    behavioral_framework: [
      // SOURCED
      "Prepare 2-3 STAR stories per Leadership Principle for SDE2+ roles",
      "Stories should be recent (within 5 years), specific, and show YOUR individual impact",
      "Bar Raiser will often ask follow-up 'why' questions to test depth",
    ],

    prep_focus_for_role: {
      sde_intern:    ["DSA basics", "2-3 strong LP stories", "Basic OOP/design"],
      sde1_fulltime: ["DSA medium difficulty", "LP stories (5-6 LPs minimum)", "Light system design"],
      sde2_fulltime: ["DSA hard", "Extensive LP prep (all 16)", "System design depth", "Leadership/impact stories"],
      data_scientist:["SQL depth", "Statistics", "ML fundamentals", "LP stories + data-specific LPs"],  // ESTIMATE
      ml_engineer:   ["ML systems design", "Coding (SDE-similar bar)", "LP stories", "MLOps awareness"],  // ESTIMATE
    },

    avg_offer_timeline_weeks: 4,  // ESTIMATE — Amazon is typically faster than Google
  },

  // ─── META (FACEBOOK) ─────────────────────────────────────────────────────────
  meta: {
    displayName: "Meta",
    last_updated: "2025-07",  // SOURCED — reflects 2024-2025 reported process

    interview_process: [
      // SOURCED — widely reported; Meta publishes some of this on their careers page
      "Initial recruiter screen (no technical content)",
      "Technical phone screen: 1 coding round (DSA, similar to LeetCode medium-hard)",
      "Onsite (virtual or in-person): typically 5 rounds —",
      "  2 coding rounds (DSA, speed emphasized)",
      "  1-2 system design rounds (SDE2+; 1 for E4, 2 for E5+)",
      "  1 behavioral round (focuses on cross-functional collaboration, impact, culture)",
      "No HC committee — individual hiring manager makes the call with recruiter",
    ],

    dsa_weighting: "very_high",    // SOURCED — coding bar at Meta is known to be high, speed matters
    system_design_weight: "high",  // SOURCED — system design is critical for E4+ (SDE2 equivalent)

    system_design_expected: {
      intern:          false,       // SOURCED — interns don't typically get system design
      sde1_fulltime:   "moderate",  // SOURCED — E3/E4 at Meta gets system design rounds
      sde2_fulltime:   "heavy",     // SOURCED — E5 expects deep, large-scale system design
      sde3_fulltime:   "very_heavy",
    },

    known_focus_areas: [
      // SOURCED
      "Coding speed is explicitly evaluated — Meta interviewers often care about solving the problem quickly, not just correctly",
      "Preferred to ask about scalability early in system design — 'design for billions of users'",
      "Behavioral round uses a 'values' framework, not formal LPs like Amazon — focuses on impact, collaboration, growth",
      "Product sense can appear for PM-adjacent roles and some ML/data roles",  // ESTIMATE
      "Interviewers are encouraged to hire for potential at the role level, not just current ability",  // ESTIMATE
    ],

    preferred_languages: [
      "C++, Python, Java — any accepted; C++ has traditional popularity at Meta infrastructure teams",  // ESTIMATE
    ],

    leadership_principles: null,  // SOURCED — Meta does not use formal LPs

    behavioral_framework: [
      // SOURCED
      "Focus on impact: 'What did you specifically do and what was the measurable result?'",
      "Cross-functional collaboration stories are valued",
      "Meta's values: Move Fast, Be Direct, Build Social Value, Live in the Future — know these",  // ESTIMATE
    ],

    prep_focus_for_role: {
      sde_intern:    ["DSA (speed + correctness)", "1-2 strong projects", "Basic system awareness"],
      sde1_fulltime: ["DSA hard (speed focus)", "System design fundamentals", "Behavioral/impact stories"],
      sde2_fulltime: ["DSA mastery under time pressure", "Large-scale system design", "Strong impact stories"],
      data_scientist:["SQL", "Statistics/experimentation", "Product sense", "ML basics"],  // ESTIMATE
      ml_engineer:   ["ML systems", "Coding (SDE bar)", "Large-scale ML design", "Experimentation"],  // ESTIMATE
    },

    avg_offer_timeline_weeks: 3,  // ESTIMATE — Meta is known to move relatively quickly
  },

  // ─── GENERIC / ANY COMPANY ───────────────────────────────────────────────────
  // Used when user selects "Any / Not sure yet" or when company is not in profiles.
  generic: {
    displayName: "General Industry",
    last_updated: "2025-07",

    interview_process: [
      // SOURCED — represents common industry-average SDE hiring process
      "Resume / recruiter screen",
      "Technical phone screen: 1-2 coding rounds",
      "Onsite: 3-5 rounds (coding, system design for mid-senior, behavioral)",
      "Offer decision within 1-2 weeks of onsite",
    ],

    dsa_weighting: "high",
    system_design_weight: "medium",

    system_design_expected: {
      intern:          false,
      sde1_fulltime:   "light",
      sde2_fulltime:   "moderate",
      sde3_fulltime:   "heavy",
    },

    known_focus_areas: [
      "DSA fundamentals: arrays, trees, graphs, dynamic programming",
      "Clean, readable code with edge case handling",
      "System design: scalability, databases, APIs, caching for mid-senior roles",
      "Behavioral: STAR format, demonstrating ownership and collaboration",
      "Resume depth: be ready to speak to every line of your resume in detail",
    ],

    preferred_languages: [
      "Any — Python and Java are most widely accepted across companies",
    ],

    leadership_principles: null,

    behavioral_framework: [
      "STAR format (Situation, Task, Action, Result) for behavioral questions",
      "Prepare stories covering: conflict resolution, leadership, failure, technical decision-making",
    ],

    prep_focus_for_role: {
      sde_intern:    ["DSA basics", "1-2 strong projects", "Basic CS theory"],
      sde1_fulltime: ["DSA medium", "CS fundamentals", "1-2 system design concepts", "Behavioral basics"],
      sde2_fulltime: ["DSA hard", "System design depth", "Leadership/impact stories"],
      data_scientist:["SQL", "Statistics", "ML fundamentals", "Project portfolio"],
      ml_engineer:   ["ML fundamentals + systems", "Coding", "System design for ML", "Framework proficiency"],
    },

    avg_offer_timeline_weeks: 4,
  },
};

// ── Available companies for the dropdown ──────────────────────────────────────
export const COMPANY_OPTIONS = [
  { value: "generic",   label: "Any / Not sure yet" },
  { value: "google",    label: "Google" },
  { value: "amazon",    label: "Amazon" },
  { value: "meta",      label: "Meta" },
  // PLACEHOLDER entries — add profiles above before enabling in dropdown
  // { value: "microsoft", label: "Microsoft" },
  // { value: "apple",     label: "Apple" },
  // { value: "netflix",   label: "Netflix" },
  // { value: "uber",      label: "Uber" },
];

/**
 * Get the company profile for a given key.
 * Falls back to "generic" with a flag if key not found.
 *
 * @param {string} companyKey
 * @returns {{ profile: object, usedFallback: boolean }}
 */
export function getCompanyProfile(companyKey) {
  const profile = COMPANY_PROFILES[companyKey];
  if (!profile) {
    return { profile: COMPANY_PROFILES.generic, usedFallback: true };
  }
  return { profile, usedFallback: false };
}

/**
 * Check if a company profile's data is stale (>6 months old).
 *
 * @param {string} lastUpdated  — "YYYY-MM" format
 * @returns {boolean}
 */
export function isProfileStale(lastUpdated) {
  if (!lastUpdated) return true;
  const [year, month] = lastUpdated.split("-").map(Number);
  const profileDate = new Date(year, month - 1, 1);
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  return profileDate < sixMonthsAgo;
}
