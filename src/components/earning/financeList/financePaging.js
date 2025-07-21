"use client";

import { useEffect, useState } from "react";
import { formatRevenue } from "@/services/earning-service";

export default function FinancePaging() {
  const ITEMS_PER_PAGE = 10;
  const TOTAL_ITEMS = 500;
  const PAGE_BUTTONS_PER_GROUP = 10;

  const maxPage = Math.ceil(TOTAL_ITEMS / ITEMS_PER_PAGE);

  const [earnings, setEarnings] = useState([]);
  const [page, setPage] = useState(1);
  const [buttonGroup, setButtonGroup] = useState(0);

  const pageButtons = Array.from(
    { length: PAGE_BUTTONS_PER_GROUP },
    (_, i) => i + 1 + buttonGroup * PAGE_BUTTONS_PER_GROUP
  ).filter((p) => p <= maxPage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/earnings?page=${page}&limit=${ITEMS_PER_PAGE}`
        );
        const json = await res.json();
        setEarnings(json.data.merged);
      } catch (err) {
        console.error("실적 데이터 불러오기 실패:", err);
      }
    };
    fetchData();
  }, [page]);

  const moveButtonGroup = (newGroup) => {
    if (
      newGroup < 0 ||
      newGroup > Math.floor((maxPage - 1) / PAGE_BUTTONS_PER_GROUP)
    )
      return;
    setButtonGroup(newGroup);
    setPage(newGroup * PAGE_BUTTONS_PER_GROUP + 1);
  };

  if (earnings.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <>

      <div className="grid grid-cols-8 text-sm font-semibold text-white/70 border-b border-white/20 pb-2 mb-2">
        <span>순위</span>
        <span>종목명</span>
        <span>테마</span>
        <span>발표일</span>
        <span>EPS</span>
        <span>EPS 예측</span>
        <span>매출</span>
        <span>매출 예측</span>
      </div>

      <div className="space-y-2">
        {earnings.map((item) => {
          // finances를 fin_release_date 기준 내림차순 정렬(최신순)
          const sortedFinances = [...(item.finances || [])].sort(
            (a, b) =>
              new Date(b.fin_release_date) - new Date(a.fin_release_date)
          );

          const today = new Date();
          // 최근 10일 이내 실적 찾기 (가장 최근 것 하나만)
          const recentFinance = sortedFinances.find((fin) => {
            const diff =
              (today - new Date(fin.fin_release_date)) / (1000 * 60 * 60 * 24);
            return diff <= 10 && diff >= 0;
          });
          // 없으면 가장 최근 실적 사용
          const latest = recentFinance || sortedFinances[0] || {};

          return (
            <div
              key={item.id}
              className="grid grid-cols-8 py-2 cursor-pointer px-2 bg-white/5 hover:bg-white/10 transition-all rounded"
              onClick={() =>
                (window.location.href = `http://localhost:3000/earning/${item.symbol}`)
              }
            >
              <span>{item.rank}</span>
              <span>{item.name_kr || item.name}</span>
              <span>{item.sector}</span>
              <span>{latest.fin_release_date?.split("T")[0] || "-"}</span>

              <span
                className={
                  latest.fin_eps_value > latest.fin_eps_forest
                    ? "text-red-400"
                    : latest.fin_eps_value < latest.fin_eps_forest
                    ? "text-blue-400"
                    : "text-white"
                }
              >
                {latest.fin_eps_value ?? "-"}
              </span>

              <span>{latest.fin_eps_forest ?? "-"}</span>

              <span
                className={
                  latest.fin_revenue_value > latest.fin_revenue_forest
                    ? "text-red-400"
                    : latest.fin_revenue_value < latest.fin_revenue_forest
                    ? "text-blue-400"
                    : "text-white"
                }
              >
                {formatRevenue(latest.fin_revenue_value)}
              </span>

              <span>{formatRevenue(latest.fin_revenue_forest)}</span>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center space-x-2 mt-6">
        <button
          onClick={() => {
            setButtonGroup(0);
            setPage(1);
          }}
          disabled={page === 1}
          className="px-3 py-1 bg-white/10 rounded cursor-pointer disabled:opacity-30"
        >
          ≪
        </button>

        <button
          onClick={() => moveButtonGroup(buttonGroup - 1)}
          disabled={buttonGroup === 0}
          className="px-3 py-1 bg-white/10 rounded cursor-pointer disabled:opacity-30"
        >
          {"<"}
        </button>

        {pageButtons.map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-3 py-1 cursor-pointer rounded ${
              page === p
                ? "bg-[#93B9FF] text-black font-bold"
                : "bg-white/10 text-white"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => moveButtonGroup(buttonGroup + 1)}
          disabled={
            buttonGroup === Math.floor((maxPage - 1) / PAGE_BUTTONS_PER_GROUP)
          }
          className="px-3 py-1 bg-white/10 rounded cursor-pointer disabled:opacity-30"
        >
          {">"}
        </button>

        <button
          onClick={() => {
            const lastGroup = Math.floor(
              (maxPage - 1) / PAGE_BUTTONS_PER_GROUP
            );
            setButtonGroup(lastGroup);
            setPage(maxPage);
          }}
          disabled={page === maxPage}
          className="px-3 py-1 bg-white/10 cursor-pointer rounded disabled:opacity-30"
        >
          ≫
        </button>
      </div>
    </>
  );
}
