"use client";

import { useEffect, useState } from "react";
import useAuth from "../../../../utils/useAuth";
import { formatRevenue } from "@/services/earning-service";

export default function WishListPage() {
  const { user, setFavorites } = useAuth();
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/earnings/favorites/${user.id}`)
      .then((res) => res.json())
      .then((res) => setEarnings(res.data?.merged || []))
      .catch(() => setEarnings([]))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const handleDelete = async (stockId) => {
    if (!user?.id) return;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/favorites/${user.id}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock_id: stockId }),
      }
    );
    if (res.ok) {
      alert("관심 목록에서 제거되었습니다");
      // 관심종목 즉시 갱신
      const favRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/favorites/${user.id}`
      );
      const favData = await favRes.json();
      setFavorites(favData.data || []);
      // 관심종목 실적 리스트도 즉시 갱신
      const earningsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/earnings/favorites/${user.id}`
      );
      const earningsData = await earningsRes.json();
      setEarnings(earningsData.data?.merged || []);
    } else {
      alert("삭제에 실패했습니다");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!earnings.length) return <p>관심목록에 종목이 없습니다.</p>;

  return (
    <>
      <div className="grid grid-cols-7 text-sm font-semibold text-white/70 border-b border-white/20 pb-2 mb-2">
        <span className="text-center">삭제</span>
        <span>종목명</span>
        <span>발표일</span>
        <span>EPS</span>
        <span>EPS 예측</span>
        <span>매출</span>
        <span>매출 예측</span>
      </div>
      <div className="space-y-2">
        {earnings.map((item) => {
          const sortedFinances = [...(item.finances || [])].sort(
            (a, b) =>
              new Date(b.fin_release_date) - new Date(a.fin_release_date)
          );
          const today = new Date();
          const recentFinance = sortedFinances.find((fin) => {
            const diff =
              (today - new Date(fin.fin_release_date)) / (1000 * 60 * 60 * 24);
            return diff <= 10 && diff >= 0;
          });
          const latest = recentFinance || sortedFinances[0] || {};
          return (
            <div
              key={item.id}
              className="grid grid-cols-7 py-2 cursor-pointer px-2 bg-white/5 hover:bg-white/10 transition-all rounded"
              onClick={() =>
                (window.location.href = `http://localhost:3000/earning/${item.symbol}`)
              }
            >
              <button
                className="text-red-300 font-bold hover:underline cursor-pointer flex justify-center items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm("정말 삭제하시겠습니까?")) {
                    handleDelete(item.stock_id);
                  }
                }}
              >
                삭제하기
              </button>
              <span className="hover:underline">
                {item.name_kr || item.name}
              </span>
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
    </>
  );
}
