"use client";
import { useEffect, useRef, useState } from "react";
import "./slideText.css";

export default function FavoriteItem({ fav, onClick }) {
  const spanRef = useRef(null); // 보여지는 실제 span
  const measureRef = useRef(null); // 크기 측정용 span
  const [isOverflow, setIsOverflow] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (measureRef.current && spanRef.current) {
        const fullWidth = measureRef.current.scrollWidth;
        const containerWidth = spanRef.current.clientWidth;
        setIsOverflow(fullWidth > containerWidth);
      }
    };

    // 약간 delay 주거나 RAF 사용
    const raf = requestAnimationFrame(checkOverflow);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <button
      onClick={onClick}
      className="group w-full flex items-center justify-between hover:bg-gray-100 px-2 py-2 rounded-md transition"
    >
      <div className="flex items-center gap-2 overflow-hidden max-w-[180px]">
        <img src={fav.logo} alt={fav.symbol} className="w-5 h-5" />
        <div
          ref={spanRef}
          className="relative overflow-hidden max-w-[120px] whitespace-nowrap"
        >
          <span
            className={`inline-block font-semibold ${
              isOverflow ? "group-hover-slide" : ""
            }`}
          >
            {fav.name_kr}
          </span>
        </div>
      </div>
      <span className="text-[11px] text-right w-[48px] text-gray-500 font-medium">
        {fav.symbol}
      </span>

      {/* 히든 measuring span */}
      <span
        ref={measureRef}
        className="absolute invisible whitespace-nowrap font-semibold"
        style={{ position: "absolute", top: "-9999px", left: "-9999px" }}
      >
        {fav.name_kr}
      </span>
    </button>
  );
}
