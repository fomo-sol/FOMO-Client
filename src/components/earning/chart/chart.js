import React, { useState } from "react";
import StockLiveChart from "./StockLiveChart";
import { Render1DayChart } from "@/components/earning/chart/Render1DayChart";

export default function StockChart({ symbol }) {
  const [mode, setMode] = useState("1day");

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <button
          className={`px-2 py-1 rounded cursor-pointer font-bold text-sm transition-colors duration-150 ${
            mode === "1day"
              ? "bg-gray-800 text-white hover:bg-gray-700"
              : "bg-gray-300 text-gray-700 hover:bg-gray-400"
          }`}
          onClick={() => setMode("1day")}
        >
          1day
        </button>
        <button
          className={`px-2 py-1 rounded cursor-pointer font-bold text-sm transition-colors duration-150 ${
            mode === "live"
              ? "bg-gray-800 text-white hover:bg-gray-700"
              : "bg-gray-300 text-gray-700 hover:bg-gray-400"
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
