export function calculateEfficiency(
  vacationDaysUsed: number,
  totalConsecutiveDaysOff: number
): { ratio: number; rating: number; label: string } {
  if (vacationDaysUsed === 0) return { ratio: 0, rating: 0, label: "-" };

  const ratio = totalConsecutiveDaysOff / vacationDaysUsed;

  let rating: number;
  let label: string;

  if (ratio >= 4) {
    rating = 5;
    label = "최고 효율";
  } else if (ratio >= 3) {
    rating = 4;
    label = "매우 좋음";
  } else if (ratio >= 2.5) {
    rating = 3;
    label = "좋음";
  } else if (ratio >= 2) {
    rating = 2;
    label = "보통";
  } else {
    rating = 1;
    label = "낮은 효율";
  }

  return { ratio, rating, label };
}

export function getEfficiencyStars(rating: number): string {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}
