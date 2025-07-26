"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { getTelegramUrl } from "@/services/telegram-service";
import { QRCodeCanvas } from "qrcode.react";

export default function TelegramModal({ onClose }) {
  const [copied, setCopied] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const modalRef = useRef(null);
  const [telegramUrl, setTelegramUrl] = useState("");
  const copyBtnRef = useRef(null);
  const [toastPos, setToastPos] = useState({ top: 0, left: 0 });
  const [toastAnim, setToastAnim] = useState(false);
  const toastRef = useRef(null);

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
    if (copyBtnRef.current) {
      const rect = copyBtnRef.current.getBoundingClientRect();
      let toastWidth = 0;
      if (toastRef.current) {
        toastWidth = toastRef.current.offsetWidth;
      }
      setToastPos({
        top: rect.top + window.scrollY + 8, // 버튼보다 약간 아래에
        left: rect.right + window.scrollX - toastWidth, // 오른쪽 정렬
      });
    }
    setToastVisible(true);
    setToastAnim(false);
    setTimeout(() => setToastAnim(true), 10);
    setTimeout(() => setToastVisible(false), 1500);
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

  // useEffect로 토스트 width가 바뀔 때마다 위치 재계산
  useEffect(() => {
    if (toastVisible && copyBtnRef.current && toastRef.current) {
      const rect = copyBtnRef.current.getBoundingClientRect();
      const toastWidth = toastRef.current.offsetWidth;
      setToastPos({
        top: rect.top + window.scrollY - 20,
        left: rect.right + window.scrollX - toastWidth,
      });
    }
  }, [toastVisible]);

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div
        ref={modalRef}
        className="w-[590px] h-[495px] bg-[#EAEAEA] rounded-[5px] shadow-md text-black flex flex-col items-center justify-center font-[Pretendard Variable] relative px-6"
      >
        <h2 className="text-[30px] font-medium mb-3 text-black pb-2 mt-[-8px]">Telegram 봇 추가하기</h2>

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
          <button ref={copyBtnRef} onClick={handleCopy} className="hover:opacity-70 transition-opacity p-0 w-6 h-6 flex items-center justify-center">
            <Image src="/link_icon.png" alt="copy" width={16} height={16} />
          </button>
        </div>

        {/* 토스트 메시지 */}
        {toastVisible && (
          <div
            ref={toastRef}
            style={{
              position: 'fixed',
              top: toastPos.top,
              left: toastPos.left,
              background: '#fff',
              color: '#4661B2',
              borderRadius: '5px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              padding: '4px 14px',
              fontSize: '13px',
              fontWeight: 500,
              zIndex: 9999,
              pointerEvents: 'none',
              opacity: toastAnim ? 1 : 0,
              transform: toastAnim ? 'translateY(-18px)' : 'translateY(0)',
              transition: 'opacity 0.25s, transform 0.35s cubic-bezier(.4,1.6,.6,1)',
              willChange: 'transform, opacity',
              whiteSpace: 'nowrap',
            }}
          >
            복사 완료
          </div>
        )}

        {/* QR 안내 문구 */}
        <div className="w-full flex justify-center">
          <p className="mt-4 text-[17px] text-center leading-tight text-gray-800">
            QR 코드 혹은 링크를 접속하여 모바일에서 텔레그램 봇을 추가해주세요
          </p>
        </div>

        <button
          onClick={handleSubscribe}
          className="mt-4"
          style={{
            background: '#4F8FF9',
            color: '#fff',
            padding: '10px 32px',
            borderRadius: '6px',
            transition: 'background 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            justifyContent: 'center',
            marginLeft: 'auto',
            marginRight: 'auto',
            fontSize: '16px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
          onMouseOver={e => e.currentTarget.style.background = '#6CA8FA'}
          onMouseOut={e => e.currentTarget.style.background = '#4F8FF9'}
        >
          <img src="/icon_telegram.png" alt="telegram" className="w-5 h-5" />
          <span style={{ fontWeight: 400 }}>텔레그램 알림받기</span>
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
