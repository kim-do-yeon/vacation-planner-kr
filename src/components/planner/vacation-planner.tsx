"use client";

import { formatDateKorean } from "@/lib/utils/date-utils";

interface VacationPlannerProps {
  selectedDates: string[];
  remainingDays: number;
  onClear: () => void;
}

export function VacationPlanner({ selectedDates, remainingDays, onClear }: VacationPlannerProps) {
  const usedDays = selectedDates.length;

  const handleShare = async () => {
    const text = generatePlanText(selectedDates);
    if (navigator.share) {
      try {
        await navigator.share({ title: "연차 계획", text });
        return;
      } catch {
        // fallback to clipboard
      }
    }
    await navigator.clipboard.writeText(text);
    alert("클립보드에 복사되었습니다!");
  };

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <span className="text-sm text-gray-500">사용 연차: </span>
          <span className={`text-lg font-bold ${usedDays > remainingDays ? "text-red-600" : "text-blue-600"}`}>
            {usedDays}
          </span>
          <span className="text-sm text-gray-500"> / {remainingDays}일</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClear}
            disabled={usedDays === 0}
            className="rounded-lg border px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-30"
          >
            초기화
          </button>
          <button
            onClick={handleShare}
            disabled={usedDays === 0}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-30"
          >
            공유하기
          </button>
        </div>
      </div>

      {usedDays > remainingDays && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          잔여 연차를 초과했습니다! ({usedDays - remainingDays}일 초과)
        </div>
      )}

      {usedDays === 0 ? (
        <div className="rounded-lg bg-gray-50 p-8 text-center text-sm text-gray-400">
          캘린더에서 날짜를 클릭하거나 추천을 적용해주세요
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {selectedDates.map((date) => (
            <div key={date} className="flex items-center justify-between rounded-lg bg-blue-50 px-3 py-2 text-sm">
              <span className="text-blue-700">{formatDateKorean(date)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Progress bar */}
      {remainingDays > 0 && (
        <div className="mt-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all ${
                usedDays > remainingDays ? "bg-red-500" : "bg-blue-500"
              }`}
              style={{ width: `${Math.min(100, (usedDays / remainingDays) * 100)}%` }}
            />
          </div>
          <div className="mt-1 text-right text-xs text-gray-400">
            {remainingDays - usedDays >= 0 ? `${remainingDays - usedDays}일 남음` : "초과"}
          </div>
        </div>
      )}
    </div>
  );
}

function generatePlanText(dates: string[]): string {
  if (dates.length === 0) return "";

  // Group by month
  const byMonth = new Map<string, string[]>();
  for (const d of dates) {
    const month = d.substring(0, 7);
    if (!byMonth.has(month)) byMonth.set(month, []);
    byMonth.get(month)!.push(d);
  }

  let text = "🏖️ 나의 연차 계획\n\n";
  for (const [month, mDates] of byMonth) {
    const [y, m] = month.split("-");
    text += `📅 ${y}년 ${parseInt(m)}월\n`;
    for (const d of mDates) {
      text += `  - ${formatDateKorean(d)}\n`;
    }
    text += "\n";
  }
  text += `총 ${dates.length}일 사용\n`;
  text += "\n연차 플래너로 만들었어요 ✨";

  return text;
}
