import { useCallback } from "react";

const STORAGE_KEY = "neuralquiz_history";
const MAX_ENTRIES = 50;

export function useLocalHistory() {
  const getHistory = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    } catch {
      return [];
    }
  }, []);

  const saveAttempt = useCallback((attempt) => {
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      // Prepend newest, cap at MAX_ENTRIES
      const updated = [{ id: crypto.randomUUID(), ...attempt }, ...existing].slice(0, MAX_ENTRIES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore quota errors
    }
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { getHistory, saveAttempt, clearHistory };
}
