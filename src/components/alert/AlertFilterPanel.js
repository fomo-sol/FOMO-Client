"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./slideText.css";
import FavoriteItem from "./FavoriteItem";

export default function AlertFilterPanel({ filter, setFilter }) {
  const [favorites, setFavorites] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.userId || payload.sub || payload.id;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/favorites/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok)
          throw new Error(`API 오류: ${res.status} - ${await res.text()}`);
        const json = await res.json();
        setFavorites(json.data);
      } catch (err) {
        console.error("❌ 즐겨찾기 fetch 실패:", err);
      }
    };

    fetchFavorites();
  }, []);

  // ➕ 텍스트 줄넘침 여부 체크 함수
  const shouldSlide = (el) => {
    if (!el) return false;
    return el.scrollWidth > el.clientWidth;
  };

  return (
    <div className="w-full rounded-[12px] bg-white shadow-md text-[#040816] px-6 py-4 text-sm font-[Pretendard] space-y-6">
      {/* 알림 유형 (고정 영역) */}
      <div>
        <p className="mb-2 font-semibold">알림 유형</p>
        <div className="space-y-1">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              className="cursor-pointer"
              name="alertFilter"
              checked={filter === "all"}
              onChange={() => setFilter("all")}
            />
            전체 알림
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              className="cursor-pointer"
              name="alertFilter"
              checked={filter === "custom"}
              onChange={() => setFilter("custom")}
            />
            맞춤형 알림
          </label>
        </div>
      </div>

      {/* 관심 종목 (스크롤 되는 영역) */}
      <div className="favorites-scroll max-h-[400px] overflow-y-auto pr-2">
        <p className="mb-2 font-semibold sticky top-0 bg-white z-10">
          관심 종목
        </p>
        {favorites.length === 0 ? (
          <p className="text-gray-400">관심종목이 없습니다.</p>
        ) : (
          favorites.map((fav, idx) => (
            <FavoriteItem
              key={idx}
              fav={fav}
              onClick={() => router.push(`/earning/${fav.symbol}`)}
            />
          ))
        )}
      </div>
    </div>
  );
}
