"use client";

import { useState } from "react";
import { DESTINATIONS } from "@/lib/data/flight-prices";
import { DestinationCard } from "./destination-card";

export function FlightCostTable() {
  const [viewSeason, setViewSeason] = useState<"peak" | "off-peak">("off-peak");

  return (
    <div>
      <div className="mb-6 flex justify-center gap-2">
        <button
          onClick={() => setViewSeason("off-peak")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            viewSeason === "off-peak"
              ? "bg-green-600 text-white"
              : "border bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          비수기 가격
        </button>
        <button
          onClick={() => setViewSeason("peak")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            viewSeason === "peak"
              ? "bg-orange-600 text-white"
              : "border bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          성수기 가격
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {DESTINATIONS.map((dest) => (
          <DestinationCard key={dest.id} destination={dest} viewSeason={viewSeason} />
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-gray-400">
        * 가격은 서울/인천 출발 왕복 기준이며, 실제 가격과 다를 수 있습니다
      </p>
    </div>
  );
}
