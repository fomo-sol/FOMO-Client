"use client";

import { useEffect, useState, useRef } from "react";
import { formatRevenue } from "@/services/earning-service";

export default function FinancePaging() {
  const ITEMS_PER_PAGE = 10;
  const TOTAL_ITEMS = 500;
  const PAGE_BUTTONS_PER_GROUP = 10;

  const maxPage = Math.ceil(TOTAL_ITEMS / ITEMS_PER_PAGE);

  const isLogin = useRef(false);
  const [favoriteSymbols, setFavoriteSymbols] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [page, setPage] = useState(1);
  const [buttonGroup, setButtonGroup] = useState(0);
  const [hover, setHover] = useState(null);

  const pageButtons = Array.from(
    { length: PAGE_BUTTONS_PER_GROUP },
    (_, i) => i + 1 + buttonGroup * PAGE_BUTTONS_PER_GROUP
  ).filter((p) => p <= maxPage);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    isLogin.current = true;
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload.id;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFavoriteSymbols(data.data.map((item) => item.symbol));
        }
      })
      .catch(console.error);
  }, []);

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

  const toggleFavorite = async (item) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload.id;
    const isFavorite = favoriteSymbols.includes(item.symbol);

    try {
      const method = isFavorite ? "DELETE" : "POST";
      console.log("⭐️ toggleFavorite item:", item);

      const bodyData = isFavorite
        ? { stock_id: item.id } // DELETE: 객체 그대로
        : [{ stock_id: item.id }]; // POST: 배열로 감싸야 함

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/favorites/${userId}`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bodyData),
        }
      );

      if (!res.ok) throw new Error("API 응답 실패");

      // 상태 업데이트
      setFavoriteSymbols((prev) =>
        isFavorite
          ? prev.filter((s) => s !== item.symbol)
          : [...prev, item.symbol]
      );

      alert(
        isFavorite
          ? "관심 목록에서 제거되었습니다"
          : "관심 목록에 추가되었습니다"
      );
    } catch (e) {
      console.error("즐겨찾기 토글 실패", e);
      alert("관심 종목 변경에 실패했습니다.");
    }
  };

  const moveButtonGroup = (newGroup) => {
    if (
      newGroup < 0 ||
      newGroup > Math.floor((maxPage - 1) / PAGE_BUTTONS_PER_GROUP)
    )
      return;
    setButtonGroup(newGroup);
    setPage(newGroup * PAGE_BUTTONS_PER_GROUP + 1);
  };

  if (earnings.length === 0) return <p>Loading...</p>;

  const gridCols = "grid-cols-[60px_2.0fr_1.5fr_1fr_1fr_1fr_1fr_1fr]";
  const headerClass =
    "grid text-sm font-semibold text-white/80 border-b border-white/10 pb-2 mb-2 py-4 px-2";
  const rowClass =
    "grid text-white/90 transition-all duration-150 py-3 px-2 cursor-pointer hover:bg-white/10 rounded";

  return (
    <>
      <div className={`${headerClass} ${gridCols}`}>
        <span className="text-center"></span>
        <span className="text-left pl-10">종목명</span>
        <span className="text-left pl-2">테마</span>
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
          const isFavorite = favoriteSymbols.includes(item.symbol);

          return (
            <div
              key={item.id}
              className={`${rowClass} ${gridCols}`}
              onClick={() =>
                (window.location.href = `${process.env.NEXT_PUBLIC_CLIENT_URL}/earning/${item.symbol}`)
              }
            >
              <span
                className="flex justify-center gap-3 pl-2"
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="w-4 h-4 cursor-pointer bg-contain bg-no-repeat bg-center"
                  style={{
                    backgroundImage: `url(${
                      hover === item.symbol
                        ? isFavorite
                          ? "/star-off.png"
                          : "/star-on.png"
                        : isFavorite
                        ? "/star-on.png"
                        : "/star-off.png"
                    })`,
                  }}
                  onMouseEnter={() => setHover(item.symbol)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => {
                    if (!isLogin.current) return;
                    const message = isFavorite
                      ? "정말 관심종목에서 삭제하시겠습니까?"
                      : "관심종목에 추가하시겠습니까?";
                    if (window.confirm(message)) toggleFavorite(item);
                  }}
                  title={isFavorite ? "관심종목 삭제" : "관심종목 추가"}
                />
              </span>

              <span className="flex items-center gap-2 justify-start pl-8">
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

              <span className="text-left">{item.sector}</span>
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
