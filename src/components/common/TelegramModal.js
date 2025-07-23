"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { getTelegramUrl } from "@/services/telegram-service";
import { QRCodeCanvas } from "qrcode.react";

export default function TelegramModal({ onClose }) {
  const [copied, setCopied] = useState(false);
  const modalRef = useRef(null);
  const [telegramUrl, setTelegramUrl] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    let userId = "";
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userId = payload.id;
    }
    if (!userId) return;

    getTelegramUrl(userId).then(setTelegramUrl);
  }, []);

  const handleCopy = () => {
    if (!telegramUrl) return;
    navigator.clipboard.writeText(telegramUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSubscribe = () => {
    if (telegramUrl) {
      window.open(telegramUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert("텔레그램 링크를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
    }
  };

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

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div
        ref={modalRef}
        className="w-[590px] h-[506px] bg-[#EAEAEA] rounded-[5px] shadow-md text-black flex flex-col items-center justify-center font-[Pretendard Variable] relative px-6"
      >
        <h2 className="text-[35px] font-medium mb-6 text-black">Telegram 봇 추가하기</h2>

        {telegramUrl ? (
            <QRCodeCanvas
                value={telegramUrl}
                size={200}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
                includeMargin={true}
                className="mb-4"
            />
        ) : (
            <p className="mb-4 text-gray-600">QR 로딩 중...</p>
        )}

        <div className="flex items-center justify-center gap-2 bg-white px-4 py-2 rounded w-[445px] h-[35px]">
          <p className="text-sm truncate text-gray-700">{telegramUrl || "로딩 중..."}</p>
          <button onClick={handleCopy} className="hover:opacity-70 transition-opacity">
            <Image src="/link_icon.png" alt="copy" width={18} height={18} />
          </button>
        </div>

        <p className="mt-6 text-[20px] text-center leading-tight text-gray-800">
          모바일로 사진을 대체할 수 있어요. <br />
          QR 코드 혹은 링크를 접속하여 텔레그램 봇을 추가해주세요.
        </p>

        <button
          onClick={handleSubscribe}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          텔레그램으로 알림받기
        </button>

        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl font-bold text-gray-600 hover:text-black transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
}
