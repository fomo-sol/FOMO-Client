"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import StockChart from "@/components/earning/chart/chart";
import { getStockData } from "@/services/earning-service";
import FinanceList from "@/components/earning/earningDetail/FinanceList";
import EarningDataList from "@/components/earning/earningDetail/EarningDataList";

export default function EarningReleasePage() {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
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
    fetchData();
  }, [symbol]);

  return (
    <div className="p-6 bg-[#040816]">
      <h1 className="text-2xl font-bold text-white mb-6">{symbol}</h1>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "32px" }}>
        <div style={{ flex: "0 0 380px" }}>
          <StockChart symbol={symbol} />
          <FinanceList symbol={symbol} />
        </div>
        <div style={{ flex: 1 }}>
          <EarningDataList />
        </div>
      </div>
    </div>
  );
}
