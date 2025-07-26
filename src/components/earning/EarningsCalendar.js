"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function EarningsCalendar() {
  const router = useRouter();
  const [calendarData, setCalendarData] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedDates, setExpandedDates] = useState(new Set());
  const [collapsedDates, setCollapsedDates] = useState(new Set());
  const scrollRef = useRef(null);

  // 현재 날짜 기준으로 3일 전후 날짜 계산
  const getDateRange = () => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 3);

    const end = new Date(today);
    end.setDate(today.getDate() + 3);

    return {
      start: start.toISOString().slice(0, 10).replace(/-/g, ""),
      end: end.toISOString().slice(0, 10).replace(/-/g, ""),
    };
  };

  // 캘린더 데이터 가져오기
  useEffect(() => {
    async function fetchCalendarData() {
      setLoading(true);
      try {
        const { start, end } = getDateRange();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/calendar/week?start=${start}&end=${end}`
        );
        const data = await response.json();

        if (data.success && data.data.earnings) {
          setCalendarData(data.data.earnings);
        }
      } catch (error) {
        console.error("Error fetching calendar data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCalendarData();
  }, []);

  // 슬라이드 기능
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollBy({
        left: e.deltaY * 3,
        behavior: "smooth",
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // 더보기 토글
  const toggleExpanded = (dateStr) => {
    setExpandedDates((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dateStr)) {
        newSet.delete(dateStr);
      } else {
        newSet.add(dateStr);
      }
      return newSet;
    });
    // 더보기를 클릭하면 접힌 상태 해제
    setCollapsedDates((prev) => {
      const newSet = new Set(prev);
      newSet.delete(dateStr);
      return newSet;
    });
  };

  // 펼치기 토글 (접힌 상태에서 바로 모든 항목 펼치기)
  const toggleFromCollapsed = (dateStr) => {
    setCollapsedDates((prev) => {
      const newSet = new Set(prev);
      newSet.delete(dateStr);
      return newSet;
    });
    setExpandedDates((prev) => {
      const newSet = new Set(prev);
      newSet.add(dateStr);
      return newSet;
    });
  };

  // 접기 토글 (모든 내용 접기)
  const toggleCollapsed = (dateStr) => {
    setCollapsedDates((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dateStr)) {
        newSet.delete(dateStr);
      } else {
        newSet.add(dateStr);
      }
      return newSet;
    });
    // 접힌 상태로 만들 때는 확장 상태도 해제
    setExpandedDates((prev) => {
      const newSet = new Set(prev);
      newSet.delete(dateStr);
      return newSet;
    });
  };

  // 시간 표시 변환
  const formatTime = (finHour) => {
    if (finHour === "bmo") return "장전";
    if (finHour === "amc") return "장후";
    return "장전"; // 기본값
  };

  // 기업 클릭 핸들러
  const handleCompanyClick = (symbol) => {
    router.push(`/earning/${symbol}`);
  };

  // 날짜별로 정렬된 데이터 생성
  const sortedDates = Object.keys(calendarData).sort();

  if (loading) {
    return <div className="text-white/60 px-4 py-8">캘린더 로딩중...</div>;
  }

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-y-auto"
      style={{
        scrollbarWidth: "none" /* Firefox */,
        msOverflowStyle: "none" /* IE and Edge */,
      }}
    >
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }
      `}</style>
      <h2 className="text-lg font-bold mb-3 text-white">실적 발표 캘린더</h2>

      {sortedDates.length === 0 ? (
        <div className="text-white/60 px-4 py-8">실적 발표 일정 없음</div>
      ) : (
        <div className="space-y-4">
          {sortedDates.map((dateStr) => {
            // API에서 받은 날짜를 하루씩 미뤄서 표시
            const year = dateStr.slice(0, 4);
            const month = dateStr.slice(4, 6);
            const day = dateStr.slice(6, 8);

            // 하루씩 미뤄서 날짜 생성
            const date = new Date(`${year}-${month}-${day}`);
            date.setDate(date.getDate() + 1);

            const dayName = date.toLocaleDateString("ko-KR", {
              weekday: "short",
            });
            const monthDay = date.toLocaleDateString("ko-KR", {
              month: "short",
              day: "numeric",
            });

            const earnings = calendarData[dateStr];
            const beforeEarnings = earnings?.before || [];
            const afterEarnings = earnings?.after || [];
            const allEarnings = [...beforeEarnings, ...afterEarnings];

            const isExpanded = expandedDates.has(dateStr);
            const isCollapsed = collapsedDates.has(dateStr);
            const displayEarnings = isCollapsed
              ? []
              : isExpanded
              ? allEarnings
              : allEarnings.slice(0, 5);

            return (
              <div
                key={dateStr}
                className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-white font-semibold text-lg">
                    {monthDay} ({dayName})
                  </div>
                  <button
                    onClick={() => toggleCollapsed(dateStr)}
                    className="text-slate-300 text-sm hover:text-white transition-colors cursor-pointer"
                  >
                    {isCollapsed ? "펴기" : "접기"}
                  </button>
                </div>

                <div className="space-y-2">
                  {displayEarnings.map((earning, idx) => (
                    <div
                      key={`${earning.symbol}-${idx}`}
                      onClick={() => handleCompanyClick(earning.symbol)}
                      className="flex items-center gap-3 p-3 bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-lg cursor-pointer hover:from-slate-600/60 hover:to-slate-700/60 transition-all duration-200 border border-slate-600/30 hover:border-slate-500/50 shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-white flex items-center justify-center border border-slate-400/30">
                        {earning.logo && earning.logo.includes("eodhd.com") ? (
                          <Image
                            src={earning.logo}
                            alt={earning.symbol}
                            width={28}
                            height={28}
                            className="object-contain"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className="text-sm font-bold text-slate-600"
                          style={{
                            display:
                              earning.logo && earning.logo.includes("eodhd.com")
                                ? "none"
                                : "flex",
                          }}
                        >
                          {earning.symbol.slice(0, 2)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-semibold truncate">
                          {earning.symbol}
                        </div>
                        <div className="text-slate-300 text-xs truncate">
                          {earning.event}
                        </div>
                      </div>
                      <div
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          earning.fin_hour === "bmo"
                            ? "bg-green-500/20 text-green-300 border border-green-500/30"
                            : "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                        }`}
                      >
                        {formatTime(earning.fin_hour)}
                      </div>
                    </div>
                  ))}

                  {allEarnings.length > 5 && !isCollapsed && (
                    <button
                      onClick={() => toggleExpanded(dateStr)}
                      className="w-full text-slate-300 text-sm text-center py-3 hover:text-white transition-colors bg-gradient-to-r from-slate-700/30 to-slate-800/30 rounded-lg hover:from-slate-600/40 hover:to-slate-700/40 border border-slate-600/30 hover:border-slate-500/50 cursor-pointer"
                    >
                      {isExpanded
                        ? "접기"
                        : `+${allEarnings.length - 5}개 더보기`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
