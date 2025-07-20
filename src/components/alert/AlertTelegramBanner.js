"use client";

import { useState } from "react";
import TelegramModal from "@/components/common/TelegramModal";

export default function AlertTelegramBanner() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="bg-[#FFFFFF] text-center text-[#040816] font-[Pretendard] px-4 py-2 rounded-[12px] w-full shadow-sm">
        <p className="text-base font-bold">모바일로 편하게!</p>
        <p className="text-sm">텔레그램 알림도 받아보세요</p>
        <button
          className="mt-2 bg-[#E5E5E5] text-black text-sm rounded px-4 py-1 flex items-center gap-2 justify-center mx-auto"
          onClick={() => setShowModal(true)}
        >
          <img src="/icon_telegram.png" alt="telegram" className="w-5 h-5" />
          텔레그램 알림받기
        </button>
      </div>

      {showModal && <TelegramModal onClose={() => setShowModal(false)} />}
    </>
  );
}
