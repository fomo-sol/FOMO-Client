"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function NotificationPopup({ onClose }) {
  const popupRef = useRef();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.userId || payload.sub || payload.id;

        const resCompany = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/companies`
        );
        const jsonCompany = await resCompany.json();
        const companyMap = {};
        jsonCompany.data.forEach((c) => {
          companyMap[c.id.toString()] = {
            name_kr: c.name_kr,
            logo: c.logo,
          };
        });

        const resAlert = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/notifications?filter=all&userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const jsonAlert = await resAlert.json();

        if (jsonAlert.success) {
          const mapped = jsonAlert.data.map((item) => {
            const status = item.status || "";
            const alertContent = item.alert_content || "";

            const stockId = item.stock_id?.toString();
            const company = companyMap[stockId];

            const title = status.includes("fomc")
              ? "FOMC"
              : company?.name_kr || "FOMC";

            const iconSrc = status.includes("fomc")
              ? "/fomc.png"
              : company?.logo || "/fomc.png";

            return {
              id: item.id,
              icon: iconSrc,
              title,
              time: item.created_at
                ? formatKoreanTime(item.created_at)
                : "시간 없음",
              description: alertContent,
            };
          });

          const read = getReadNotifications();
          const unreadOnly = mapped.filter((n) => !read.includes(n.id));
          setNotifications(unreadOnly.slice(0, 8));
        }
      } catch (err) {
        console.error("❌ 알림 또는 기업 정보 로딩 실패:", err);
      }
    };

    fetchData();
  }, []);

  function formatKoreanTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();

    const isToday =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes().toString().padStart(2, "0");
    const ampm = hour >= 12 ? "오후" : "오전";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;

    const dayPrefix = isToday ? "오늘" : `${month}월 ${day}일`;
    return `${dayPrefix} ${ampm} ${hour12}:${minute}`;
  }

  function getReadNotifications() {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("readNotifications") || "[]");
    } catch {
      return [];
    }
  }

  function markAsRead(id) {
    const current = getReadNotifications();
    const updated = [...new Set([...current, id])];
    localStorage.setItem("readNotifications", JSON.stringify(updated));
  }

  return (
    <div
      ref={popupRef}
      className="absolute right-0 mt-2 w-[350px] z-50 rounded-lg shadow-lg text-[#040816] font-[Pretendard]"
      style={{ backgroundColor: "#F3F3F3" }}
    >
      {/* 헤더 */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-[#E0E0E0]">
        <span className="text-[#040816] font-semibold text-base">알림</span>
        <button
          onClick={() => {
            router.push("/alert");
            onClose();
          }}
          className="text-[12px] font-normal leading-[22px] text-[#040816]
    border border-[rgba(0,0,0,0.06)] rounded-[3px] 
    bg-[rgba(255,255,255,0.7)] 
    px-[6px] py-0 flex items-center justify-center gap-[10px]
    font-[Segoe UI Variable] cursor-pointer hover:bg-gray-100"
        >
          전체보기
        </button>
      </div>

      {notifications.length > 0 ? (
        <ul className="max-h-[400px] overflow-y-auto">
          {notifications.map((item, index) => (
            <div key={item.id}>
              <li className="relative p-4 hover:bg-[#e9e9e9]">
                {/* ❌ X 버튼: 제목과 같은 줄 오른쪽 정렬 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markAsRead(item.id);
                    setNotifications((prev) =>
                      prev.filter((n) => n.id !== item.id)
                    );
                  }}
                  className="absolute top-4 cursor-pointer right-4 text-gray-400 hover:text-black text-xs"
                  aria-label="알림 삭제"
                >
                  ✕
                </button>

                {/* 알림 내용 */}
                <div
                  className="cursor-pointer pr-8" // x 버튼 영역 피해서 padding
                  onClick={() => {
                    markAsRead(item.id);
                    setNotifications((prev) =>
                      prev.filter((n) => n.id !== item.id)
                    );
                    router.push("/alert?id=" + item.id);
                    onClose();
                  }}
                >
                  {/* 제목 라인 */}
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <img
                      src={
                        item.title === "FOMC"
                          ? "https://pda-fomo-s3.s3.ap-northeast-2.amazonaws.com/image/FOMC.png"
                          : item.icon
                      }
                      alt={item.title}
                      className="w-4 h-4"
                    />
                    {item.title}
                  </div>

                  {/* description과 구분되는 여백 */}
                  <div className="h-1.5" />

                  {/* 설명 */}
                  <p className="text-xs text-gray-600 whitespace-pre-line">
                    {item.description}
                  </p>
                </div>

                {/* ⏰ 날짜를 오른쪽 하단에 배치 */}
                <div className="mt-2 text-right text-xs text-gray-400">
                  {item.time}
                </div>
              </li>

              {index !== notifications.length - 1 && (
                <div
                  style={{
                    width: "262px",
                    height: "1px",
                    background: "#EBEBEB",
                    margin: "0 auto",
                  }}
                />
              )}
            </div>
          ))}
        </ul>
      ) : (
        <div className="px-4 py-10 text-center text-sm text-gray-400 space-y-4">
          <p>알림이 없습니다.</p>
          <button
            onClick={() => {
              router.push("/alert");
              onClose();
            }}
            className="text-xs px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 text-[#040816] font-medium transition"
          >
            전체 알림 보기
          </button>
        </div>
      )}
    </div>
  );
}
