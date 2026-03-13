"use client";

import { forwardRef } from "react";
import { formatDateKorean, getDaysInMonth, getFirstDayOfMonth, parseDate, isWeekend } from "@/lib/utils/date-utils";
import { getHolidaysForYear, isHolidayDate } from "@/lib/data/holidays";

interface ShareableCardProps {
  selectedDates: string[];
  year: number;
  remainingDays: number;
}

const DAY_HEADERS = ["일", "월", "화", "수", "목", "금", "토"];

function MiniMonth({ year, month, selectedDates, holidays }: {
  year: number;
  month: number;
  selectedDates: Set<string>;
  holidays: ReturnType<typeof getHolidaysForYear>;
}) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const holidaySet = new Set(holidays.map(h => h.date));

  return (
    <div style={{ padding: "6px 4px" }}>
      <div style={{ textAlign: "center", fontSize: "11px", fontWeight: 700, marginBottom: "4px", color: "#374151" }}>
        {month}월
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0px" }}>
        {DAY_HEADERS.map((d, i) => (
          <div key={d} style={{
            textAlign: "center",
            fontSize: "7px",
            fontWeight: 600,
            color: i === 0 ? "#f87171" : i === 6 ? "#60a5fa" : "#9ca3af",
            paddingBottom: "2px",
          }}>
            {d}
          </div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`pad-${i}`} style={{ height: "16px" }} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dow = new Date(year, month - 1, day).getDay();
          const isSelected = selectedDates.has(dateStr);
          const isHol = holidaySet.has(dateStr);
          const isSun = dow === 0;
          const isSat = dow === 6;

          let bg = "transparent";
          let color = "#6b7280";
          let fontWeight = 400;

          if (isSelected) {
            bg = "#3b82f6";
            color = "#ffffff";
            fontWeight = 700;
          } else if (isHol) {
            bg = "#fef2f2";
            color = "#ef4444";
            fontWeight = 600;
          } else if (isSun) {
            color = "#f87171";
          } else if (isSat) {
            color = "#60a5fa";
          }

          return (
            <div key={dateStr} style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "16px",
            }}>
              <span style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                fontSize: "7px",
                fontWeight,
                backgroundColor: bg,
                color,
              }}>
                {day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const ShareableCard = forwardRef<HTMLDivElement, ShareableCardProps>(
  function ShareableCard({ selectedDates, year, remainingDays }, ref) {
    const holidays = getHolidaysForYear(year);
    const selectedSet = new Set(selectedDates);
    const usedDays = selectedDates.length;

    // Find which months have selected dates
    const monthsWithDates = new Set<number>();
    selectedDates.forEach(d => monthsWithDates.add(parseInt(d.split("-")[1])));

    // Group dates by month for summary
    const byMonth = new Map<number, string[]>();
    for (const d of selectedDates) {
      const m = parseInt(d.split("-")[1]);
      if (!byMonth.has(m)) byMonth.set(m, []);
      byMonth.get(m)!.push(d);
    }

    // Show all 12 months, highlighting those with dates
    const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);

    return (
      <div
        ref={ref}
        style={{
          width: "800px",
          padding: "32px",
          backgroundColor: "#ffffff",
          fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#1f2937", marginBottom: "4px" }}>
            🏖️ {year}년 연차 계획
          </div>
          <div style={{ fontSize: "13px", color: "#6b7280" }}>
            총 {usedDays}일 사용 / {remainingDays}일 중
          </div>
        </div>

        {/* 12-month Calendar Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "4px",
          marginBottom: "24px",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "12px",
          backgroundColor: "#fafafa",
        }}>
          {allMonths.map((month) => (
            <div key={month} style={{
              borderRadius: "8px",
              backgroundColor: monthsWithDates.has(month) ? "#eff6ff" : "#ffffff",
              border: monthsWithDates.has(month) ? "1px solid #bfdbfe" : "1px solid #f3f4f6",
            }}>
              <MiniMonth
                year={year}
                month={month}
                selectedDates={selectedSet}
                holidays={holidays}
              />
            </div>
          ))}
        </div>

        {/* Date Summary */}
        <div style={{
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "16px",
          backgroundColor: "#fafafa",
        }}>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#374151", marginBottom: "12px" }}>
            📋 연차 사용 일정
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {Array.from(byMonth.entries()).sort(([a], [b]) => a - b).map(([month, dates]) => (
              <div key={month} style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "8px 12px",
                flex: "1 1 auto",
                minWidth: "160px",
              }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#3b82f6", marginBottom: "4px" }}>
                  {month}월 ({dates.length}일)
                </div>
                <div style={{ fontSize: "10px", color: "#6b7280", lineHeight: "1.6" }}>
                  {dates.map(d => formatDateKorean(d)).join(",  ")}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend & Footer */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "16px",
          paddingTop: "12px",
          borderTop: "1px solid #f3f4f6",
        }}>
          <div style={{ display: "flex", gap: "12px", fontSize: "9px", color: "#9ca3af" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#3b82f6", display: "inline-block" }} />
              내 연차
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#fef2f2", border: "1px solid #fca5a5", display: "inline-block" }} />
              공휴일
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
              <span style={{ fontSize: "10px", color: "#f87171" }}>일</span>=일요일
              <span style={{ fontSize: "10px", color: "#60a5fa", marginLeft: "4px" }}>토</span>=토요일
            </span>
          </div>
          <div style={{ fontSize: "9px", color: "#d1d5db" }}>
            연차 플래너 ✨
          </div>
        </div>
      </div>
    );
  }
);
