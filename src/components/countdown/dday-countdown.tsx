"use client";

import { useMemo } from "react";
import { useCountdown } from "@/hooks/use-countdown";
import { getHolidaysForYear } from "@/lib/data/holidays";
import { detectGoldenHolidays } from "@/lib/algorithms/golden-holiday-detector";
import { toDateString } from "@/lib/utils/date-utils";

interface DdayCountdownProps {
  year: number;
  selectedDates: string[];
}

export function DdayCountdown({ year, selectedDates }: DdayCountdownProps) {
  const target = useMemo(() => {
    const today = toDateString(new Date());
    const holidays = getHolidaysForYear(year);

    // Priority 1: Next user-selected vacation date
    const nextSelected = selectedDates.find((d) => d > today);
    if (nextSelected) {
      return { date: nextSelected, label: "내 다음 연차까지" };
    }

    // Priority 2: Next golden holiday
    const goldenPeriods = detectGoldenHolidays(year, holidays);
    const nextGolden = goldenPeriods.find((g) => g.startDate > today);
    if (nextGolden) {
      return { date: nextGolden.startDate, label: `${nextGolden.name}까지` };
    }

    // Priority 3: Next public holiday
    const nextHoliday = holidays.find((h) => h.date > today);
    if (nextHoliday) {
      return { date: nextHoliday.date, label: `${nextHoliday.name}까지` };
    }

    return { date: `${year + 1}-01-01`, label: "다음 해까지" };
  }, [year, selectedDates]);

  const countdown = useCountdown(target.date);

  const blocks = [
    { value: countdown.days, label: "일" },
    { value: countdown.hours, label: "시간" },
    { value: countdown.minutes, label: "분" },
    { value: countdown.seconds, label: "초" },
  ];

  if (countdown.isExpired) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center text-white">
        <p className="mb-4 text-lg font-medium opacity-90">{target.label}</p>
        <div className="flex justify-center gap-4">
          {blocks.map((block) => (
            <div key={block.label} className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 text-2xl font-bold backdrop-blur-sm sm:h-20 sm:w-20 sm:text-3xl">
                {String(block.value).padStart(2, "0")}
              </div>
              <span className="mt-2 text-xs opacity-80">{block.label}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm opacity-75">
          {target.date.replace(/-/g, ".")}
        </p>
      </div>
    </div>
  );
}
