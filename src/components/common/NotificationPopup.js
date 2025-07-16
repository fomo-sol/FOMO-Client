"use client";

import { useEffect, useRef } from "react";

export default function NotificationPopup({ onClose }) {
  const popupRef = useRef();

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

      {/* 알림 목록 */}
      <ul className="divide-y divide-[#E0E0E0]">
        {/* 알림 아이템 */}
        <li className="p-4 hover:bg-[#F9F9F9] cursor-pointer">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <img src="/엔비디아.png" alt="NVIDIA" className="w-5 h-5" />
              <span className="text-sm font-semibold text-[#081835]">
                NVIDIA
              </span>
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              오후 2:14
            </span>
          </div>
          <p className="mt-1 text-sm font-bold text-[#081835]">
            2025 Q1 실적발표
          </p>
          <p className="text-xs text-gray-600">
            2025 Q1 실적발표 일정이 나왔습니다.
          </p>
        </li>

        <li className="p-4 hover:bg-[#F9F9F9] cursor-pointer">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <img src="/fomc.png" alt="FOMC" className="w-5 h-5" />
              <span className="text-sm font-semibold text-[#081835]">FOMC</span>
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              오전 7:30
            </span>
          </div>
          <p className="mt-1 text-sm font-bold text-[#081835]">
            2025 2차 의사록
          </p>
          <p className="text-xs text-gray-600">
            2025 2차 의사록 일정이 나왔습니다.
          </p>
        </li>
      </ul>
    </div>
  );
}
