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
  const [financeData, setFinanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [earningData, setEarningData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // 주식 데이터 가져오기
        const stockRes = await getStockData(symbol);
        if (stockRes?.output2) {
          setStockData(stockRes.output2.reverse());
        }

        // 재무 데이터 가져오기
        const financeRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/earnings/${symbol}`
        );
        const financeData = await financeRes.json();
        if (financeData.success && financeData.data) {
          setFinanceData(financeData.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    if (symbol) {
      fetchData();
    }
  }, [symbol]);

  if (loading) {
    return (
      <div className="p-6 bg-[#040816] text-white">
        <div>로딩중...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#040816]">
      <h1 className="text-2xl font-bold text-white mb-6">{symbol}</h1>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "32px" }}>
        <div style={{ flex: "0 0 380px" }}>
          <StockChart symbol={symbol} />
          <FinanceList
            symbol={symbol}
            financeData={financeData}
            skipFetch={true}
            onEarningData={(data) => setEarningData(data)}
          />
        </div>
        <div style={{ flex: 1 }}>
          <EarningDataList earningData={earningData} />
        </div>
      </div>
    </div>
  );
}
