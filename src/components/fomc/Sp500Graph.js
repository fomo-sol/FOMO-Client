"use client";

import StockChart from "@/components/earning/chart/chart";

export default function Sp500Graph() {
  const symbol = "SPY";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <StockChart symbol={symbol} />
      </div>
    </div>
  );
}
