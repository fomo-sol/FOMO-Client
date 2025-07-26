"use client";
import { memo } from "react";
import { useRouter } from "next/navigation";

const StockItemCard = memo(({ event, logo, time, id, symbol }) => {
  const router = useRouter();
  // 괄호 안의 심볼 제거하고 회사명만 추출
  const getCompanyName = (fullName) => {
    if (!fullName) return "Unknown";
    // 괄호와 그 안의 내용을 제거
    return fullName.replace(/\s*\([^)]*\)\s*$/, "").trim();
  };

  const companyName = getCompanyName(event);

  const handleClick = () => {
    if (symbol) {
      router.push(`/earning/${symbol}`);
    }
  };
  return (
    <div
      onClick={handleClick}
      className="cursor-pointer flex flex-col items-center gap-2 w-[56px] lg:w-[64px]"
    >
      <div className="w-[56px] h-[56px] lg:w-[64px] lg:h-[64px] bg-white border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
        <div className="p-2 w-full h-full">
          {logo ? (
            <img
              src={logo}
              alt={companyName}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
              loading="lazy"
            />
          ) : null}
          <div
            className={`hidden w-full h-full items-center justify-center text-[10px] lg:text-[12px] text-gray-600 font-semibold text-center leading-tight ${
              !logo ? "!flex" : ""
            }`}
          >
            {companyName ? companyName.split(" ")[0] : "N/A"}
          </div>
        </div>
      </div>
      <div className="text-[11px] lg:text-[13px] text-gray-800 font-medium text-center leading-tight max-w-full truncate">
        {companyName}
      </div>
    </div>
  );
});

StockItemCard.displayName = "StockItemCard";

export default StockItemCard;
