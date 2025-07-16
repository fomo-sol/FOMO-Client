"use client";
import Link from "next/link";
import Image from "next/image";
import NotificationPopup from "./common/NotificationPopup";
import { useState, useRef, useEffect } from "react";
export default function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const alertRef = useRef(null);
  useEffect(() => {
    console.log("알림창 상태:", showNotifications);
  }, [showNotifications]);

  // 외부 클릭 시 알림창 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (alertRef.current && !alertRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <nav
      className="text-white text-lg items-center justify-between px-16 py-6 flex gap-4 border-b"
      style={{ backgroundColor: "#081835", borderBlockColor: "#282C34" }}
    >
      <Link href="/" className="font-bold text-2xl">
        FOMO
      </Link>
      <div className="flex items-center gap-10">
        <div className="relative">
          <input
            className="bg-white text-black rounded-2xl focus:outline-none text-center"
            style={{ width: "170px", height: "30px" }}
          />
          <img
            src="/icon_search.svg"
            alt="Search_icon"
            width={24}
            height={24}
            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
          />
        </div>
        <Link href="/fomc">FOMC</Link>
        <Link href="/earning">실적발표</Link>
        <Link href="/calendar">
          <Image
            src="/icon_calendar.svg"
            alt="Calendar_page"
            width={24}
            height={24}
          />
        </Link>

        {/* 알림 아이콘 + 팝업 */}
        <div
          className="relative flex items-center justify-center"
          ref={alertRef}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowNotifications((prev) => {
                console.log("알림창 상태:", !prev);
                return !prev;
              });
            }}
            className="flex items-center justify-center"
          >
            <Image src="/icon_alert.svg" alt="Alert" width={24} height={24} />
          </button>

          {showNotifications && (
            <div className="absolute top-[calc(100%+10px)] right-0 z-50">
              <NotificationPopup onClose={() => setShowNotifications(false)} />
            </div>
          )}
        </div>

        {/* 알람이 있다면 이 아이콘으로 교체 */}
        {/* <Link href="/alert">
          <Image
            src="/icon_notification.svg"
            alt="Alert_page"
            width={24}
            height={24}
          />
        </Link> */}
        <Link href="/mypage">
          <Image src="/icon_mypage.svg" alt="My_page" width={30} height={30} />
        </Link>
      </div>
    </nav>
  );
}
