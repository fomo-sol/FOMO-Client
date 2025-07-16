import StockItemCard from "./StockItemCard";

const CalendarColumn = ({ data }) => {
  return (
    <div className="bg-white rounded-t-xl shadow-md w-[240px] px-4 py-2 flex flex-col items-center font-[Pretendard]">
      <h3 className="text-[22px] text-[#1A2642] font-bold mb-2">
        {data.dayOfWeek} 장
      </h3>

      <div className="flex justify-between w-full text-center text-[14px] mb-2">
        <div className="w-1/2">
          장전
          <br />
          {data.preMarketDate}
        </div>
        <div className="w-1/2">
          장후
          <br />
          {data.afterMarketDate}
        </div>
      </div>

      <div className="flex w-full relative min-h-[350px]">
        {/* 장전 */}
        <div className="flex flex-col items-center gap-2 w-1/2">
          {data.preMarket.map((item) => (
            <StockItemCard key={item.id} {...item} />
          ))}
        </div>

        <div className="w-[1px] h-[361px] bg-[#DADADA] absolute left-1/2 top-0 z-0" />

        {/* 장후 */}
        <div className="flex flex-col items-center gap-2 w-1/2">
          {data.afterMarket.map((item) => (
            <StockItemCard key={item.id} {...item} />
          ))}
        </div>
      </div>

      {data.notices && data.notices.length > 0 && (
        <div className="relative w-full flex flex-col items-center mt-2">
          <div className="relative h-[13px]">
            <img
              src="/star.svg"
              alt="star"
              className="w-[13px] h-[13px] absolute top-0 translate-y-full left-1/2 -translate-x-1/2"
            />
          </div>

          <div className="flex flex-col gap-2 mt-3">
            {data.notices.map((notice) => (
              <div
                key={notice.id}
                className="w-[194px] h-[49px] rounded-[20px] bg-[#FFCC00] flex flex-col justify-center items-center text-[#000] font-[Pretendard]"
              >
                <div className="text-[14px] font-semibold">{notice.title}</div>
                <div className="text-[10px] font-medium">{notice.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarColumn;
