"use client";

import { useEffect, useState } from "react";

export default function FinanceList({
  symbol,
  financeData,
  skipFetch = false,
  onEarningData,
}) {
  const [finances, setFinances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const [selectedFinanceId, setSelectedFinanceId] = useState(null);

  const handleFinanceClick = async (financeId) => {
    setSelectedFinanceId(financeId);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/earnings/results/${financeId}`
      );
      const data = await response.json();
      if (data.success) {
        console.log("Earning data:", data.data);
        // 부모 컴포넌트에 데이터 전달
        onEarningData?.(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch earning data:", error);
    }
  };

  // 가장 최근 fin_release_date의 id로 자동 요청
  const autoSelectLatestFinance = (financesList) => {
    if (financesList.length === 0) return;

    // fin_release_date 기준으로 내림차순 정렬 (최신순)
    const sortedFinances = [...financesList].sort(
      (a, b) => new Date(b.fin_release_date) - new Date(a.fin_release_date)
    );

    const latestFinance = sortedFinances[0];
    if (latestFinance && latestFinance.id) {
      console.log("Auto-selecting latest finance:", latestFinance);
      handleFinanceClick(latestFinance.id);
    }
  };

  useEffect(() => {
    async function fetchFinances() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/earnings/${symbol}`
        );
        const data = await res.json();
        if (data.success && data.data && Array.isArray(data.data.finances)) {
          setFinances(data.data.finances);
          // 데이터 로드 후 자동으로 가장 최근 것 선택
          autoSelectLatestFinance(data.data.finances);
        } else {
          setFinances([]);
        }
      } catch (e) {
        setError("데이터를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    }

    // props로 받은 데이터가 있으면 사용, 없으면 API 호출
    if (skipFetch && financeData && Array.isArray(financeData.finances)) {
      setFinances(financeData.finances);
      setLoading(false);
      // props로 받은 데이터도 자동으로 가장 최근 것 선택
      autoSelectLatestFinance(financeData.finances);
    } else if (symbol && !skipFetch) {
      fetchFinances();
    }
  }, [symbol, financeData, skipFetch]);

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>{error}</div>;
  if (!finances.length) return <div>재무 데이터 없음</div>;

  const reversedFinances = [...finances].reverse();
  const visibleFinances = reversedFinances.slice(0, visibleCount);
  const hasMore = visibleCount < reversedFinances.length;

  return (
    <div className="w-full mt-6">
      {/* 헤더 */}
      <div className="grid grid-cols-4 text-sm font-semibold text-white/70 border-b border-white/20 pb-2 mb-2 text-center">
        <span>분기</span>
        <span>발표일</span>
        <span>EPS (실적/예상)</span>
        <span>매출 (실적/예상)</span>
      </div>
      {/* 데이터 */}
      <div className="space-y-1">
        {visibleFinances.map((f) => (
          <div
            key={f.id}
            className={`grid grid-cols-4 py-2 bg-transparent hover:bg-white/10 transition-all rounded text-white text-sm cursor-pointer text-center ${
              selectedFinanceId === f.id ? "bg-[#93B9FF] text-black" : ""
            }`}
            onClick={() => handleFinanceClick(f.id)}
          >
            <span>{f.fin_quarter}</span>
            <span>{f.fin_release_date}</span>
            <span>
              <span
                className={
                  f.fin_eps_value &&
                  f.fin_eps_forest &&
                  Number(f.fin_eps_value) > Number(f.fin_eps_forest)
                    ? "text-red-400"
                    : f.fin_eps_value &&
                      f.fin_eps_forest &&
                      Number(f.fin_eps_value) < Number(f.fin_eps_forest)
                    ? "text-blue-400"
                    : "text-white"
                }
              >
                {f.fin_eps_value ?? "--"}
              </span>
              {" / "}
              <span>{f.fin_eps_forest ?? "--"}</span>
            </span>
            <span>
              <span
                className={
                  f.fin_revenue_value &&
                  f.fin_revenue_forest &&
                  Number(f.fin_revenue_value.replace(/[^\d.]/g, "")) >
                    Number(f.fin_revenue_forest.replace(/[^\d.]/g, ""))
                    ? "text-red-400"
                    : f.fin_revenue_value &&
                      f.fin_revenue_forest &&
                      Number(f.fin_revenue_value.replace(/[^\d.]/g, "")) <
                        Number(f.fin_revenue_forest.replace(/[^\d.]/g, ""))
                    ? "text-blue-400"
                    : "text-white"
                }
              >
                {f.fin_revenue_value && f.fin_revenue_value !== "0"
                  ? f.fin_revenue_value
                  : "--"}
              </span>
              {" / "}
              <span>{f.fin_revenue_forest ?? "--"}</span>
            </span>
          </div>
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center mt-4">
          <button
            className="px-4 py-2 bg-[#222b3c] text-white rounded hover:bg-[#2d3950] transition"
            onClick={() => setVisibleCount((c) => c + 10)}
          >
            더보기
          </button>
        </div>
      )}
    </div>
  );
}
