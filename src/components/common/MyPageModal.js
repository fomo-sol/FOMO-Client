"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; // ✅ 페이지 이동
import { logoutUser } from "@/services/user-service"; // ✅ 로그아웃 함수 import

export default function MyPageModal({ onClose }) {
  const modalRef = useRef(null);
  const router = useRouter();

  // 모달 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      await logoutUser(); // 로그아웃 요청
      onClose(); // 모달 닫기
      router.push("/"); // 메인 페이지로 이동
    } catch (err) {
      console.error("로그아웃 실패:", err);
    }
  };

  return (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div
            ref={modalRef}
            className="w-[470px] h-[449px] bg-[#EAEAEA] rounded-[5px] shadow-md flex flex-col items-center justify-center font-[Pretendard] relative"
        >
          <h2 className="text-xl font-semibold text-[#EAEAEA] mb-1">지구님</h2>
          <p className="text-sm text-[#666] mb-4">qwer@naver.com</p>

          <Image
              src="/FOMO.png"
              alt="Profile"
              width={150}
              height={150}
              className="mb-4"
          />

          <button className="bg-white text-[#EAEAEA] w-[260px] py-2 rounded-full flex items-center justify-center gap-2 shadow-sm mb-2">
            <Image
                src="/icon_telegram.png"
                alt="Telegram"
                width={20}
                height={20}
            />
            텔레그램 알림받기
          </button>

          {/* 로그아웃 버튼 */}
          <button
              onClick={handleLogout}
              className="bg-black text-white text-sm w-[260px] py-2 rounded-full"
          >
            로그아웃
          </button>

          <button
              onClick={onClose}
              className="absolute top-3 right-4 text-2xl font-bold text-[#333]"
          >
            ×
          </button>
        </div>
      </div>
  );
}
