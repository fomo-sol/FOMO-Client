import StockItemCard from "./StockItemCard";
import { memo } from "react";

const CalendarColumn = memo(({ data }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-md w-[280px] lg:w-[320px] px-6 py-5 flex flex-col items-center font-[Pretendard] ${
        data.isToday ? "ring-2 ring-blue-500 ring-opacity-60" : ""
      }`}
    >
      <h3
        className={`text-[24px] lg:text-[26px] font-bold mb-3 ${
          data.isToday ? "text-blue-600" : "text-[#1A2642]"
        }`}
      >
        {data.dayOfWeek}
      </h3>

      {/* 날짜 표시 */}
      <div className="text-center text-[16px] lg:text-[18px] mb-4">
        <span
          className={
            data.isToday ? "font-bold text-blue-600" : "text-[#1A2642]"
          }
        >
          {data.preMarketDate}
        </span>
      </div>

      <div className="flex justify-between w-full text-center text-[16px] lg:text-[18px] mb-4">
        <div className="w-1/2 text-black font-semibold">장전</div>
        <div className="w-1/2 text-black font-semibold">장후</div>
      </div>

      <div className="flex w-full relative h-[460px] lg:h-[460px] overflow-hidden rounded-lg">
        {/* 장전 */}
        <div className="flex flex-col items-center gap-4 w-1/2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {data.preMarket.map((item) => (
            <StockItemCard key={item.id} {...item} />
          ))}
        </div>

        <div className="w-[1px] h-full bg-gray-300 absolute left-1/2 top-0 z-0" />

        {/* 장후 */}
        <div className="flex flex-col items-center gap-4 w-1/2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {data.afterMarket.map((item) => (
            <StockItemCard key={item.id} {...item} />
          ))}
        </div>
      </div>

      {data.notices && data.notices.length > 0 && (
        <div className="relative w-full flex flex-col items-center mt-4">
          <div className="relative h-[16px]">
            <img
              src="/star.svg"
              alt="star"
              className="w-[16px] h-[16px] absolute top-0 translate-y-full left-1/2 -translate-x-1/2"
            />
          </div>

          <div className="flex flex-col gap-3 mt-3">
            {data.notices.map((notice) => (
              <div
                key={notice.id}
                className={`w-[220px] lg:w-[240px] h-[56px] lg:h-[60px] rounded-xl flex flex-col justify-center items-center text-[#000] font-[Pretendard] ${
                  notice.type === "blue"
                    ? "bg-blue-500 text-white"
                    : notice.type === "yellow"
                    ? "bg-yellow-400"
                    : "bg-yellow-400"
                }`}
              >
                <div className="text-[16px] lg:text-[18px] font-bold">
                  {notice.title}
                </div>
                <div className="text-[12px] lg:text-[14px] font-medium opacity-90">
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
