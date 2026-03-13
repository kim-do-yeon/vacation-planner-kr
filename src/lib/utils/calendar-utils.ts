import { CalendarDay, CalendarMonth, Holiday, GoldenHolidayPeriod, DayType } from "@/types";
import { getSeasonForMonth } from "@/lib/data/seasons";
import { toDateString, isToday, getDaysInMonth, getFirstDayOfMonth } from "@/lib/utils/date-utils";

export function generateCalendarYear(
  year: number,
  holidays: Holiday[],
  goldenPeriods: GoldenHolidayPeriod[],
  selectedDates: string[]
): CalendarMonth[] {
  const months: CalendarMonth[] = [];
  for (let m = 1; m <= 12; m++) {
    months.push(generateMonth(year, m, holidays, goldenPeriods, selectedDates));
  }
  return months;
}

function generateMonth(
  year: number,
  month: number,
  holidays: Holiday[],
  goldenPeriods: GoldenHolidayPeriod[],
  selectedDates: string[]
): CalendarMonth {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const holidayMap = new Map<string, Holiday>();
  holidays.forEach((h) => holidayMap.set(h.date, h));

  const goldenDates = new Set<string>();
  goldenPeriods.forEach((gp) => {
    let current = gp.startDate;
    while (current <= gp.endDate) {
      goldenDates.add(current);
      const d = new Date(current);
      d.setDate(d.getDate() + 1);
      current = toDateString(d);
    }
  });

  const selectedSet = new Set(selectedDates);
  const days: CalendarDay[] = [];

  // Padding for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push({
      date: "",
      dayOfMonth: 0,
      dayOfWeek: i,
      types: [],
      isCurrentMonth: false,
      seasonType: getSeasonForMonth(month),
      isGoldenPeriod: false,
    });
  }

  // Actual days of the month
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const date = new Date(year, month - 1, d);
    const dayOfWeek = date.getDay();
    const types: DayType[] = [];

    if (dayOfWeek === 0 || dayOfWeek === 6) types.push("weekend");
    if (holidayMap.has(dateStr)) types.push("holiday");
    if (isToday(dateStr)) types.push("today");
    if (selectedSet.has(dateStr)) types.push("vacation-selected");
    if (goldenDates.has(dateStr)) types.push("golden-period");
    if (types.length === 0) types.push("regular");

    days.push({
      date: dateStr,
      dayOfMonth: d,
      dayOfWeek,
      types,
      holiday: holidayMap.get(dateStr),
      isCurrentMonth: true,
      seasonType: getSeasonForMonth(month),
      isGoldenPeriod: goldenDates.has(dateStr),
    });
  }

  // Padding for remaining cells (fill to complete last row)
  const remaining = 7 - (days.length % 7);
  if (remaining < 7) {
    for (let i = 0; i < remaining; i++) {
      days.push({
        date: "",
        dayOfMonth: 0,
        dayOfWeek: (firstDay + daysInMonth + i) % 7,
        types: [],
        isCurrentMonth: false,
        seasonType: getSeasonForMonth(month),
        isGoldenPeriod: false,
      });
    }
  }

  const MONTH_NAMES = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

  return {
    year,
    month,
    label: MONTH_NAMES[month - 1],
    days,
  };
}
