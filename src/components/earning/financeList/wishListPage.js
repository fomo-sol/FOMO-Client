"use client";

import { useEffect, useState } from "react";
import useAuth from "@/utils/useAuth";
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

      const favRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/favorites/${user.id}`
      );
      const favData = await favRes.json();
      setFavorites(favData.data || []);

      const earningsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/earnings/favorites/${user.id}`
      );
      const earningsData = await earningsRes.json();
      setEarnings(earningsData.data?.merged || []);
    } else {
      alert("삭제에 실패했습니다");
    }
  };

  if (loading) return <p className="text-white p-4">로딩 중...</p>;
  if (!earnings.length)
    return <p className="text-white p-4">관심목록에 종목이 없습니다.</p>;

  const gridCols = "grid-cols-[60px_2.5fr_1fr_1fr_1fr_1fr_1fr_1fr]";
  const headerClass =
    "grid text-sm font-semibold text-white/80 border-b border-white/10 pb-2 mb-2 py-4 px-2";
  const rowClass =
    "grid text-white/90 transition-all duration-150 py-3 px-2 cursor-pointer hover:bg-white/10 rounded";

  return (
    <div className="p-4">
      <div className={`${headerClass} ${gridCols}`}>
        <span className="text-center"></span>
        <span className="text-left pl-10">종목명</span>
        <span className="text-left pl-2">심볼</span>
        <span className="text-center">발표일</span>
        <span className="text-center">EPS</span>
        <span className="text-center">EPS 예측</span>
        <span className="text-center">매출</span>
        <span className="text-center">매출 예측</span>
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
              className={`${rowClass} ${gridCols}`}
              onClick={() =>
                (window.location.href = `${process.env.NEXT_PUBLIC_CLIENT_URL}/earning/${item.symbol}`)
              }
            >
              <span
                className="flex justify-center items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm("정말 삭제하시겠습니까?")) {
                    handleDelete(item.stock_id);
                  }
                }}
              >
                <div
                  className="w-4 h-4 cursor-pointer bg-[url('/star-on.png')] hover:bg-[url('/star-off.png')] bg-contain bg-no-repeat bg-center"
                  title="관심종목 삭제"
                ></div>
              </span>

              <span className="flex items-center gap-2 justify-start pl-2">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <img
                    src={item.logo}
                    alt={item.name}
                    className="w-5 h-5 rounded"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
                <span>{item.name_kr || item.name}</span>
              </span>

              <span className="text-left">{item.symbol}</span>

              <span className="text-center">
                {latest.fin_release_date?.split("T")[0] || "-"}
              </span>

              <span
                className={`text-center font-mono ${
                  latest.fin_eps_value > latest.fin_eps_forest
                    ? "text-red-400"
                    : latest.fin_eps_value < latest.fin_eps_forest
                    ? "text-blue-400"
                    : "text-white"
                }`}
              >
                {latest.fin_eps_value ?? "-"}
              </span>

              <span className="text-center font-mono">
                {latest.fin_eps_forest ?? "-"}
              </span>

              <span
                className={`text-center font-mono ${
                  latest.fin_revenue_value > latest.fin_revenue_forest
                    ? "text-red-400"
                    : latest.fin_revenue_value < latest.fin_revenue_forest
                    ? "text-blue-400"
                    : "text-white"
                }`}
              >
                {formatRevenue(latest.fin_revenue_value)}
              </span>

              <span className="text-center font-mono">
                {formatRevenue(latest.fin_revenue_forest)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
