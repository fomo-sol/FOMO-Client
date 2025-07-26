import Image from "next/image";

export default function AlertCard({
  iconSrc,
  title,
  description,
  time,
  stripColor,
}) {
  return (
    <div
      className="relative flex items-start gap-4 bg-[#F3F3F3] rounded-[8px] p-4 shadow-md"
      style={{
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
      }}
    >
      {/* 왼쪽 색 스트립 */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[5px] rounded-l-[8px]"
        style={{ backgroundColor: stripColor }}
      ></div>

      {/* 아이콘 */}
      <div className="mt-1">
        <Image src={iconSrc} alt="icon" width={32} height={32} />
      </div>

      {/* 텍스트 블럭 */}
      <div className="flex flex-col justify-center flex-1 gap-1">
        {/* ✅ 상단 타이틀 + 날짜 */}
        <div className="flex justify-between items-start">
          <div className="text-[16px] font-semibold leading-[16px] text-black/90 font-['Segoe UI Variable']">
            {title || "FOMC"}
          </div>
          <div className="text-[#697386] text-[13px] font-normal leading-[16px] font-['Pretendard Variable'] whitespace-nowrap ml-4">
            {time}
          </div>
        </div>

        {/* 본문 */}
        <div className="text-[16px] font-normal leading-[24px] text-black/90 font-['Pretendard Variable'] whitespace-pre-line">
          {description}
        </div>
      </div>
    </div>
  );
}
