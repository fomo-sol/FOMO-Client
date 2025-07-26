import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MinutesList({ selectedYear }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/fomc/minutes?year=${selectedYear}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setData(res.data);
        else setData([]);
      })
      .catch((error) => {
        console.error("Error fetching FOMC minutes:", error);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [selectedYear]);

  if (loading) return <div>로딩중...</div>;

  const gridCols = "grid-cols-[60px_3fr_1fr_1fr_1fr_1fr_1.5fr]";
  const headerClass =
    "grid text-lg font-semibold text-white/80 border-b border-white/10 pb-2 mb-2 py-4";
  const rowClass =
    "grid text-white/90 transition-all duration-150 py-3 px-2 cursor-pointer hover:bg-white/10";

  return (
    <div className="p-4">
      <div className={`${headerClass} ${gridCols}`}>
        <span className="text-center pl-4">#</span>
        <span className="text-center">제목</span>
        <span></span>
        <span></span>
        <span></span>
        <span className="text-center min-w-[60px]">시간</span>
        <span className="text-center pr-8">발표일</span>
      </div>
      <div className="space-y-2">
        {data.length > 0 ? (
          data.map((item, idx) => {
            const itemYear = item.fomc_release_date_str
              ? new Date(item.fomc_release_date_str).getFullYear()
              : null;
            const itemMonth = item.fomc_release_date_str
              ? new Date(item.fomc_release_date_str).getMonth() + 1
              : null;
            const isNextYearJanuary =
              itemYear === parseInt(selectedYear) + 1 && itemMonth === 1;

            const displayYear = isNextYearJanuary
              ? parseInt(selectedYear) + 1
              : selectedYear;

            return (
              <div
                key={item.id}
                onClick={() =>
                  router.push(
                    `/fomc/${item.id}?div=minutes&date=${item.fomc_release_date_str || ""}&count=${idx + 1}`
                  )
                }
                className={`${rowClass} ${gridCols}`}
              >
                <span className="text-center">{idx + 1}</span>
                <span className="font-bold text-center">
                  {displayYear}년 제 {idx + 1}차 의사록
                </span>
                <span></span>
                <span></span>
                <span></span>
                <span className="text-center font-mono min-w-[60px]">
                  {item.fomc_start_time
                    ? new Date(item.fomc_start_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </span>
                <span className="pr-8 text-center">
                  {item.fomc_release_date_str
                    ? item.fomc_release_date_str.replace(/-/g, ".")
                    : "-"}
                </span>
              </div>
            );
          })
        ) : (
          <div className="text-center text-white/60 py-8">
            해당 연도의 데이터가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
