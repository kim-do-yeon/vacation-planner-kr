export interface Holiday {
  date: string;
  name: string;
  isSubstitute: boolean;
}

export interface GoldenHolidayPeriod {
  id: string;
  name: string;
  year: number;
  startDate: string;
  endDate: string;
  totalDaysOff: number;
  vacationDaysRequired: number;
  holidays: Holiday[];
  vacationDates: string[];
  efficiency: number;
  description: string;
}

export type SeasonType = "peak" | "off-peak" | "highest-peak";

export interface SeasonPeriod {
  startMonth: number;
  endMonth: number;
  type: SeasonType;
  label: string;
  description: string;
}

export type Destination = "jeju" | "china" | "japan" | "southeast-asia" | "europe";

export interface FlightPriceRange {
  min: number;
  max: number;
}

export interface DestinationInfo {
  id: Destination;
  name: string;
  cities: string;
  emoji: string;
  flightHours: number;
  prices: {
    offPeak: FlightPriceRange;
    peak: FlightPriceRange;
  };
  bestMonths: number[];
}

export interface VacationRecommendation {
  id: string;
  rank: number;
  title: string;
  startDate: string;
  endDate: string;
  vacationDaysUsed: number;
  totalConsecutiveDays: number;
  efficiency: number;
  seasonType: SeasonType;
  holidays: Holiday[];
  vacationDates: string[];
  tags: RecommendationTag[];
}

export type RecommendationTag =
  | "highest-efficiency"
  | "long-break"
  | "budget-friendly"
  | "golden-holiday"
  | "weekend-combo"
  | "off-peak-deal";

export interface UserState {
  selectedYear: number;
  remainingVacationDays: number;
  selectedDates: string[];
}

export type DayType =
  | "regular"
  | "weekend"
  | "holiday"
  | "golden-period"
  | "vacation-selected"
  | "today";

export interface CalendarDay {
  date: string;
  dayOfMonth: number;
  dayOfWeek: number;
  types: DayType[];
  holiday?: Holiday;
  isCurrentMonth: boolean;
  seasonType: SeasonType;
  isGoldenPeriod: boolean;
}

export interface CalendarMonth {
  year: number;
  month: number;
  label: string;
  days: CalendarDay[];
}

export interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export const TAG_LABELS: Record<RecommendationTag, string> = {
  "highest-efficiency": "최고 효율",
  "long-break": "장기 휴가",
  "budget-friendly": "저렴한 시기",
  "golden-holiday": "황금연휴",
  "weekend-combo": "주말 연계",
  "off-peak-deal": "비수기 특가",
};
