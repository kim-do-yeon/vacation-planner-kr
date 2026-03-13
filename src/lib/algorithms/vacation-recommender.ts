import { Holiday, VacationRecommendation, RecommendationTag, SeasonType } from "@/types";
import { getHolidaysForYear } from "@/lib/data/holidays";
import { getSeasonForMonth } from "@/lib/data/seasons";
import { detectGoldenHolidays } from "./golden-holiday-detector";
import { isWeekend, addDays, daysBetween, toDateString, parseDate } from "@/lib/utils/date-utils";

interface Strategy {
  title: string;
  startDate: string;
  endDate: string;
  vacationDates: string[];
  vacationDaysUsed: number;
  totalConsecutiveDays: number;
  efficiency: number;
  seasonType: SeasonType;
  holidays: Holiday[];
  tags: RecommendationTag[];
  score: number;
}

function findWeekendExtensions(year: number, holidays: Holiday[]): Strategy[] {
  const results: Strategy[] = [];
  const holidaySet = new Set(holidays.map((h) => h.date));

  // Find Mondays and Fridays that create 3-day weekends
  for (let month = 1; month <= 12; month++) {
    const daysInMonth = new Date(year, month, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const date = parseDate(dateStr);
      const dow = date.getDay();

      if (holidaySet.has(dateStr) || isWeekend(dateStr)) continue;

      // Friday - extends to Sat-Sun
      if (dow === 5) {
        const sat = addDays(dateStr, 1);
        const sun = addDays(dateStr, 2);
        if (!holidaySet.has(sat) && !holidaySet.has(sun)) {
          const seasonType = getSeasonForMonth(month);
          results.push({
            title: `${month}월 금요일 연차`,
            startDate: dateStr,
            endDate: sun,
            vacationDates: [dateStr],
            vacationDaysUsed: 1,
            totalConsecutiveDays: 3,
            efficiency: 3,
            seasonType,
            holidays: [],
            tags: ["weekend-combo"],
            score: 0,
          });
        }
      }

      // Monday - extends from Sat-Sun
      if (dow === 1) {
        const sat = addDays(dateStr, -2);
        const sun = addDays(dateStr, -1);
        if (!holidaySet.has(sat) && !holidaySet.has(sun)) {
          const seasonType = getSeasonForMonth(month);
          results.push({
            title: `${month}월 월요일 연차`,
            startDate: sat,
            endDate: dateStr,
            vacationDates: [dateStr],
            vacationDaysUsed: 1,
            totalConsecutiveDays: 3,
            efficiency: 3,
            seasonType,
            holidays: [],
            tags: ["weekend-combo"],
            score: 0,
          });
        }
      }
    }
  }

  return results;
}

function findOffPeakWeeks(year: number, holidays: Holiday[]): Strategy[] {
  const results: Strategy[] = [];
  const offPeakMonths = [1, 2, 3, 6, 11, 12];

  for (const month of offPeakMonths) {
    // Find Mon-Fri weeks in this month
    const daysInMonth = new Date(year, month, 0).getDate();
    for (let day = 1; day <= daysInMonth - 4; day++) {
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const date = parseDate(dateStr);
      if (date.getDay() !== 1) continue; // Must start on Monday

      const fri = addDays(dateStr, 4);
      const prevSat = addDays(dateStr, -2);
      const nextSun = addDays(dateStr, 6);

      // Check if all 5 weekdays are available
      const weekDays: string[] = [];
      let hasConflict = false;
      for (let i = 0; i < 5; i++) {
        const d = addDays(dateStr, i);
        if (isWeekend(d) || holidays.some((h) => h.date === d)) {
          hasConflict = true;
          break;
        }
        weekDays.push(d);
      }
      if (hasConflict) continue;

      results.push({
        title: `${month}월 풀위크 휴가`,
        startDate: prevSat,
        endDate: nextSun,
        vacationDates: weekDays,
        vacationDaysUsed: 5,
        totalConsecutiveDays: 9,
        efficiency: 9 / 5,
        seasonType: "off-peak",
        holidays: [],
        tags: ["long-break", "off-peak-deal", "budget-friendly"],
        score: 0,
      });
    }
  }

  return results;
}

