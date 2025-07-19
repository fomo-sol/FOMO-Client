import React from "react";

export default function StockLiveChart({ symbol }) {
  return (
    <div className="w-full h-[260px] bg-black rounded flex items-center justify-center text-white">
      {symbol} 실시간 차트 영역
    </div>
  );
}
