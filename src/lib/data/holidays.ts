import { Holiday } from "@/types";

export const HOLIDAYS_2025: Holiday[] = [
  { date: "2025-01-01", name: "신정", isSubstitute: false },
  { date: "2025-01-28", name: "설날 연휴", isSubstitute: false },
  { date: "2025-01-29", name: "설날", isSubstitute: false },
  { date: "2025-01-30", name: "설날 연휴", isSubstitute: false },
  { date: "2025-03-01", name: "삼일절", isSubstitute: false },
  { date: "2025-03-03", name: "삼일절 대체공휴일", isSubstitute: true },
  { date: "2025-05-05", name: "어린이날", isSubstitute: false },
  { date: "2025-05-05", name: "석가탄신일", isSubstitute: false },
  { date: "2025-05-06", name: "대체공휴일", isSubstitute: true },
  { date: "2025-06-06", name: "현충일", isSubstitute: false },
  { date: "2025-08-15", name: "광복절", isSubstitute: false },
  { date: "2025-10-03", name: "개천절", isSubstitute: false },
  { date: "2025-10-05", name: "추석 연휴", isSubstitute: false },
  { date: "2025-10-06", name: "추석", isSubstitute: false },
  { date: "2025-10-07", name: "추석 연휴", isSubstitute: false },
  { date: "2025-10-08", name: "추석 대체공휴일", isSubstitute: true },
  { date: "2025-10-09", name: "한글날", isSubstitute: false },
  { date: "2025-12-25", name: "크리스마스", isSubstitute: false },
];

export const HOLIDAYS_2026: Holiday[] = [
  { date: "2026-01-01", name: "신정", isSubstitute: false },
  { date: "2026-02-16", name: "설날 연휴", isSubstitute: false },
  { date: "2026-02-17", name: "설날", isSubstitute: false },
  { date: "2026-02-18", name: "설날 연휴", isSubstitute: false },
  { date: "2026-02-19", name: "설날 대체공휴일", isSubstitute: true },
  { date: "2026-03-01", name: "삼일절", isSubstitute: false },
  { date: "2026-03-02", name: "삼일절 대체공휴일", isSubstitute: true },
  { date: "2026-05-05", name: "어린이날", isSubstitute: false },
  { date: "2026-05-24", name: "석가탄신일", isSubstitute: false },
  { date: "2026-05-25", name: "석가탄신일 대체공휴일", isSubstitute: true },
  { date: "2026-06-06", name: "현충일", isSubstitute: false },
  { date: "2026-08-15", name: "광복절", isSubstitute: false },
  { date: "2026-08-17", name: "광복절 대체공휴일", isSubstitute: true },
  { date: "2026-09-24", name: "추석 연휴", isSubstitute: false },
  { date: "2026-09-25", name: "추석", isSubstitute: false },
  { date: "2026-09-26", name: "추석 연휴", isSubstitute: false },
  { date: "2026-10-03", name: "개천절", isSubstitute: false },
  { date: "2026-10-05", name: "개천절 대체공휴일", isSubstitute: true },
  { date: "2026-10-09", name: "한글날", isSubstitute: false },
  { date: "2026-12-25", name: "크리스마스", isSubstitute: false },
];

export function getHolidaysForYear(year: number): Holiday[] {
  if (year === 2025) return HOLIDAYS_2025;
  if (year === 2026) return HOLIDAYS_2026;
  return [];
}

export function isHolidayDate(date: string, holidays: Holiday[]): Holiday | undefined {
  return holidays.find((h) => h.date === date);
}
