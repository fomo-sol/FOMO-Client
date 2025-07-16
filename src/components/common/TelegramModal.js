"use client";

import Image from "next/image";
import { useState } from "react";

export default function TelegramModal({ onClose }) {
  const [copied, setCopied] = useState(false);
  const telegramUrl = "https://t.me/FomoDotUSX?start=11ef5289-e6b4-11f0"; // 실제 qr url 로 대체하기

  const handleCopy = () => {
    navigator.clipboard.writeText(telegramUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="w-[590px] h-[506px] bg-[#EAEAEA] rounded-[5px] shadow-md text-[#081835] flex flex-col items-center justify-center font-[Pretendard Variable] relative px-6">
        <h2 className="text-[35px] font-medium mb-6">Telegram 봇 추가하기</h2>

        <Image
          src="/Qr_ex.png"
          alt="QR"
          width={200}
          height={200}
          className="mb-4"
        />

        <div className="flex items-center justify-center gap-2 bg-white px-4 py-2 rounded w-[445px] h-[35px]">
          <p className="text-sm truncate">{telegramUrl}</p>
          <button onClick={handleCopy}>
            <Image src="/link_icon.png" alt="copy" width={18} height={18} />
          </button>
        </div>

        <p className="mt-6 text-[20px] text-center leading-tight">
          모바일로 사진을 대체할 수 있어요. <br />
          QR 코드 혹은 링크를 접속하여 텔레그램 봇을 추가해주세요.
        </p>

        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
}
