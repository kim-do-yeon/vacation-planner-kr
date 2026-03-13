"use client";

import { useRef, useState, useCallback } from "react";
import { formatDateKorean } from "@/lib/utils/date-utils";
import { ShareableCard } from "./shareable-card";

interface VacationPlannerProps {
  selectedDates: string[];
  remainingDays: number;
  year: number;
  onClear: () => void;
}

export function VacationPlanner({ selectedDates, remainingDays, year, onClear }: VacationPlannerProps) {
  const usedDays = selectedDates.length;
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const generateImage = useCallback(async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    setIsGenerating(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });
      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), "image/png", 1.0);
      });
    } catch (e) {
      console.error("Image generation failed:", e);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleDownload = async () => {
    const blob = await generateImage();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `연차계획_${year}.png`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const blob = await generateImage();
    if (!blob) {
      await navigator.clipboard.writeText(generatePlanText(selectedDates));
      alert("텍스트로 클립보드에 복사되었습니다!");
      return;
    }

    const file = new File([blob], `연차계획_${year}.png`, { type: "image/png" });

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          title: `${year}년 연차 계획`,
          text: `${year}년 연차 계획 (${selectedDates.length}일)`,
          files: [file],
        });
        return;
      } catch {
        // user cancelled or share failed
      }
    }

    // fallback: copy image to clipboard
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      alert("이미지가 클립보드에 복사되었습니다!\n카카오톡, 슬랙 등에 붙여넣기 하세요.");
    } catch {
      await navigator.clipboard.writeText(generatePlanText(selectedDates));
      alert("텍스트로 클립보드에 복사되었습니다!");
    }
  };

  const handleCopyText = async () => {
    await navigator.clipboard.writeText(generatePlanText(selectedDates));
    alert("텍스트로 클립보드에 복사되었습니다!");
  };

  return (
    <div className="space-y-4">
      {/* Main planner card */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-500">사용 연차: </span>
            <span className={`text-lg font-bold ${usedDays > remainingDays ? "text-red-600" : "text-blue-600"}`}>
              {usedDays}
            </span>
            <span className="text-sm text-gray-500"> / {remainingDays}일</span>
          </div>
          <button
            onClick={onClear}
            disabled={usedDays === 0}
            className="rounded-lg border px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-30"
          >
            초기화
          </button>
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

      {/* Share buttons */}
      {usedDays > 0 && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-1 text-sm font-bold text-gray-900">공유 & 내보내기</h3>
          <p className="mb-4 text-xs text-gray-500">연차 계획을 이미지로 저장하거나 공유하세요</p>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {isGenerating ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              )}
              이미지 다운로드
            </button>
            <button
              onClick={handleShare}
              disabled={isGenerating}
              className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              이미지 공유 / 복사
            </button>
            <button
              onClick={handleCopyText}
              className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              텍스트 복사
            </button>
          </div>

          {/* Preview toggle */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="mt-3 text-xs text-gray-400 underline transition-colors hover:text-gray-600"
          >
            {showPreview ? "미리보기 닫기" : "공유 이미지 미리보기"}
          </button>

          {showPreview && (
            <div className="mt-3 overflow-x-auto rounded-lg border bg-gray-50 p-4">
              <div style={{ transform: "scale(0.6)", transformOrigin: "top left", width: "800px" }}>
                <ShareableCard
                  selectedDates={selectedDates}
                  year={year}
                  remainingDays={remainingDays}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hidden card for image generation (always rendered but off-screen) */}
      {usedDays > 0 && (
        <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
          <ShareableCard
            ref={cardRef}
            selectedDates={selectedDates}
            year={year}
            remainingDays={remainingDays}
          />
        </div>
      )}
    </div>
  );
}

function generatePlanText(dates: string[]): string {
  if (dates.length === 0) return "";
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
