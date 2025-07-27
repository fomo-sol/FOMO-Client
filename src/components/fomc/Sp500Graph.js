"use client";

import { useState, useEffect } from "react";
import StockChart from "@/components/earning/chart/chart";

export default function Sp500Graph() {
  const symbol = "SPY";
  const [fomcDates, setFomcDates] = useState([]);

  // FOMC 날짜 데이터 가져오기
  useEffect(() => {
    async function fetchFomcDates() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/fomc/fomc-all-date`
        );
        const data = await response.json();
        if (data.success) {
          setFomcDates(data.data);
        }
      } catch (error) {
        console.error("FOMC 날짜 데이터 가져오기 실패:", error);
      }
    }

    fetchFomcDates();
  }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <StockChart symbol={symbol} fomcDates={fomcDates} />
      </div>
    </div>
  );
}
