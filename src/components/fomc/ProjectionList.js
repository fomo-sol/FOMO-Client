import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProjectionList({ selectedYear }) {
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

  // 2, 4, 6, 8회차만 추출 (idx 1, 3, 5, 7)
  const filtered = data.filter((_, idx) => [1, 3, 5, 7].includes(idx));
  const quarterNames = ["1분기", "2분기", "3분기", "4분기"];

  if (loading) return <div>로딩중...</div>;

  const gridCols = "grid-cols-[40px_1fr_120px_120px]";
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
        <span>발표일</span>
      </div>
      <div className="space-y-2">
        {filtered.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => router.push(`/fomc/${item.id}?div=projections`)}
            className={`${rowClass} ${gridCols}`}
          >
            <span className="text-center">{idx + 1}</span>
            <span className="font-bold pl-2">
              {selectedYear}년 {quarterNames[idx]} 경제전망
            </span>
            <span>
              {item.fed_start_time
                ? new Date(item.fed_start_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "-"}
            </span>
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
