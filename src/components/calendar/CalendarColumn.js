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
      style={{ height: fixedHeight }}
    >
      {/* ✅ 고정 영역: 날짜 + 요일 + 장전/장후 */}
      <div>
        {/* 날짜 (예: 7월 21일) */}
        <div
          className={`text-[16px] lg:text-[18px] font-semibold mb-3 ${
            data.isToday ? "text-blue-600" : "text-[#1A2642]"
          }`}
        >
          {data.formattedDate}
        </div>
      </div>

      {/* ✅ 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="flex w-full relative gap-4">
          {/* 장전 */}
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

          {/* 구분선 */}
          <div className="w-[1px] bg-gray-300 absolute left-1/2 top-0 bottom-0 z-0" />

          {/* 장후 */}
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

        {/* 공지사항 (optional) */}
        {data.notices?.length > 0 && (
          <div className="relative w-full flex flex-col items-center mt-4">
            <img
              src="/star.svg"
              alt="star"
              className="w-[16px] h-[16px] absolute top-0 translate-y-full left-1/2 -translate-x-1/2"
            />
            <div className="flex flex-col gap-3 mt-3">
              {data.notices.map((notice) => (
                <div
                  key={notice.id}
                  className={`w-[220px] lg:w-[240px] h-[56px] lg:h-[60px] rounded-xl flex flex-col justify-center items-center text-[#000] font-[Pretendard] ${
                    notice.type === "blue"
                      ? "bg-blue-500 text-white"
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
    </div>
  );
});

CalendarColumn.displayName = "CalendarColumn";
export default CalendarColumn;
