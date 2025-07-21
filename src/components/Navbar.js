"use client";
import Link from "next/link";
import Image from "next/image";
import NotificationPopup from "./common/NotificationPopup";
import MyPageModal from "./common/MyPageModal";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "../../utils/useAuth";

export default function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMyPageModal, setShowMyPageModal] = useState(false);
  const alertRef = useRef(null);
  const mypageRef = useRef(null);
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  console.log("[Navbar] isLoggedIn:", isLoggedIn);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (alertRef.current && !alertRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (mypageRef.current && !mypageRef.current.contains(e.target)) {
        setShowMyPageModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <nav
      className="text-white text-lg items-center justify-between px-16 py-6 flex gap-4 border-b"
      style={{ backgroundColor: "#040816", borderBlockColor: "#282C34" }}
    >
      <Link href="/" className="font-bold text-2xl">
        FOMO
      </Link>
      <div className="flex items-center gap-10">
        <div className="relative">
          <input
            className="bg-white text-[#040816] rounded-2xl focus:outline-none text-center"
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

        <div
          className="relative flex items-center justify-center"
          ref={alertRef}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isLoggedIn) {
                if (
                  window.confirm("로그인이 필요합니다. 로그인하시겠습니까?")
                ) {
                  router.push("/login");
                }
                return;
              }
              setShowNotifications((prev) => {
                console.log("알림창 상태:", !prev);
                return !prev;
              });
            }}
            className="flex items-center cursor-pointer justify-center"
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
        {/* 마이페이지 */}
        <div className="relative" ref={mypageRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isLoggedIn) {
                setShowMyPageModal((prev) => !prev);
              } else {
                router.push("/login");
              }
            }}
            className="flex items-center justify-center"
          >
            <Image
              src="/icon_mypage.svg"
              alt="My_page"
              width={24}
              height={24}
            />
          </button>

          {isLoggedIn && showMyPageModal && (
            <MyPageModal onClose={() => setShowMyPageModal(false)} />
          )}
        </div>
      </div>
    </nav>
  );
}
