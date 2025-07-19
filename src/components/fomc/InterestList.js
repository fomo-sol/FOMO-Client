import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function InterestList({ selectedYear }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:4000/api/fomc/decisions?year=${selectedYear}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setData(res.data);
        else setData([]);
      })
      .finally(() => setLoading(false));
  }, [selectedYear]);

  if (loading) return <div>로딩중...</div>;

  const gridCols = "grid-cols-[40px_1fr_120px_120px_120px_120px_120px]";
  const headerClass =
    "grid text-lg font-semibold text-white/80 border-b border-white/10 pb-2 mb-2 py-4 ";
  const rowClass =
    "grid text-white/90 transition-all duration-150 py-3 px-2 cursor-pointer hover:bg-white/10";

  return (
    <div className="p-4">
      <div className={`${headerClass} ${gridCols}`}>
        <span className="text-center">번호</span>
        <span className="pl-2">제목</span>
        <span>시간</span>
        <span>실제</span>
        <span>예측</span>
        <span>이전</span>
        <span>발표일</span>
      </div>
      <div className="space-y-2">
        {data.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => router.push(`/fomc/${item.id}?div=decisions`)}
            className={`${rowClass} ${gridCols}`}
          >
            <span className="text-center">{idx + 1}</span>
            <span className="font-bold pl-2">
              {selectedYear}년 제 {idx + 1}차 금리 결정 발표
            </span>
            <span>
              {item.fed_start_time
                ? new Date(item.fed_start_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "-"}
            </span>
            <span>{item.fed_actual_rate ?? "-"}</span>
            <span>{item.fed_forecast_rate ?? "-"}</span>
            <span>{item.fed_previous_rate ?? "-"}</span>
            <span>
              {item.fed_release_date
                ? new Date(item.fed_release_date).toLocaleDateString()
                : "-"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
