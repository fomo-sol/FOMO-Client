import StockItemCard from "./StockItemCard";
import { memo } from "react";
import { useRouter } from "next/navigation";
const CalendarColumn = memo(({ data, fixedHeight }) => {
  const router = useRouter();

  const handleClick = (symbol) => {
    router.push(`/earning/${symbol}`);
  };
  return (
    <div
      className={`bg-white rounded-xl shadow-md w-[280px] lg:w-[320px] px-3 py-3 font-[Pretendard] flex flex-col`}
      style={{ minHeight: "550px" }}
    >
      <div>
        <div
          className={`text-[16px] lg:text-[18px] font-semibold mb-3 ${
            data.isToday ? "text-blue-600" : "text-[#1A2642]"
          }`}
        >
          {data.formattedDate}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide min-h-[200px]">
        {data.preMarket.length === 0 && data.afterMarket.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-400 text-sm text-center px-4">
            예정된 실적발표 정보가 없습니다.
          </div>
        ) : (
          <div className="flex w-full relative gap-4">
            <div className="flex flex-col items-center gap-4 w-1/2">
              {data.preMarket.map((item) => (
                <StockItemCard
                  key={item.id}
                  {...item}
                  onClick={() => handleClick(item.symbol)}
                  symbol={item.symbol}
                />
              ))}
            </div>
            <div className="w-[1px] bg-gray-300 absolute left-1/2 top-0 bottom-0 z-0" />
            <div className="flex flex-col items-center gap-4 w-1/2">
              {data.afterMarket.map((item) => (
                <StockItemCard
                  key={item.id}
                  {...item}
                  onClick={() => handleClick(item.symbol)}
                  symbol={item.symbol}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {data.notices?.length > 0 && (
        <div className="relative w-full flex flex-col items-center mt-4">
          {/* 별 */}
          <div className="absolute top-0 translate-y-full left-1/2 -translate-x-1/2 z-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
            >
              <path
                d="M7.5 1L9.5085 5.27865L14 5.96898L10.75 9.29758L11.517 14L7.5 11.7787L3.483 14L4.25 9.29758L1 5.96898L5.4915 5.27865L7.5 1Z"
                fill="#FFCC00"
                stroke="#FFCC00"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            {data.notices.map((notice) => (
              <div
                key={notice.id}
                className="w-[205px] h-[81px] bg-[#FFCC00] rounded-[20px] flex flex-col justify-center items-center text-white text-center px-3"
              >
                <div className="text-[16px] lg:text-[18px] font-bold leading-tight">
                  {notice.title}
                </div>
                <div className="text-[12px] lg:text-[14px] font-medium leading-tight mt-1">
                  {notice.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

CalendarColumn.displayName = "CalendarColumn";
export default CalendarColumn;
