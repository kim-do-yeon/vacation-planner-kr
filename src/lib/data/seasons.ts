import { SeasonPeriod, SeasonType } from "@/types";

export const SEASONS: SeasonPeriod[] = [
  { startMonth: 7, endMonth: 8, type: "highest-peak", label: "극성수기", description: "여름 휴가 시즌, 항공료 최고가" },
  { startMonth: 4, endMonth: 5, type: "peak", label: "성수기", description: "봄 여행 시즌" },
  { startMonth: 9, endMonth: 10, type: "peak", label: "성수기", description: "가을 여행 시즌" },
  { startMonth: 12, endMonth: 2, type: "off-peak", label: "비수기", description: "겨울 비수기, 항공료 저렴" },
  { startMonth: 3, endMonth: 3, type: "off-peak", label: "비수기", description: "초봄 비수기" },
  { startMonth: 6, endMonth: 6, type: "off-peak", label: "비수기", description: "초여름 비수기" },
  { startMonth: 11, endMonth: 11, type: "off-peak", label: "비수기", description: "가을 말 비수기" },
];

export function getSeasonForMonth(month: number): SeasonType {
  for (const s of SEASONS) {
    if (s.startMonth <= s.endMonth) {
      if (month >= s.startMonth && month <= s.endMonth) return s.type;
    } else {
      // wraps around year (e.g., 12-2)
      if (month >= s.startMonth || month <= s.endMonth) return s.type;
    }
  }
  return "off-peak";
}

export function getSeasonInfo(month: number): SeasonPeriod {
  for (const s of SEASONS) {
    if (s.startMonth <= s.endMonth) {
      if (month >= s.startMonth && month <= s.endMonth) return s;
    } else {
      if (month >= s.startMonth || month <= s.endMonth) return s;
    }
  }
  return SEASONS[SEASONS.length - 1];
}

export function getSeasonLabel(type: SeasonType): string {
  switch (type) {
    case "highest-peak": return "극성수기";
    case "peak": return "성수기";
    case "off-peak": return "비수기";
  }
}

export function getSeasonColor(type: SeasonType): string {
  switch (type) {
    case "highest-peak": return "text-red-500";
    case "peak": return "text-orange-500";
    case "off-peak": return "text-green-500";
  }
}

export function getSeasonBgColor(type: SeasonType): string {
  switch (type) {
    case "highest-peak": return "bg-red-100";
    case "peak": return "bg-orange-100";
    case "off-peak": return "bg-green-100";
  }
}
