import { Holiday, GoldenHolidayPeriod } from "@/types";
import { isWeekend, addDays, toDateString, daysBetween, getAllDatesInRange } from "@/lib/utils/date-utils";

interface DayCluster {
  startDate: string;
  endDate: string;
  holidays: Holiday[];
}

function buildDayMap(year: number, holidays: Holiday[]): Map<string, "weekend" | "holiday" | "workday"> {
  const map = new Map<string, "weekend" | "holiday" | "workday">();
  const start = `${year}-01-01`;
  const end = `${year}-12-31`;
  let current = start;
  const holidaySet = new Set(holidays.map((h) => h.date));

  while (current <= end) {
    if (holidaySet.has(current)) {
      map.set(current, "holiday");
    } else if (isWeekend(current)) {
      map.set(current, "weekend");
    } else {
      map.set(current, "workday");
    }
    current = addDays(current, 1);
  }
  return map;
}

function findOffDayClusters(dayMap: Map<string, string>, holidays: Holiday[]): DayCluster[] {
  const sortedDates = Array.from(dayMap.keys()).sort();
  const clusters: DayCluster[] = [];
  let clusterStart: string | null = null;
  let clusterEnd: string | null = null;
  let clusterHolidays: Holiday[] = [];

  for (const date of sortedDates) {
    const type = dayMap.get(date);
    if (type !== "workday") {
      if (!clusterStart) {
        clusterStart = date;
      }
      clusterEnd = date;
      const holiday = holidays.find((h) => h.date === date);
      if (holiday) clusterHolidays.push(holiday);
    } else {
      if (clusterStart && clusterEnd) {
        clusters.push({
          startDate: clusterStart,
          endDate: clusterEnd,
          holidays: [...clusterHolidays],
        });
      }
      clusterStart = null;
      clusterEnd = null;
      clusterHolidays = [];
    }
  }

  if (clusterStart && clusterEnd) {
    clusters.push({
      startDate: clusterStart,
      endDate: clusterEnd,
      holidays: [...clusterHolidays],
    });
  }

  return clusters;
}

export function detectGoldenHolidays(year: number, holidays: Holiday[], maxBridgeDays: number = 3): GoldenHolidayPeriod[] {
  const dayMap = buildDayMap(year, holidays);
  const clusters = findOffDayClusters(dayMap, holidays);
  const results: GoldenHolidayPeriod[] = [];
  let id = 0;

  // Find bridging opportunities between adjacent clusters
  for (let i = 0; i < clusters.length - 1; i++) {
    const current = clusters[i];
    const next = clusters[i + 1];

    const gapStart = addDays(current.endDate, 1);
    const gapEnd = addDays(next.startDate, -1);

    if (gapStart > gapEnd) continue;

    const gapDays = getAllDatesInRange(gapStart, gapEnd);
    const workdays = gapDays.filter((d) => dayMap.get(d) === "workday");

    if (workdays.length > 0 && workdays.length <= maxBridgeDays) {
      const totalDays = daysBetween(current.startDate, next.endDate);
      const efficiency = totalDays / workdays.length;

      // Only include if there are holidays involved (not just weekends)
      const allHolidays = [...current.holidays, ...next.holidays];
      if (allHolidays.length === 0) continue;

      const holidayNames = allHolidays.map((h) => h.name);
      const uniqueNames = [...new Set(holidayNames.map((n) => n.replace(/ 연휴| 대체공휴일/g, "")))];
      const name = uniqueNames.join(" + ") + " 황금연휴";

      results.push({
        id: `golden-${year}-${id++}`,
        name,
        year,
        startDate: current.startDate,
        endDate: next.endDate,
        totalDaysOff: totalDays,
        vacationDaysRequired: workdays.length,
        holidays: allHolidays,
        vacationDates: workdays,
        efficiency,
        description: `연차 ${workdays.length}일 사용으로 ${totalDays}일 연속 휴가`,
      });
    }
  }

  // Also check for single-cluster extensions
  for (let i = 0; i < clusters.length; i++) {
    const cluster = clusters[i];
    if (cluster.holidays.length === 0) continue;

    const totalDays = daysBetween(cluster.startDate, cluster.endDate);
    if (totalDays >= 3) {
      // Check extension: add workdays before or after to connect to adjacent weekend
      for (const direction of ["before", "after"] as const) {
        let extStart = cluster.startDate;
        let extEnd = cluster.endDate;
        const extVacationDays: string[] = [];

        for (let d = 1; d <= maxBridgeDays; d++) {
          const checkDate = direction === "before"
            ? addDays(cluster.startDate, -d)
            : addDays(cluster.endDate, d);

          if (dayMap.get(checkDate) === "workday") {
            extVacationDays.push(checkDate);
          } else if (dayMap.get(checkDate) === "weekend" || dayMap.get(checkDate) === "holiday") {
            // Found a connecting off-day
            if (direction === "before") extStart = checkDate;
            else extEnd = checkDate;

            // Continue to include the full weekend
            let nextDate = direction === "before"
              ? addDays(checkDate, -1)
              : addDays(checkDate, 1);
            while (dayMap.get(nextDate) && dayMap.get(nextDate) !== "workday") {
              if (direction === "before") extStart = nextDate;
              else extEnd = nextDate;
              nextDate = direction === "before"
                ? addDays(nextDate, -1)
                : addDays(nextDate, 1);
            }
            break;
          } else {
            break;
          }
        }

        if (extVacationDays.length > 0 && extVacationDays.length <= maxBridgeDays) {
          if (direction === "before") extStart = extStart < extVacationDays[extVacationDays.length - 1] ? extStart : extVacationDays[extVacationDays.length - 1];
          else extEnd = extEnd > extVacationDays[extVacationDays.length - 1] ? extEnd : extVacationDays[extVacationDays.length - 1];

          const newTotalDays = daysBetween(extStart, extEnd);
          if (newTotalDays > totalDays + 1) {
            const efficiency = newTotalDays / extVacationDays.length;

            // Check if this isn't already covered by a bridge opportunity
            const alreadyCovered = results.some(
              (r) => r.startDate <= extStart && r.endDate >= extEnd
            );
            if (!alreadyCovered) {
              const holidayNames = cluster.holidays.map((h) => h.name);
              const uniqueNames = [...new Set(holidayNames.map((n) => n.replace(/ 연휴| 대체공휴일/g, "")))];

              results.push({
                id: `golden-${year}-${id++}`,
                name: uniqueNames.join(" + ") + " 연계 휴가",
                year,
                startDate: extStart,
                endDate: extEnd,
                totalDaysOff: newTotalDays,
                vacationDaysRequired: extVacationDays.length,
                holidays: cluster.holidays,
                vacationDates: extVacationDays.sort(),
                efficiency,
                description: `연차 ${extVacationDays.length}일 사용으로 ${newTotalDays}일 연속 휴가`,
              });
            }
          }
        }
      }
    }
  }

  return results.sort((a, b) => b.efficiency - a.efficiency);
}
