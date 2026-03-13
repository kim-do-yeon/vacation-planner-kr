import { Holiday } from "@/types";

const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(dateStr: string, days: number): string {
  const date = parseDate(dateStr);
  date.setDate(date.getDate() + days);
  return toDateString(date);
}

export function daysBetween(start: string, end: string): number {
  const s = parseDate(start);
  const e = parseDate(end);
  return Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

export function isWeekend(dateStr: string): boolean {
  const d = parseDate(dateStr).getDay();
  return d === 0 || d === 6;
}

export function getDayOfWeek(dateStr: string): string {
  return DAY_NAMES[parseDate(dateStr).getDay()];
}

export function formatDateKorean(dateStr: string): string {
  const date = parseDate(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}(${DAY_NAMES[date.getDay()]})`;
}

export function formatDateRange(start: string, end: string): string {
  const s = parseDate(start);
  const e = parseDate(end);
  return `${s.getMonth() + 1}/${s.getDate()} ~ ${e.getMonth() + 1}/${e.getDate()}`;
}

export function isHoliday(dateStr: string, holidays: Holiday[]): boolean {
  return holidays.some((h) => h.date === dateStr);
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

export function isToday(dateStr: string): boolean {
  return dateStr === toDateString(new Date());
}

export function getAllDatesInRange(start: string, end: string): string[] {
  const dates: string[] = [];
  let current = start;
  while (current <= end) {
    dates.push(current);
    current = addDays(current, 1);
  }
  return dates;
}

export function getWorkdaysInRange(start: string, end: string, holidays: Holiday[]): string[] {
  const dates = getAllDatesInRange(start, end);
  return dates.filter((d) => !isWeekend(d) && !isHoliday(d, holidays));
}
