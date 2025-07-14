"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import StockChart from "@/components/earning/chart/chart";
import { getStockData } from "@/services/earning-service";

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
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Chart for {symbol}</h1>
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <StockChart stockData={stockData} symbol={symbol} />
        </div>
      </div>
  );
}
