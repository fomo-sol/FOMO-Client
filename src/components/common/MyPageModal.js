"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { logoutUser, getUserInfo } from "@/services/user-service";
import TelegramModal from "./TelegramModal";
import axiosInstance from "@/services/axios-instance";

export default function MyPageModal({ onClose }) {
  const modalRef = useRef(null);
  const router = useRouter();
  const [showTelegramModal, setShowTelegramModal] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    telegram_id: ""
  });

  // 사용자 정보 가져오기
  useEffect(() => {
    getUserInfo()
      .then(data => {
        setUserInfo({
          username: data.username,
          email: data.email,
          telegram_id: data.telegram_id || ""
        });
      })
      .catch(err => {
        // 401 에러 등 인증 실패 시 처리
        if (err.response && err.response.status === 401) {
          alert("로그인이 필요합니다. 다시 로그인 해주세요.");
          onClose();
          router.push("/login");
        } else {
          console.error("유저 정보 불러오기 실패:", err);
        }
      });
  }, []);

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
      await logoutUser();
      window.dispatchEvent(new Event("storage"));
      onClose();
      router.push("/");
    } catch (err) {
      console.error("로그아웃 실패:", err);
    }
  };

  // 텔레그램 모달 띄우기
  const handleTelegramClick = () => {
    if (!userInfo.telegram_id) {
      setShowTelegramModal(true);
    }
  };

  // 텔레그램 모달 닫기
  const handleTelegramClose = () => {
    setShowTelegramModal(false);
  };

  return (
    <>
      {!showTelegramModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div
            ref={modalRef}
            className="w-[470px] h-[449px] bg-[#EAEAEA] rounded-[5px] shadow-md flex flex-col items-center justify-center font-[Pretendard] relative"
          >
            <h2 className="text-xl font-semibold text-black mb-1">{userInfo.username}</h2>
            <p className="text-sm text-gray-600 mb-4">{userInfo.email}</p>

            <Image
              src="/FOMO.png"
              alt="Profile"
              width={150}
              height={150}
              className="mb-4"
            />

            <button 
              onClick={handleTelegramClick}
              className="bg-white text-black w-[260px] py-2 rounded-full flex items-center justify-center gap-2 shadow-sm mb-2 cursor-pointer hover:bg-gray-100 transition-colors"
              disabled={!!userInfo.telegram_id} // 이미 연동된 경우 비활성화(선택)
            >
              <Image
                src="/icon_telegram.png"
                alt="Telegram"
                width={20}
                height={20}
              />
              {userInfo.telegram_id ? "텔레그램이 연동되었어요" : "텔레그램 연동하기"}
            </button>

            <button
              onClick={handleLogout}
              className="bg-black text-white text-sm w-[260px] py-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              로그아웃
            </button>

            <button
              onClick={onClose}
              className="absolute top-3 right-4 text-2xl font-bold text-[#333] hover:text-black transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {showTelegramModal && (
        <TelegramModal onClose={handleTelegramClose} />
      )}
    </>
  );
}
