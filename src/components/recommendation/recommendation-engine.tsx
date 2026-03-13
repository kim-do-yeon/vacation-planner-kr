"use client";

import { useMemo } from "react";
import { recommendVacations } from "@/lib/algorithms/vacation-recommender";
import { RecommendationCard } from "./recommendation-card";

interface RecommendationEngineProps {
  remainingDays: number;
  year: number;
  selectedDates: string[];
  onApply: (dates: string[]) => void;
  onRemove: (dates: string[]) => void;
}

export function RecommendationEngine({ remainingDays, year, selectedDates, onApply, onRemove }: RecommendationEngineProps) {
  const recommendations = useMemo(
    () => recommendVacations(remainingDays, year),
    [remainingDays, year]
  );

  const selectedSet = new Set(selectedDates);

  if (remainingDays <= 0) {
    return (
      <div className="rounded-xl border bg-gray-50 p-8 text-center">
        <p className="text-gray-500">남은 연차가 없습니다</p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="rounded-xl border bg-gray-50 p-8 text-center">
        <p className="text-gray-500">추천 일정을 찾을 수 없습니다</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 text-sm text-gray-500">
        연차 <span className="font-bold text-blue-600">{remainingDays}일</span>로 이렇게 쉴 수 있어요!
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((rec) => {
          const isApplied = rec.vacationDates.every((d) => selectedSet.has(d));
          return (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              isApplied={isApplied}
              onApply={onApply}
              onRemove={onRemove}
              year={year}
            />
          );
        })}
      </div>
    </div>
  );
}
