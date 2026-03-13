"use client";

import { VacationRecommendation, TAG_LABELS } from "@/types";
import { formatDateKorean, parseDate, isWeekend, addDays, getDaysInMonth, getFirstDayOfMonth } from "@/lib/utils/date-utils";
import { getSeasonLabel, getSeasonColor, getSeasonBgColor } from "@/lib/data/seasons";
import { getEfficiencyStars, calculateEfficiency } from "@/lib/algorithms/efficiency-calculator";
import { isHolidayDate, getHolidaysForYear } from "@/lib/data/holidays";

interface RecommendationCardProps {
  recommendation: VacationRecommendation;
  isApplied: boolean;
  onApply: (dates: string[]) => void;
  onRemove: (dates: string[]) => void;
  year: number;
}

function MiniCalendar({ startDate, endDate, vacationDates, year }: {
  startDate: string;
  endDate: string;
  vacationDates: string[];
  year: number;
}) {
  const holidays = getHolidaysForYear(year);
  const month = parseInt(startDate.split("-")[1]);
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const vacSet = new Set(vacationDates);
  const holidaySet = new Set(holidays.map(h => h.date));

  // Range of the period
  const rangeStart = startDate;
  const rangeEnd = endDate;

  const DAY_HEADERS = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="mb-3 rounded-lg bg-gray-50 p-2.5">
      <div className="mb-1 text-center text-[10px] font-semibold text-gray-600">{month}월</div>
      <div className="grid grid-cols-7 gap-0">
        {DAY_HEADERS.map((d, i) => (
          <div key={d} className={`text-center text-[8px] font-medium ${i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-gray-400"}`}>
            {d}
          </div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`pad-${i}`} className="h-5" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const date = new Date(year, month - 1, day);
          const dow = date.getDay();
          const inRange = dateStr >= rangeStart && dateStr <= rangeEnd;
          const isVac = vacSet.has(dateStr);
          const isHol = holidaySet.has(dateStr);
          const isWknd = dow === 0 || dow === 6;

          let bgClass = "";
          let textClass = "text-gray-400";

          if (inRange) {
            if (isVac) {
              bgClass = "bg-blue-500";
              textClass = "text-white";
            } else if (isHol) {
              bgClass = "bg-red-100";
              textClass = "text-red-600";
            } else if (isWknd) {
              bgClass = "bg-gray-200";
              textClass = "text-gray-600";
            } else {
              bgClass = "bg-amber-100";
              textClass = "text-amber-700";
            }
          } else {
            if (isHol || dow === 0) textClass = "text-red-300";
            else if (dow === 6) textClass = "text-blue-300";
            else textClass = "text-gray-300";
          }

          return (
            <div key={dateStr} className="flex h-5 items-center justify-center">
              <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-medium ${bgClass} ${textClass}`}>
                {day}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 flex justify-center gap-2 text-[8px] text-gray-400">
        <span className="flex items-center gap-0.5"><span className="h-1.5 w-1.5 rounded-full bg-blue-500" />연차</span>
        <span className="flex items-center gap-0.5"><span className="h-1.5 w-1.5 rounded-full bg-red-100 ring-1 ring-red-300" />공휴일</span>
        <span className="flex items-center gap-0.5"><span className="h-1.5 w-1.5 rounded-full bg-gray-200" />주말</span>
      </div>
    </div>
  );
}

function Timeline({ startDate, endDate, vacationDates, year }: {
  startDate: string;
  endDate: string;
  vacationDates: string[];
  year: number;
}) {
  const holidays = getHolidaysForYear(year);
  const vacSet = new Set(vacationDates);
  const days: { date: string; type: "weekend" | "holiday" | "vacation" | "workday" }[] = [];
  let current = startDate;
  while (current <= endDate) {
    let type: "weekend" | "holiday" | "vacation" | "workday" = "workday";
    if (vacSet.has(current)) type = "vacation";
    else if (isHolidayDate(current, holidays)) type = "holiday";
    else if (isWeekend(current)) type = "weekend";
    days.push({ date: current, type });
    current = addDays(current, 1);
  }

  const typeColors = {
    weekend: "bg-gray-300",
    holiday: "bg-red-400",
    vacation: "bg-blue-500",
    workday: "bg-gray-100",
  };

  return (
    <div className="mb-3 flex gap-0.5">
      {days.map((day) => (
        <div
          key={day.date}
          title={formatDateKorean(day.date)}
          className={`h-5 flex-1 rounded-sm ${typeColors[day.type]}`}
        />
      ))}
    </div>
  );
}

export function RecommendationCard({ recommendation: rec, isApplied, onApply, onRemove, year }: RecommendationCardProps) {
  const eff = calculateEfficiency(rec.vacationDaysUsed, rec.totalConsecutiveDays);
  const seasonLabel = getSeasonLabel(rec.seasonType);
  const seasonColor = getSeasonColor(rec.seasonType);
  const seasonBg = getSeasonBgColor(rec.seasonType);

  const handleToggle = () => {
    if (isApplied) {
      onRemove(rec.vacationDates);
    } else {
      onApply(rec.vacationDates);
    }
  };

  return (
    <div className={`flex flex-col rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${isApplied ? "ring-2 ring-blue-500" : ""}`}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
            {rec.rank}
          </span>
          {isApplied && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">
              적용됨
            </span>
          )}
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${seasonBg} ${seasonColor}`}>
          {seasonLabel}
        </span>
      </div>

      <h3 className="mb-1 text-base font-bold text-gray-900">{rec.title}</h3>
      <p className="mb-2 text-sm text-gray-500">
        {formatDateKorean(rec.startDate)} ~ {formatDateKorean(rec.endDate)}
      </p>

      {/* Mini Calendar */}
      <MiniCalendar
        startDate={rec.startDate}
        endDate={rec.endDate}
        vacationDates={rec.vacationDates}
        year={year}
      />

      {/* Timeline bar */}
      <Timeline
        startDate={rec.startDate}
        endDate={rec.endDate}
        vacationDates={rec.vacationDates}
        year={year}
      />

      <div className="mb-3 grid grid-cols-3 gap-2 text-sm">
        <div className="rounded-lg bg-gray-50 p-2 text-center">
          <div className="text-xs text-gray-500">연차</div>
          <div className="font-bold text-blue-600">{rec.vacationDaysUsed}일</div>
        </div>
        <div className="rounded-lg bg-gray-50 p-2 text-center">
          <div className="text-xs text-gray-500">연속 휴일</div>
          <div className="font-bold text-green-600">{rec.totalConsecutiveDays}일</div>
        </div>
        <div className="rounded-lg bg-gray-50 p-2 text-center">
          <div className="text-xs text-gray-500">효율</div>
          <div className="font-bold text-amber-600">{eff.ratio.toFixed(1)}배</div>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-amber-500">{getEfficiencyStars(eff.rating)}</span>
        <span className="text-xs text-gray-500">{eff.label}</span>
      </div>

      <div className="mb-4 flex flex-wrap gap-1">
        {rec.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
            {TAG_LABELS[tag]}
          </span>
        ))}
      </div>

      <button
        onClick={handleToggle}
        className={`mt-auto rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
          isApplied
            ? "border-2 border-blue-500 bg-blue-50 text-blue-700 hover:bg-blue-100"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {isApplied ? "✓ 적용완료 (취소하려면 클릭)" : "이 일정 적용하기"}
      </button>
    </div>
  );
}
