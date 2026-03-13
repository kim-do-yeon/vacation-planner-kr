"use client";

import { GoldenHolidayPeriod } from "@/types";
import { formatDateRange, formatDateKorean, parseDate, isWeekend } from "@/lib/utils/date-utils";
import { getSeasonForMonth, getSeasonLabel, getSeasonColor, getSeasonBgColor } from "@/lib/data/seasons";
import { getEfficiencyStars, calculateEfficiency } from "@/lib/algorithms/efficiency-calculator";
import { isHolidayDate } from "@/lib/data/holidays";
import { getHolidaysForYear } from "@/lib/data/holidays";

interface GoldenHolidayCardProps {
  period: GoldenHolidayPeriod;
  onApply: (dates: string[]) => void;
}

export function GoldenHolidayCard({ period, onApply }: GoldenHolidayCardProps) {
  const month = parseInt(period.startDate.split("-")[1]);
  const seasonType = getSeasonForMonth(month);
  const eff = calculateEfficiency(period.vacationDaysRequired, period.totalDaysOff);
  const holidays = getHolidaysForYear(period.year);
  const vacationSet = new Set(period.vacationDates);

  // Build timeline
  const timelineDays: { date: string; type: "weekend" | "holiday" | "vacation" | "workday" }[] = [];
  let current = period.startDate;
  while (current <= period.endDate) {
    let type: "weekend" | "holiday" | "vacation" | "workday" = "workday";
    if (vacationSet.has(current)) type = "vacation";
    else if (isHolidayDate(current, holidays)) type = "holiday";
    else if (isWeekend(current)) type = "weekend";
    timelineDays.push({ date: current, type });
    const d = parseDate(current);
    d.setDate(d.getDate() + 1);
    current = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  const typeColors = {
    weekend: "bg-gray-300",
    holiday: "bg-red-400",
    vacation: "bg-blue-500 ring-1 ring-blue-600",
    workday: "bg-gray-100",
  };

  const typeLabels = {
    weekend: "주말",
    holiday: "공휴일",
    vacation: "연차",
    workday: "평일",
  };

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-bold text-gray-900">{period.name}</h3>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getSeasonBgColor(seasonType)} ${getSeasonColor(seasonType)}`}>
          {getSeasonLabel(seasonType)}
        </span>
      </div>

      <p className="mb-2 text-sm text-gray-500">
        {formatDateKorean(period.startDate)} ~ {formatDateKorean(period.endDate)}
      </p>

      {/* Timeline */}
      <div className="mb-3 flex gap-1">
        {timelineDays.map((day) => (
          <div
            key={day.date}
            title={`${formatDateKorean(day.date)} - ${typeLabels[day.type]}`}
            className={`h-6 flex-1 rounded ${typeColors[day.type]} transition-transform hover:scale-110`}
          />
        ))}
      </div>

      <div className="mb-3 flex flex-wrap gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-gray-300" /> 주말</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-red-400" /> 공휴일</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-blue-500" /> 연차</span>
      </div>

      <div className="mb-3 grid grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded-lg bg-gray-50 p-2">
          <div className="text-xs text-gray-500">연차</div>
          <div className="font-bold text-blue-600">{period.vacationDaysRequired}일</div>
        </div>
        <div className="rounded-lg bg-gray-50 p-2">
          <div className="text-xs text-gray-500">총 휴일</div>
          <div className="font-bold text-green-600">{period.totalDaysOff}일</div>
        </div>
        <div className="rounded-lg bg-gray-50 p-2">
          <div className="text-xs text-gray-500">효율</div>
          <div className="font-bold text-amber-600">{eff.ratio.toFixed(1)}배</div>
        </div>
      </div>

      <div className="mb-4 text-sm text-amber-600">
        {getEfficiencyStars(eff.rating)} {eff.label}
      </div>

      <button
        onClick={() => onApply(period.vacationDates)}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        이 연휴 적용하기
      </button>
    </div>
  );
}
