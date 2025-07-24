"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
export default function NotificationPopup({ onClose }) {
  const popupRef = useRef();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  // 실제 데이터로 교체 필요
  useEffect(() => {
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // ✅ 기업 정보 + 알림 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.userId || payload.sub || payload.id;

        // 기업 정보 먼저
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

        // 알림 정보
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
          const mapped = jsonAlert.data.map((item, idx) => {
            const status = item.status || "";
            const alertContent = item.alert_content || "";

            const stripColor =
              status === "earning_global"
                ? "#7CA9EF"
                : ["earning_analysis", "fomc_analysis"].includes(status)
                ? "#FF0540"
                : "#636363";

            const stockId = item.stock_id?.toString();
            const company = companyMap[stockId];

            const title = status.includes("fomc")
              ? "FOMC"
              : company?.name_kr || "기업명 없음";

            const iconSrc = status.includes("fomc")
              ? "/fomc.png"
              : company?.logo || "/default.png";

            return {
              id: idx + 1,
              icon: iconSrc,
              title,
              time: item.created_at
                ? formatKoreanTime(item.created_at)
                : "시간 없음",

              description: alertContent,
            };
          });

          // 🔹 최근 알림 5~7개만 보여주기
          setNotifications(mapped.slice(0, 7));
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
          className="text-[12px] font-normal leading-[22px] text-[#040816]
             border border-[rgba(0,0,0,0.06)] rounded-[3px] 
             bg-[rgba(255,255,255,0.7)] 
             px-[6px] py-0 flex items-center justify-center gap-[10px]
             font-[Segoe UI Variable]"
        >
          모두 지우기
        </button>
      </div>

      {notifications.length > 0 ? (
        <ul className="max-h-[400px] overflow-y-auto">
          {notifications.map((item, index) => (
            <div key={item.id}>
              <li
                className="p-4 space-y-1 cursor-pointer hover:bg-[#e9e9e9]"
                onClick={() => {
                  router.push("/alert?id=" + item.id); // 상세 링크 가능
                  onClose();
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <img src={item.icon} alt={item.title} className="w-4 h-4" />
                    {item.title}
                  </span>
                  <span className="text-xs text-gray-500">{item.time}</span>
                </div>
                <p className="text-sm font-bold">{item.headline}</p>
                <p className="text-xs text-gray-600 whitespace-pre-line">
                  {item.description}
                </p>
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
        <div className="px-4 py-10 text-center text-sm text-gray-400">
          알림이 없습니다.
        </div>
      )}
    </div>
  );
}
