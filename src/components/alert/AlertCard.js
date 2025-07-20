import Image from "next/image";

export default function AlertCard({
  iconSrc,
  title,
  subtitle,
  description,
  time,
  stripColor,
}) {
  return (
    <div
      className="relative h-[106px] flex items-start gap-4 bg-[#F3F3F3] rounded-[8px] p-4 shadow-md"
      style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
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
      <div className="flex flex-col justify-center flex-1">
        <div className="text-[16px] font-semibold leading-[16px] text-black/90 font-['Segoe UI Variable']">
          {title}
        </div>
        <div className="text-[18px] font-normal leading-[20px] text-black/90 font-['Segoe UI Variable'] w-[457px]">
          {subtitle}
        </div>
        <div className="text-[#454545] text-[16px] font-normal leading-[20px] font-['Pretendard Variable']">
          {description}
        </div>
      </div>

      {/* 시간 표시 */}
      <div className="absolute bottom-2 right-4 text-[#697386] text-[14px] font-normal leading-[16px] font-['Pretendard Variable']">
        {time}
      </div>
    </div>
  );
}
