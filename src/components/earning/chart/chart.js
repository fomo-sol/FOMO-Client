import React, { useState } from "react";
import StockLiveChart from "./StockLiveChart";
import { Render1DayChart } from "@/components/earning/chart/Render1DayChart";

export default function StockChart({ symbol }) {
  const [mode, setMode] = useState("1day");

  return (
    <div>
      <div className="flex gap-2 mb-2 p-1">
        <button
          className={`px-3 py-1 text- font-semibold rounded-[5px] transition-all duration-200 focus:outline-none
      ${
        mode === "1day"
          ? "bg-white text-black shadow-lg scale-105"
          : "bg-gray-700 text-white hover:bg-gray-600 scale-95"
      }`}
          onClick={() => setMode("1day")}
        >
          1day
        </button>
        <button
          className={`px-3 py-1 text- font-semibold rounded-[5px] transition-all duration-200 focus:outline-none
      ${
        mode === "live"
          ? "bg-white text-black shadow-lg scale-105"
          : "bg-gray-700 text-white hover:bg-gray-600 scale-95"
      }`}
          onClick={() => setMode("live")}
        >
          실시간
        </button>
      </div>
      {mode === "1day" ? (
        <Render1DayChart key={`1day-${symbol}`} symbol={symbol} />
      ) : (
        <StockLiveChart key={`live-${symbol}`} symbol={symbol} />
      )}
    </div>
  );
}