function scoreStrategy(strategy: Strategy): number {
  let score = 0;

  // Efficiency weight: 40%
  score += strategy.efficiency * 10;

  // Off-peak bonus: 25%
  if (strategy.seasonType === "off-peak") score += 25;
  else if (strategy.seasonType === "peak") score += 5;

  // Golden holiday bonus: 20%
  if (strategy.tags.includes("golden-holiday")) score += 20;

  // Proximity bonus: 15% (closer dates score higher)
  const today = toDateString(new Date());
  const daysUntil = daysBetween(today, strategy.startDate);
  if (daysUntil > 0) {
    score += Math.max(0, 15 - daysUntil / 20);
  }

  return score;
}

export function recommendVacations(
  remainingDays: number,
  year: number
): VacationRecommendation[] {
  if (remainingDays <= 0) return [];

  const holidays = getHolidaysForYear(year);
  const goldenPeriods = detectGoldenHolidays(year, holidays);

  const strategies: Strategy[] = [];

  // Strategy A: Golden holiday fill-ins
  for (const gp of goldenPeriods) {
    if (gp.vacationDaysRequired <= remainingDays) {
      const month = parseInt(gp.startDate.split("-")[1]);
      strategies.push({
        title: gp.name,
        startDate: gp.startDate,
        endDate: gp.endDate,
        vacationDates: gp.vacationDates,
        vacationDaysUsed: gp.vacationDaysRequired,
        totalConsecutiveDays: gp.totalDaysOff,
        efficiency: gp.efficiency,
        seasonType: getSeasonForMonth(month),
        holidays: gp.holidays,
        tags: ["golden-holiday", "highest-efficiency"],
        score: 0,
      });
    }
  }

  // Strategy B: Weekend extensions (only include some for variety)
  const weekendExts = findWeekendExtensions(year, holidays);
  // Filter to off-peak ones and limit
  const offPeakExts = weekendExts.filter((e) => e.seasonType === "off-peak");
  const peakExts = weekendExts.filter((e) => e.seasonType !== "off-peak");
  strategies.push(...offPeakExts.slice(0, 4));
  strategies.push(...peakExts.slice(0, 2));

  // Strategy C: Full-week off-peak blocks
  if (remainingDays >= 5) {
    const offPeakWeeks = findOffPeakWeeks(year, holidays);
    strategies.push(...offPeakWeeks.slice(0, 3));
  }

  // Score all strategies
  for (const s of strategies) {
    s.score = scoreStrategy(s);
  }

  // Sort by score descending
  strategies.sort((a, b) => b.score - a.score);

  // Greedy select: pick non-overlapping strategies that fit
  const selected: Strategy[] = [];
  let daysLeft = remainingDays;
  const usedDates = new Set<string>();

  for (const s of strategies) {
    if (s.vacationDaysUsed > daysLeft) continue;

    // Check overlap
    const hasOverlap = s.vacationDates.some((d) => usedDates.has(d));
    if (hasOverlap) continue;

    selected.push(s);
    daysLeft -= s.vacationDaysUsed;
    s.vacationDates.forEach((d) => usedDates.add(d));

    if (daysLeft <= 0) break;
  }

  // Convert to recommendations
  return selected.map((s, i) => ({
    id: `rec-${i}`,
    rank: i + 1,
    title: s.title,
    startDate: s.startDate,
    endDate: s.endDate,
    vacationDaysUsed: s.vacationDaysUsed,
    totalConsecutiveDays: s.totalConsecutiveDays,
    efficiency: s.efficiency,
    seasonType: s.seasonType,
    holidays: s.holidays,
    vacationDates: s.vacationDates,
    tags: s.tags,
  }));
}
