"use client";

import { getSeasonForMonth } from "@/lib/data/seasons";
import { getSeasonLabel, getSeasonColor, getSeasonBgColor } from "@/lib/data/seasons";

interface VacationInputFormProps {
  remainingDays: number;
  selectedYear: number;
  selectedDatesCount: number;
  onDaysChange: (days: number) => void;
  onYearChange: (year: number) => void;
}

export function VacationInputForm({
  remainingDays,
  selectedYear,
  selectedDatesCount,
  onDaysChange,
  onYearChange,
}: VacationInputFormProps) {
  const currentMonth = new Date().getMonth() + 1;
  const currentSeason = getSeasonForMonth(currentMonth);
  const seasonLabel = getSeasonLabel(currentSeason);
  const seasonColor = getSeasonColor(currentSeason);
  const seasonBg = getSeasonBgColor(currentSeason);

  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="py-16 text-center">
        <h1 className="mb-2 text-4xl font-bold text-gray-900">
          남은 연차를 똑똑하게 사용하세요
        </h1>
        <p className="mb-10 text-lg text-gray-500">
          황금연휴, 비수기 항공료, 최적의 연차 사용 시기를 한눈에
        </p>

        <div className="mx-auto flex max-w-lg flex-col items-center gap-6 rounded-2xl border bg-white p-8 shadow-sm">
          <div className="flex w-full items-center gap-4">
            <label className="whitespace-nowrap text-sm font-medium text-gray-700">
              남은 연차
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onDaysChange(remainingDays - 1)}
                disabled={remainingDays <= 0}
                className="flex h-8 w-8 items-center justify-center rounded-full border text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-30"
              >
                -
              </button>
              <input
                type="number"
                value={remainingDays}
                onChange={(e) => onDaysChange(parseInt(e.target.value) || 0)}
                min={0}
                max={25}
                className="w-16 rounded-lg border px-3 py-2 text-center text-xl font-bold"
              />
              <button
                onClick={() => onDaysChange(remainingDays + 1)}
                disabled={remainingDays >= 25}
                className="flex h-8 w-8 items-center justify-center rounded-full border text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-30"
              >
                +
              </button>
              <span className="text-sm text-gray-500">일</span>
            </div>
          </div>

          <div className="flex w-full items-center gap-4">
            <label className="whitespace-nowrap text-sm font-medium text-gray-700">
              연도 선택
            </label>
            <div className="flex gap-2">
              {[2025, 2026].map((year) => (
                <button
                  key={year}
                  onClick={() => onYearChange(year)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    selectedYear === year
                      ? "bg-blue-600 text-white"
                      : "border bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {year}년
                </button>
              ))}
            </div>
          </div>

          <div className="flex w-full items-center justify-between border-t pt-4">
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${seasonBg} ${seasonColor}`}>
                현재 {seasonLabel}
              </span>
            </div>
            {selectedDatesCount > 0 && (
              <span className="text-sm text-gray-500">
                선택된 연차: <span className="font-bold text-blue-600">{selectedDatesCount}</span>/{remainingDays}일
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
