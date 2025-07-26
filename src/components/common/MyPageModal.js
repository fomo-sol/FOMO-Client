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
    telegram_id: "",
  });

  // 사용자 정보 가져오기
  useEffect(() => {
    getUserInfo()
      .then((data) => {
        setUserInfo({
          username: data.username,
          email: data.email,
          telegram_id: data.telegram_id || "",
        });
      })
      .catch((err) => {
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
      alert("로그아웃 되었습니다");
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
            className="select-none bg-[#EAEAEA] w-[470px] h-[449px] rounded-[5px] shadow-md flex flex-col items-center justify-center font-[Pretendard] relative "
          >
            <h2 className="text-[25px] font-medium text-[#000000] mb-[4px]">
              {userInfo.username}
            </h2>
            <p className="text-[20px] text-[#000000] font-normal mb-[15px]">
              {userInfo.email}
            </p>

            <Image
              src="/FOMO_2.png"
              alt="Profile"
              width={230}
              height={230}
              className="mb-[25px]"
            />

            <button
              onClick={handleTelegramClick}
              disabled={!!userInfo.telegram_id}
              className={`cursor-pointer w-[260px] py-[7px] rounded-full flex items-center justify-center gap-2 mb-2.5 transition-colors ${
                userInfo.telegram_id
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-white text-black hover:bg-gray-300"
              }`}
            >
              <Image
                src="/icon_telegram.png"
                alt="Telegram"
                width={20}
                height={20}
              />
              <span className="cursor-pointer text-[18px] font-normal">
                {userInfo.telegram_id
                  ? "텔레그램이 연동되었어요"
                  : "텔레그램 알림받기"}
              </span>
            </button>

            <button
              onClick={handleLogout}
              className="cursor-pointer bg-black text-white text-[18px] font-normal w-[260px] py-[7px] rounded-full hover:bg-gray-800 transition-colors"
            >
              로그아웃
            </button>

            <button
              onClick={onClose}
              className="cursor-pointer absolute top-3 right-4 text-2xl font-bold text-[#000000] hover:text-gray-400 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {showTelegramModal && <TelegramModal onClose={handleTelegramClose} />}
    </>
  );
}
