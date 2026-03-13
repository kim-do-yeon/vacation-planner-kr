"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./use-local-storage";
import { UserState } from "@/types";

const DEFAULT_STATE: UserState = {
  selectedYear: new Date().getFullYear() >= 2026 ? 2026 : 2025,
  remainingVacationDays: 15,
  selectedDates: [],
};

export function useVacationStore() {
  const [state, setState] = useLocalStorage<UserState>("vacation-planner-state", DEFAULT_STATE);

  const setRemainingDays = useCallback((days: number) => {
    setState((prev) => ({ ...prev, remainingVacationDays: Math.max(0, Math.min(25, days)) }));
  }, [setState]);

  const setSelectedYear = useCallback((year: number) => {
    setState((prev) => ({ ...prev, selectedYear: year, selectedDates: [] }));
  }, [setState]);

  const toggleVacationDate = useCallback((date: string) => {
    setState((prev) => {
      const exists = prev.selectedDates.includes(date);
      if (exists) {
        return { ...prev, selectedDates: prev.selectedDates.filter((d) => d !== date) };
      }
      if (prev.selectedDates.length >= prev.remainingVacationDays) return prev;
      return { ...prev, selectedDates: [...prev.selectedDates, date].sort() };
    });
  }, [setState]);

  const clearSelectedDates = useCallback(() => {
    setState((prev) => ({ ...prev, selectedDates: [] }));
  }, [setState]);

  const applyRecommendation = useCallback((dates: string[]) => {
    setState((prev) => {
      const newDates = new Set([...prev.selectedDates, ...dates]);
      if (newDates.size > prev.remainingVacationDays) return prev;
      return { ...prev, selectedDates: Array.from(newDates).sort() };
    });
  }, [setState]);

  const removeRecommendation = useCallback((dates: string[]) => {
    setState((prev) => {
      const removeSet = new Set(dates);
      return { ...prev, selectedDates: prev.selectedDates.filter((d) => !removeSet.has(d)) };
    });
  }, [setState]);

  return {
    state,
    setRemainingDays,
    setSelectedYear,
    toggleVacationDate,
    clearSelectedDates,
    applyRecommendation,
    removeRecommendation,
  };
}
