"use client";

import { CalendarMonth } from "@/types";
import { DayCell } from "./day-cell";

interface MonthGridProps {
  month: CalendarMonth;
  selectedDates: string[];
  onDateClick: (date: string) => void;
}

const DAY_HEADERS = ["일", "월", "화", "수", "목", "금", "토"];

export function MonthGrid({ month, selectedDates, onDateClick }: MonthGridProps) {
  const selectedSet = new Set(selectedDates);

  return (
    <div className="rounded-xl border bg-white p-3">
      <h3 className="mb-2 text-center text-sm font-bold text-gray-900">
        {month.label}
      </h3>
      <div className="grid grid-cols-7 gap-0">
        {DAY_HEADERS.map((d, i) => (
          <div
            key={d}
            className={`pb-1 text-center text-[10px] font-medium ${
              i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-gray-400"
            }`}
          >
            {d}
          </div>
        ))}
        {month.days.map((day, i) => (
          <DayCell
            key={i}
            day={day}
            isSelected={selectedSet.has(day.date)}
            onClick={onDateClick}
          />
        ))}
      </div>
    </div>
  );
}
