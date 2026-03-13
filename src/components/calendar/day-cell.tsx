"use client";

import { CalendarDay } from "@/types";

interface DayCellProps {
  day: CalendarDay;
  isSelected: boolean;
  onClick: (date: string) => void;
}

export function DayCell({ day, isSelected, onClick }: DayCellProps) {
  if (!day.isCurrentMonth) {
    return <div className="h-10 w-full" />;
  }

  const isHoliday = day.types.includes("holiday");
  const isWeekend = day.types.includes("weekend");
  const isToday = day.types.includes("today");
  const isGolden = day.isGoldenPeriod;

  let bgClass = "";
  let textClass = "text-gray-900";
  let borderClass = "";

  if (isSelected) {
    bgClass = "bg-blue-500";
    textClass = "text-white";
  } else if (isHoliday) {
    bgClass = "bg-red-50";
    textClass = "text-red-600";
  } else if (isGolden) {
    bgClass = "bg-amber-50";
    borderClass = "ring-1 ring-amber-300";
  } else if (isWeekend) {
    textClass = day.dayOfWeek === 0 ? "text-red-400" : "text-blue-400";
  }

  if (isToday && !isSelected) {
    borderClass = "ring-2 ring-blue-600";
  }

  const canClick = !isWeekend && !isHoliday;

  return (
    <div className="relative flex justify-center p-0.5">
      <button
        onClick={() => canClick && onClick(day.date)}
        disabled={!canClick}
        title={day.holiday?.name}
        className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-medium transition-colors ${bgClass} ${textClass} ${borderClass} ${
          canClick ? "cursor-pointer hover:bg-gray-100" : ""
        } ${isSelected ? "hover:bg-blue-600" : ""}`}
      >
        {day.dayOfMonth}
      </button>
      {day.holiday && !isSelected && (
        <div className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-red-500" />
      )}
      {isGolden && !isSelected && !isHoliday && (
        <div className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-amber-500" />
      )}
    </div>
  );
}
