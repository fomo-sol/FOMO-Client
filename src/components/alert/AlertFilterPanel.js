"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`API 응답 오류: ${res.status} - ${errText}`);
        }

        const json = await res.json();
        console.log("🎯 즐겨찾기 응답:", json.data); // 여기에 관심 종목 배열

        // 필요 시 상태로 저장
        setFavorites(json.data);
      } catch (err) {
        console.error("❌ 즐겨찾기 fetch 실패:", err);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="w-full h-[562px] flex-shrink-0 rounded-[12px] bg-[#FFFFFF] shadow-md text-[#040816] px-6 py-4 text-sm font-[Pretendard] space-y-6">
      <div>
        <p className="mb-2 font-semibold">알림 유형</p>
        <div className="space-y-1">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="alertFilter"
              checked={filter === "all"}
              onChange={() => setFilter("all")}
            />
            전체 알림
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="alertFilter"
              checked={filter === "custom"}
              onChange={() => setFilter("custom")}
            />
            맞춤형 알림
          </label>
        </div>
      </div>

      <div>
        <p className="mb-2 font-semibold">관심 종목</p>
        <div className="space-y-1">
          {favorites.length === 0 ? (
            <p className="text-gray-400">관심종목이 없습니다.</p>
          ) : (
            favorites.map((fav, idx) => (
              <button
                key={idx}
                onClick={() => router.push(`/earning/${fav.symbol}`)}
                className="w-full flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded-md transition"
              >
                <img src={fav.logo} alt={fav.symbol} className="w-5 h-5" />
                <span className="font-semibold">{fav.name_kr}</span>
                <span className="text-sm">{fav.symbol}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
