"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import StockChart from "@/components/earning/chart/chart";
import { getStockData } from "@/services/earning-service";
import FinanceList from "@/components/earning/earningDetail/FinanceList";
import EarningDataList from "@/components/earning/earningDetail/EarningDataList";
import EarningsCalendar from "@/components/earning/EarningsCalendar";

export default function EarningReleasePage() {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState([]);
  const [financeData, setFinanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [earningData, setEarningData] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

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
    <div className="min-h-screen bg-[#040816] text-white font-[Pretendard] px-6 py-6">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex gap-6">
          {/* 왼쪽 영역 */}
          <div className="w-[600px] flex flex-col gap-2">
            {/* 제목 + sidebar 버튼 */}
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => setShowSidebar((prev) => !prev)}
                className="cursor-pointer flex-shrink-0 rounded p-1 hover:bg-white/20 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="29"
                  height="28"
                  viewBox="0 0 29 28"
                  fill="none"
                >
                  <path
                    d="M14.5 27C17.4632 27 19.7788 26.8455 21.5938 26.4561C23.399 26.0686 24.6444 25.4617 25.5332 24.6035C27.3262 22.8722 28 19.7977 28 14C28 8.20228 27.3262 5.12785 25.5332 3.39648C24.6444 2.5383 23.399 1.93136 21.5938 1.54395C19.7788 1.1545 17.4632 1 14.5 1C11.5368 1 9.2212 1.1545 7.40625 1.54395C5.601 1.93136 4.35563 2.5383 3.4668 3.39648C1.67382 5.12785 1 8.20228 1 14C1 19.7977 1.67382 22.8722 3.4668 24.6035C4.35563 25.4617 5.601 26.0686 7.40625 26.4561C9.2212 26.8455 11.5368 27 14.5 27Z"
                    stroke="#FFFEFE"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12.0832 9.33337L16.9165 14L12.0832 18.6667"
                    stroke="#FFFEFE"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <h1 className="text-2xl font-bold">{symbol}</h1>
            </div>

            {/* 차트 */}
            <div>
              <h2 className="text-lg font-bold text-[#5BE49B] mb-2">
                주가 차트
              </h2>
              <div className="w-full flex items-center justify-center overflow-hidden mb-4">
                <StockChart symbol={symbol} />
              </div>
            </div>

            {/* 재무 데이터 */}
            <div>
              <h2 className="text-lg font-bold text-[#5BE49B] mb-2">
                재무 정보
              </h2>
              <div className="w-full">
                <FinanceList
                  symbol={symbol}
                  financeData={financeData}
                  skipFetch={true}
                  onEarningData={(data) => setEarningData(data)}
                />
              </div>
            </div>
          </div>

          {/* 오른쪽 영역 */}
          <div className="flex-1 ">
            <EarningDataList earningData={earningData} />
          </div>
        </div>
      </div>

      {/* 사이드바 오버레이 */}
      <div className="fixed inset-0 z-50 pointer-events-none">
        {showSidebar && (
          <div
            className="absolute inset-0 bg-black/40 pointer-events-auto"
            onClick={() => setShowSidebar(false)}
          />
        )}

        <div
          className={`fixed top-0 left-0 h-full w-[412px] transition-transform duration-300 backdrop-blur-md shadow-lg p-4 pt-12 text-white pointer-events-auto ${
            showSidebar ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setShowSidebar(false)}
            className="absolute top-4 right-4 z-50 bg-slate-700/50 backdrop-blur-sm cursor-pointer rounded-full p-1 text-slate-200 w-8 h-8 flex items-center justify-center hover:bg-slate-600/60 hover:text-white transition-colors border border-slate-600/30"
            aria-label="사이드바 닫기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <EarningsCalendar />
        </div>
      </div>
    </div>
  );
}
