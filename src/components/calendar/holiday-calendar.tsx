"use client";

import { useMemo } from "react";
import { getHolidaysForYear } from "@/lib/data/holidays";
import { detectGoldenHolidays } from "@/lib/algorithms/golden-holiday-detector";
import { generateCalendarYear } from "@/lib/utils/calendar-utils";
import { MonthGrid } from "./month-grid";

interface HolidayCalendarProps {
  year: number;
  selectedDates: string[];
  onDateClick: (date: string) => void;
}

export function HolidayCalendar({ year, selectedDates, onDateClick }: HolidayCalendarProps) {
  const months = useMemo(() => {
    const holidays = getHolidaysForYear(year);
    const goldenPeriods = detectGoldenHolidays(year, holidays);
    return generateCalendarYear(year, holidays, goldenPeriods, selectedDates);
  }, [year, selectedDates]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-full bg-red-100 ring-1 ring-red-300" /> 공휴일
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-full bg-amber-100 ring-1 ring-amber-300" /> 황금연휴 기간
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-full bg-blue-500" /> 내 연차
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-full ring-2 ring-blue-600" /> 오늘
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {months.map((month) => (
          <MonthGrid
            key={month.month}
            month={month}
            selectedDates={selectedDates}
            onDateClick={onDateClick}
          />
        ))}
      </div>
    </div>
  );
}
