import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MinutesList({ selectedYear }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        setLoading(true);
        fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/fomc/minutes?year=${selectedYear}`
        )
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

    const gridCols = "grid-cols-[40px_965px_120px_120px]";
    const headerClass =
        "grid text-lg font-semibold text-white/80 border-b border-white/10 pb-2 mb-2 py-4 ";
    const rowClass =
        "grid text-white/90 transition-all duration-150 py-3 px-2 cursor-pointer hover:bg-white/10";

    return (
        <div className="p-4">
            <div className={`${headerClass} ${gridCols}`}>
                <span className="text-center pl-2">번호</span>
                <span className="pl-24">제목</span>
                <span className="pl-6">시간</span>
                <span className="pl-6">발표일</span>
            </div>
            <div className="space-y-2">
                {data && data.length > 0 ? (
                    data.map((item, idx) => {
                        // 해당 연도인지 다음 연도 1월인지 확인
                        const itemYear = item.fomc_release_date_str
                            ? new Date(item.fomc_release_date_str).getFullYear()
                            : null;
                        const itemMonth = item.fomc_release_date_str
                            ? new Date(item.fomc_release_date_str).getMonth() + 1
                            : null;
                        const isNextYearJanuary =
                            itemYear === parseInt(selectedYear) + 1 && itemMonth === 1;

                        // 표시할 연도 결정 (다음 연도 1월이면 해당 연도로 표시)
                        const displayYear = isNextYearJanuary
                            ? parseInt(selectedYear) + 1
                            : selectedYear;
                        const displayCount = idx + 1;

                        return (
                            <div
                                key={item.id}
                                onClick={() =>
                                    router.push(
                                        `/fomc/${item.id}?div=minutes&date=${
                                            item.fomc_release_date_str || ""
                                        }&count=${displayCount}`
                                    )
                                }
                                className={`${rowClass} ${gridCols}`}
                            >
                                <span className="text-center pr-3">{displayCount}</span>
                                <span className="font-bold pl-4">
                  {displayYear}년 제 {displayCount}차 의사록
                </span>
                                <span>
                  {item.fomc_start_time
                      ? new Date(item.fomc_start_time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                      })
                      : "-"}
                </span>
                                <span>
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
