"use client";

import { useMemo } from "react";
import { Header } from "@/components/layout/header";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { VacationInputForm } from "@/components/vacation-input/vacation-input-form";
import { DdayCountdown } from "@/components/countdown/dday-countdown";
import { RecommendationEngine } from "@/components/recommendation/recommendation-engine";
import { HolidayCalendar } from "@/components/calendar/holiday-calendar";
import { GoldenHolidayCard } from "@/components/golden-holidays/golden-holiday-card";
import { FlightCostTable } from "@/components/flight-costs/flight-cost-table";
import { VacationPlanner } from "@/components/planner/vacation-planner";
import { useVacationStore } from "@/hooks/use-vacation-store";
import { getHolidaysForYear } from "@/lib/data/holidays";
import { detectGoldenHolidays } from "@/lib/algorithms/golden-holiday-detector";

export default function Home() {
  const {
    state,
    setRemainingDays,
    setSelectedYear,
    toggleVacationDate,
    clearSelectedDates,
    applyRecommendation,
  } = useVacationStore();

  const goldenPeriods = useMemo(() => {
    const holidays = getHolidaysForYear(state.selectedYear);
    return detectGoldenHolidays(state.selectedYear, holidays);
  }, [state.selectedYear]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero / Input */}
      <div id="input">
        <VacationInputForm
          remainingDays={state.remainingVacationDays}
          selectedYear={state.selectedYear}
          selectedDatesCount={state.selectedDates.length}
          onDaysChange={setRemainingDays}
          onYearChange={setSelectedYear}
        />
      </div>

      {/* D-Day Countdown */}
      <DdayCountdown year={state.selectedYear} selectedDates={state.selectedDates} />

      {/* Recommendations */}
      <SectionWrapper
        id="recommendations"
        title="연차 활용 추천"
        subtitle="남은 연차로 최대한 쉴 수 있는 방법을 알려드려요"
      >
        <RecommendationEngine
          remainingDays={state.remainingVacationDays}
          year={state.selectedYear}
          onApply={applyRecommendation}
        />
      </SectionWrapper>

      {/* Calendar */}
      <SectionWrapper
        id="calendar"
        title={`${state.selectedYear}년 캘린더`}
        subtitle="날짜를 클릭해서 연차를 선택하세요"
        className="bg-white"
      >
        <HolidayCalendar
          year={state.selectedYear}
          selectedDates={state.selectedDates}
          onDateClick={toggleVacationDate}
        />
      </SectionWrapper>

      {/* Golden Holidays */}
      <SectionWrapper
        id="golden"
        title="황금연휴 가이드"
        subtitle="적은 연차로 긴 연휴를 만드세요"
      >
        {goldenPeriods.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {goldenPeriods.map((period) => (
              <GoldenHolidayCard
                key={period.id}
                period={period}
                onApply={applyRecommendation}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border bg-gray-50 p-8 text-center text-gray-500">
            황금연휴 기간이 없습니다
          </div>
        )}
      </SectionWrapper>

      {/* Flight Costs */}
      <SectionWrapper
        id="flights"
        title="목적지별 예상 항공료"
        subtitle="성수기와 비수기 가격을 비교해보세요"
        className="bg-white"
      >
        <FlightCostTable />
      </SectionWrapper>

      {/* Planner */}
      <SectionWrapper
        id="planner"
        title="내 연차 계획"
        subtitle="선택한 연차 일정을 확인하고 공유하세요"
      >
        <VacationPlanner
          selectedDates={state.selectedDates}
          remainingDays={state.remainingVacationDays}
          onClear={clearSelectedDates}
        />
      </SectionWrapper>

      {/* Footer */}
      <footer className="border-t bg-white py-8 text-center text-sm text-gray-400">
        <p>연차 플래너 &copy; {new Date().getFullYear()}</p>
        <p className="mt-1">남은 연차를 똑똑하게 사용하세요</p>
      </footer>
    </div>
  );
}
