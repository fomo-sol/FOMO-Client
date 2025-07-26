import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function InterestList({ selectedYear }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/fomc/decisions?year=${selectedYear}`
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setData(res.data);
        else setData([]);
      })
      .finally(() => setLoading(false));
  }, [selectedYear]);

  if (loading) return <div>로딩중...</div>;

  const gridCols = "grid-cols-[60px_3fr_1fr_1fr_1fr_1fr_1.5fr]";
  const headerClass = "grid text-lg font-semibold text-white/80 border-b border-white/10 pb-2 mb-2 py-4";
  const rowClass = "grid text-white/90 transition-all duration-150 py-3 px-2 cursor-pointer hover:bg-white/10";

  return (
    <div className="p-4">
      <div className={`${headerClass} ${gridCols}`}>
        <span className="text-center pl-4">#</span>
        <span className="text-center">제목</span>
        <span className="text-center">시간</span>
        <span className="text-center min-w-[60px]">실제</span>
        <span className="text-center min-w-[60px]">예측</span>
        <span className="text-center min-w-[60px]">이전</span>
        <span className="text-center pr-8">발표일</span>
      </div>
      <div className="space-y-2">
        {data.map((item, idx) => (
          <div
            key={item.id}
            onClick={() =>
              router.push(
                `/fomc/${item.id}?div=decisions&date=${
                  item.fed_release_date_str || ""
                }&count=${idx + 1}`
              )
            }
            className={`${rowClass} ${gridCols}`}
          >
            <span className="text-center">{idx + 1}</span>
            <span className="font-bold text-center">
              {selectedYear}년 제 {idx + 1}차 금리 결정 발표
            </span>
            <span className="text-center">{item.fed_start_time ? new Date(item.fed_start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-"}</span>
            <span className="text-center font-mono min-w-[60px]">{item.fed_actual_rate ?? " -"}</span>
            <span className="text-center font-mono min-w-[60px]">{item.fed_forecast_rate ?? " -"}</span>
            <span className="text-center font-mono min-w-[60px]">{item.fed_previous_rate ?? " -"}</span>
            <span className="text-center pr-4">{item.fed_release_date_str ? item.fed_release_date_str.replace(/-/g, ".") : "-"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
