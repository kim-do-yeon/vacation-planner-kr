import { DestinationInfo, SeasonType } from "@/types";
import { formatPriceRange } from "@/lib/data/flight-prices";

interface DestinationCardProps {
  destination: DestinationInfo;
  viewSeason: "peak" | "off-peak";
}

const MONTH_NAMES = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

export function DestinationCard({ destination, viewSeason }: DestinationCardProps) {
  const prices = viewSeason === "peak" ? destination.prices.peak : destination.prices.offPeak;
  const otherPrices = viewSeason === "peak" ? destination.prices.offPeak : destination.prices.peak;

  const savings = viewSeason === "off-peak"
    ? Math.round(((destination.prices.peak.min - prices.min) / destination.prices.peak.min) * 100)
    : 0;

  return (
    <div className="flex flex-col rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 text-center">
        <span className="text-3xl">{destination.emoji}</span>
        <h3 className="mt-1 text-lg font-bold text-gray-900">{destination.name}</h3>
        <p className="text-xs text-gray-500">{destination.cities}</p>
      </div>

      <div className="mb-3 rounded-lg bg-blue-50 p-3 text-center">
        <div className="text-xs text-blue-600">
          {viewSeason === "peak" ? "성수기" : "비수기"} 왕복 항공료
        </div>
        <div className="mt-1 text-lg font-bold text-blue-700">
          {formatPriceRange(prices.min, prices.max)}
        </div>
        {savings > 0 && (
          <div className="mt-1 text-xs font-medium text-green-600">
            성수기 대비 약 {savings}% 저렴
          </div>
        )}
      </div>

      <div className="mb-3 text-sm text-gray-500">
        <div className="flex justify-between">
          <span>비행시간</span>
          <span className="font-medium text-gray-700">약 {destination.flightHours}시간</span>
        </div>
        <div className="mt-1 flex justify-between">
          <span>{viewSeason === "peak" ? "비수기" : "성수기"} 가격</span>
          <span className="font-medium text-gray-700">
            {formatPriceRange(otherPrices.min, otherPrices.max)}
          </span>
        </div>
      </div>

      <div className="mt-auto">
        <div className="text-xs text-gray-500">추천 시기</div>
        <div className="mt-1 flex flex-wrap gap-1">
          {destination.bestMonths.map((m) => (
            <span key={m} className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
              {MONTH_NAMES[m - 1]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
