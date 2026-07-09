/**
 * useRoadmapStorage.js
 * Custom hook for reading/writing Career Roadmap state to localStorage.
 *
 * localStorage key: "friday.careerRoadmap.v1"
 * Structure:
 *   { goalInput, skillProfile, roadmap, checklistState, roadmapStartDate, version: 1 }
 *
 * v1 limitation: localStorage is device-specific. Clearing cache loses all data.
 * A future version should persist to the backend under the user's account.
 *
 * Import pattern:
 *   const { roadmapState, saveGoalInput, saveSkillProfile, saveRoadmap,
 *           toggleChecklistItem, extendTimeline, clearRoadmap } = useRoadmapStorage();
 */
import { useState, useCallback } from "react";

const STORAGE_KEY = "friday.careerRoadmap.v1";

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.version !== 1) return null; // schema mismatch → treat as empty
    return parsed;
  } catch {
    return null;
  }
}

function writeStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, version: 1 }));
  } catch (e) {
    console.warn("[CareerRoadmap] localStorage write failed:", e.message);
  }
}

export function useRoadmapStorage() {
  const [roadmapState, setRoadmapState] = useState(() => readStorage());

  // ── Internal helper: merge + persist + update state ──────────────────────
  const updateAndPersist = useCallback((updater) => {
    setRoadmapState((prev) => {
      const next = updater(prev ?? {});
      writeStorage(next);
      return next;
    });
  }, []);

  // ── Save goal input (Step 1) ──────────────────────────────────────────────
  const saveGoalInput = useCallback((goalInput) => {
    updateAndPersist((prev) => ({ ...prev, goalInput }));
  }, [updateAndPersist]);

  // ── Save skill profile (Step 2) ───────────────────────────────────────────
  const saveSkillProfile = useCallback((skillProfile) => {
    updateAndPersist((prev) => ({ ...prev, skillProfile }));
  }, [updateAndPersist]);

  // ── Save full generated roadmap ───────────────────────────────────────────
  const saveRoadmap = useCallback((roadmap) => {
    // Build initial checklist state from the roadmap weeks
    const checklistState = {};
    (roadmap.weeks ?? []).forEach((week) => {
      checklistState[week.weekNumber] = {};
      (week.checklistItems ?? []).forEach((item) => {
        checklistState[week.weekNumber][item.id] = false;
      });
    });

    updateAndPersist((prev) => ({
      ...prev,
      roadmap,
      checklistState,
      roadmapStartDate: prev?.roadmapStartDate ?? new Date().toISOString().split("T")[0],
    }));
  }, [updateAndPersist]);

  // ── Toggle a checklist item ────────────────────────────────────────────────
  const toggleChecklistItem = useCallback((weekNumber, itemId) => {
    updateAndPersist((prev) => {
      const cs = prev?.checklistState ?? {};
      const weekCs = cs[weekNumber] ?? {};
      return {
        ...prev,
        checklistState: {
          ...cs,
          [weekNumber]: { ...weekCs, [itemId]: !weekCs[itemId] },
        },
      };
    });
  }, [updateAndPersist]);

  // ── Extend timeline: push all future weeks' dates by N days ──────────────
  const extendTimeline = useCallback((daysToAdd) => {
    updateAndPersist((prev) => {
      if (!prev?.roadmap) return prev;
      const updatedWeeks = prev.roadmap.weeks.map((week) => {
        const currentStart = new Date(week.calendarStartDate);
        currentStart.setDate(currentStart.getDate() + daysToAdd);
        return {
          ...week,
          calendarStartDate: currentStart.toISOString().split("T")[0],
        };
      });
      return {
        ...prev,
        roadmap: { ...prev.roadmap, weeks: updatedWeeks, lastRegeneratedAt: new Date().toISOString() },
      };
    });
  }, [updateAndPersist]);

  // ── Replace remaining weeks (for compress flow) ───────────────────────────
  const replaceRemainingWeeks = useCallback((currentWeekNumber, newWeeks) => {
    updateAndPersist((prev) => {
      if (!prev?.roadmap) return prev;
      const completedWeeks = prev.roadmap.weeks.filter((w) => w.weekNumber < currentWeekNumber);
      const allWeeks = [...completedWeeks, ...newWeeks];

      // Merge checklist state — keep done items for completed weeks
      const newCs = { ...(prev.checklistState ?? {}) };
      newWeeks.forEach((week) => {
        newCs[week.weekNumber] = {};
        (week.checklistItems ?? []).forEach((item) => {
          newCs[week.weekNumber][item.id] = false;
        });
      });

      return {
        ...prev,
        roadmap: {
          ...prev.roadmap,
          weeks: allWeeks,
          lastRegeneratedAt: new Date().toISOString(),
        },
        checklistState: newCs,
      };
    });
  }, [updateAndPersist]);

  // ── Clear all roadmap data (for regeneration) ─────────────────────────────
  const clearRoadmap = useCallback((keepGoalInput = false) => {
    updateAndPersist((prev) => {
      const next = { version: 1 };
      if (keepGoalInput && prev?.goalInput) next.goalInput = prev.goalInput;
      if (keepGoalInput && prev?.skillProfile) next.skillProfile = prev.skillProfile;
      return next;
    });
  }, [updateAndPersist]);

  // ── Derived helpers ────────────────────────────────────────────────────────

  /** Get the checked state of a specific item */
  const isItemDone = useCallback((weekNumber, itemId) => {
    return !!(roadmapState?.checklistState?.[weekNumber]?.[itemId]);
  }, [roadmapState]);

  /** Get overall checklist completion % */
  const getOverallProgress = useCallback(() => {
    const roadmap = roadmapState?.roadmap;
    if (!roadmap) return 0;
    let total = 0, done = 0;
    roadmap.weeks.forEach((week) => {
      (week.checklistItems ?? []).forEach((item) => {
        total++;
        if (roadmapState.checklistState?.[week.weekNumber]?.[item.id]) done++;
      });
    });
    return total === 0 ? 0 : Math.round((done / total) * 100);
  }, [roadmapState]);

  /** Get the current "active" week based on calendar date */
  const getCurrentWeek = useCallback(() => {
    const roadmap = roadmapState?.roadmap;
    if (!roadmap) return null;
    const today = new Date();
    let currentWeek = null;
    for (const week of roadmap.weeks) {
      const start = new Date(week.calendarStartDate);
      if (start <= today) currentWeek = week;
      else break;
    }
    return currentWeek ?? roadmap.weeks[0] ?? null;
  }, [roadmapState]);

  /** Get week checklist completion % */
  const getWeekProgress = useCallback((weekNumber) => {
    const roadmap = roadmapState?.roadmap;
    if (!roadmap) return 0;
    const week = roadmap.weeks.find((w) => w.weekNumber === weekNumber);
    if (!week?.checklistItems?.length) return 0;
    const done = week.checklistItems.filter(
      (item) => roadmapState.checklistState?.[weekNumber]?.[item.id]
    ).length;
    return Math.round((done / week.checklistItems.length) * 100);
  }, [roadmapState]);

  return {
    roadmapState,
    saveGoalInput,
    saveSkillProfile,
    saveRoadmap,
    toggleChecklistItem,
    extendTimeline,
    replaceRemainingWeeks,
    clearRoadmap,
    isItemDone,
    getOverallProgress,
    getCurrentWeek,
    getWeekProgress,
  };
}
