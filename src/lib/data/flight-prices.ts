import { DestinationInfo } from "@/types";

export const DESTINATIONS: DestinationInfo[] = [
  {
    id: "jeju",
    name: "제주",
    cities: "제주시",
    emoji: "🏝️",
    flightHours: 1,
    prices: {
      offPeak: { min: 90000, max: 160000 },
      peak: { min: 200000, max: 380000 },
    },
    bestMonths: [3, 4, 5, 10, 11],
  },
  {
    id: "china",
    name: "중국",
    cities: "베이징 / 상하이",
    emoji: "🇨🇳",
    flightHours: 2.5,
    prices: {
      offPeak: { min: 110000, max: 240000 },
      peak: { min: 280000, max: 450000 },
    },
    bestMonths: [3, 4, 5, 10, 11],
  },
  {
    id: "japan",
    name: "일본",
    cities: "도쿄 / 오사카",
    emoji: "🇯🇵",
    flightHours: 2,
    prices: {
      offPeak: { min: 70000, max: 160000 },
      peak: { min: 160000, max: 340000 },
    },
    bestMonths: [3, 4, 10, 11],
  },
  {
    id: "southeast-asia",
    name: "동남아",
    cities: "방콕 / 다낭 / 세부",
    emoji: "🌴",
    flightHours: 5,
    prices: {
      offPeak: { min: 200000, max: 340000 },
      peak: { min: 390000, max: 680000 },
    },
    bestMonths: [1, 2, 3, 11, 12],
  },
  {
    id: "europe",
    name: "유럽",
    cities: "파리 / 런던 / 로마",
    emoji: "🏰",
    flightHours: 12,
    prices: {
      offPeak: { min: 720000, max: 900000 },
      peak: { min: 1140000, max: 2000000 },
    },
    bestMonths: [5, 6, 9, 10],
  },
];

export function formatPrice(price: number): string {
  if (price >= 10000) {
    const man = Math.floor(price / 10000);
    const remainder = price % 10000;
    if (remainder === 0) return `${man}만`;
    return `${man}만${remainder.toLocaleString()}`;
  }
  return price.toLocaleString();
}

export function formatPriceRange(min: number, max: number): string {
  return `${formatPrice(min)} ~ ${formatPrice(max)}원`;
}
