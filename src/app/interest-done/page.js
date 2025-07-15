"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function InterestDonePage() {
  const iconList = [
    {
      src: "/1-icon.png",
      top: 10,
      left: 5,
      rotate: -10,
      size: 120,
      opacity: 0.95,
    },
    {
      src: "/2-icon.png",
      top: 25,
      left: 15,
      rotate: 12,
      size: 130,
      opacity: 0.9,
    },
    {
      src: "/3-icon.png",
      top: 65,
      left: 18,
      rotate: -8,
      size: 110,
      opacity: 0.85,
    },
    {
      src: "/4-icon.png",
      top: 80,
      left: 30,
      rotate: 20,
      size: 100,
      opacity: 0.88,
    },
    {
      src: "/5-icon.png",
      top: 12,
      left: 85,
      rotate: -15,
      size: 125,
      opacity: 0.92,
    },
    {
      src: "/6-icon.png",
      top: 38,
      left: 80,
      rotate: 18,
      size: 115,
      opacity: 0.87,
    },
    {
      src: "/7-icon.png",
      top: 70,
      left: 75,
      rotate: 8,
      size: 135,
      opacity: 0.9,
    },
    {
      src: "/8-icon.png",
      top: 60,
      left: 50,
      rotate: -20,
      size: 120,
      opacity: 0.93,
    },
  ];

  return (
    <div className="relative w-full h-screen bg-[#081835] overflow-hidden font-[Pretendard]">
      {iconList.map((icon, idx) => (
        <motion.img
          key={idx}
          src={icon.src}
          alt={`floating-icon-${idx}`}
          width={icon.size}
          height={icon.size}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: icon.opacity }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
            delay: idx * 0.1,
          }}
          className="absolute z-0"
          style={{
            top: `${icon.top}%`,
            left: `${icon.left}%`,
            transform: `rotate(${icon.rotate}deg)`,
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        <h1 className="text-[60px] font-semibold text-[#FFFEFE]">
          관심 종목 등록 완료
        </h1>
        <p className="text-[30px] text-[#F7F7F7] mt-6">
          FOMC 일정부터 실적 발표 요약까지 <br />
          지구님 맞춤 알림으로 가장 빠르게 알려드릴게요
        </p>
        <p className="text-[30px] text-[#F7F7F7] mt-4">
          모바일 알림도 받아보시겠어요?
        </p>

        <button className="mt-6 bg-white text-[#081835] text-[20px] font-normal px-6 py-3 rounded-full shadow-md">
          텔레그램으로 알림받기
        </button>
      </div>
    </div>
  );
}
