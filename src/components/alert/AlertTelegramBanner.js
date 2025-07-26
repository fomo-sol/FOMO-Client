"use client";

import { useEffect, useState } from "react";
import TelegramModal from "@/components/common/TelegramModal";
import { getUserInfo } from "@/services/user-service";

export default function AlertTelegramBanner() {
  const [showModal, setShowModal] = useState(false);
  const [telegramId, setTelegramId] = useState("");

  useEffect(() => {
    getUserInfo()
      .then((data) => {
        setTelegramId(data.telegram_id || "");
      })
      .catch((err) => {
        // 에러 무시(비로그인 등)
      });
  }, []);

  return (
    <>
      <div className="bg-[#FFFFFF] text-center text-[#040816] font-[Pretendard] px-5 py-4 rounded-[12px] w-full shadow-sm">
        <p className="text-base font-bold">모바일로 편하게!</p>
        <p className="text-sm">텔레그램 알림도 받아보세요</p>
        <button
          className="mt-2 bg-[#E5E5E5] cursor-pointer text-black text-sm rounded px-4 py-1 flex items-center gap-2 justify-center mx-auto"
          onClick={() => setShowModal(true)}
          disabled={!!telegramId}
        >
          <img src="/icon_telegram.png" alt="telegram" className="w-5 h-5" />
          {telegramId ? "텔레그램이 연동되었어요" : "텔레그램 알림받기"}
        </button>
      </div>

      {showModal && <TelegramModal onClose={() => setShowModal(false)} />}
    </>
  );
}
