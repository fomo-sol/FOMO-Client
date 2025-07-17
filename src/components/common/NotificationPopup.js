"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
export default function NotificationPopup({ onClose }) {
  const popupRef = useRef();
  const router = useRouter();
  // 실제 데이터로 교체 필요
  const notifications = [
    {
      id: 1,
      icon: "/엔비디아.png",
      title: "NVIDIA",
      time: "오후 2:14",
      headline: "2025 Q1 실적발표",
      description: "2025 Q1 실적발표 일정이 나왔습니다.",
    },
    {
      id: 2,
      icon: "/fomc.png",
      title: "FOMC",
      time: "오전 7:30",
      headline: "2025 2차 의사록",
      description: "2025 2차 의사록 일정이 나왔습니다.",
    },
    {
      id: 3,
      icon: "/엔비디아.png",
      title: "NVIDIA",
      time: "오후 2:14",
      headline: "2025 Q1 실적발표",
      description: "2025 Q1 실적발표 일정이 나왔습니다.",
    },
    {
      id: 4,
      icon: "/fomc.png",
      title: "FOMC",
      time: "오전 7:30",
      headline: "2025 2차 의사록",
      description: "2025 2차 의사록 일정이 나왔습니다.",
    },
    {
      id: 5,
      icon: "/엔비디아.png",
      title: "NVIDIA",
      time: "오후 2:14",
      headline: "2025 Q1 실적발표",
      description: "2025 Q1 실적발표 일정이 나왔습니다.",
    },
    {
      id: 6,
      icon: "/fomc.png",
      title: "FOMC",
      time: "오전 7:30",
      headline: "2025 2차 의사록",
      description: "2025 2차 의사록 일정이 나왔습니다.",
    },
    {
      id: 7,
      icon: "/엔비디아.png",
      title: "NVIDIA",
      time: "오후 2:14",
      headline: "2025 Q1 실적발표",
      description: "2025 Q1 실적발표 일정이 나왔습니다.",
    },
    {
      id: 8,
      icon: "/fomc.png",
      title: "FOMC",
      time: "오전 7:30",
      headline: "2025 2차 의사록",
      description: "2025 2차 의사록 일정이 나왔습니다.",
    },
    {
      id: 9,
      icon: "/엔비디아.png",
      title: "NVIDIA",
      time: "오후 2:14",
      headline: "2025 Q1 실적발표",
      description: "2025 Q1 실적발표 일정이 나왔습니다.",
    },
    {
      id: 10,
      icon: "/fomc.png",
      title: "FOMC",
      time: "오전 7:30",
      headline: "2025 2차 의사록",
      description: "2025 2차 의사록 일정이 나왔습니다.",
    },
    {
      id: 11,
      icon: "/엔비디아.png",
      title: "NVIDIA",
      time: "오후 2:14",
      headline: "2025 Q1 실적발표",
      description: "2025 Q1 실적발표 일정이 나왔습니다.",
    },
    {
      id: 12,
      icon: "/fomc.png",
      title: "FOMC",
      time: "오전 7:30",
      headline: "2025 2차 의사록",
      description: "2025 2차 의사록 일정이 나왔습니다.",
    },
  ];

  useEffect(() => {
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={popupRef}
      className="absolute right-0 mt-2 w-[350px] z-50 rounded-lg shadow-lg text-[#081835] font-[Pretendard]"
      style={{ backgroundColor: "#F3F3F3" }}
    >
      {/* 헤더 */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-[#E0E0E0]">
        <span className="text-[#081835] font-semibold text-base">알림</span>
        <button
          className="text-[12px] font-normal leading-[22px] text-[#081835]
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
                  router.push(`/alert?id=${item.id}`);
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
                <p className="text-xs text-gray-600">{item.description}</p>
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
