import { VacationRecommendation, TAG_LABELS } from "@/types";
import { formatDateRange } from "@/lib/utils/date-utils";
import { getSeasonLabel, getSeasonColor, getSeasonBgColor } from "@/lib/data/seasons";
import { getEfficiencyStars } from "@/lib/algorithms/efficiency-calculator";
import { calculateEfficiency } from "@/lib/algorithms/efficiency-calculator";

interface RecommendationCardProps {
  recommendation: VacationRecommendation;
  onApply: (dates: string[]) => void;
}

export function RecommendationCard({ recommendation: rec, onApply }: RecommendationCardProps) {
  const eff = calculateEfficiency(rec.vacationDaysUsed, rec.totalConsecutiveDays);
  const seasonLabel = getSeasonLabel(rec.seasonType);
  const seasonColor = getSeasonColor(rec.seasonType);
  const seasonBg = getSeasonBgColor(rec.seasonType);

  return (
    <div className="flex flex-col rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
          {rec.rank}
        </span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${seasonBg} ${seasonColor}`}>
          {seasonLabel}
        </span>
      </div>

      <h3 className="mb-1 text-base font-bold text-gray-900">{rec.title}</h3>
      <p className="mb-3 text-sm text-gray-500">{formatDateRange(rec.startDate, rec.endDate)}</p>

      <div className="mb-3 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-lg bg-gray-50 p-2 text-center">
          <div className="text-xs text-gray-500">연차 사용</div>
          <div className="font-bold text-blue-600">{rec.vacationDaysUsed}일</div>
        </div>
        <div className="rounded-lg bg-gray-50 p-2 text-center">
          <div className="text-xs text-gray-500">연속 휴일</div>
          <div className="font-bold text-green-600">{rec.totalConsecutiveDays}일</div>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center gap-1 text-sm">
          <span className="text-amber-500">{getEfficiencyStars(eff.rating)}</span>
          <span className="text-xs text-gray-500">{eff.label} ({eff.ratio.toFixed(1)}배)</span>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-1">
        {rec.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
          >
            {TAG_LABELS[tag]}
          </span>
        ))}
      </div>

      <button
        onClick={() => onApply(rec.vacationDates)}
        className="mt-auto rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        이 일정 적용하기
      </button>
    </div>
  );
}
