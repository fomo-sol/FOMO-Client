"use client";

import { useEffect, useState } from "react";
import StockChart from "@/components/earning/chart/chart";
import { getStockData } from "@/services/earning-service";

export default function NasdaqGraph() {
  const [stockData, setStockData] = useState([]);
  const symbol = "QQQ";

  useEffect(() => {
    let timeoutId;
    async function fetchData() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500)); // 0.5초 대기
        const res = await getStockData(symbol);

        if (res?.output2) {
          setStockData(res.output2.reverse());
        } else {
          console.error("No output2 for symbol", symbol);
        }
      } catch (e) {
        console.error(e);
      }
    }
    timeoutId = setTimeout(fetchData, 0);
    return () => clearTimeout(timeoutId);
  }, [symbol]);

  useEffect(() => {
    console.log("NasdaqGraph stockData", stockData);
  }, [stockData]);

  return (
    <>
      <div>
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <StockChart stockData={stockData} symbol={symbol} />
          {/* <FearGreedGauge /> */}
        </div>
      </div>
    </>
  );
}
