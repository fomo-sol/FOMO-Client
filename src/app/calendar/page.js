"use client";

import { useState, useEffect, useCallback, memo } from "react";
import CalendarColumn from "@/components/calendar/CalendarColumn";
import {
  getWeekDates,
  formatWeekRange,
  getPreviousWeek,
  getNextWeek,
  fetchCalendarData,
  transformCalendarData,
} from "@/services/calendar-service";

const CalendarPage = memo(() => {
  const [currentWeek, setCurrentWeek] = useState([]);
  const [calendarData, setCalendarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCalendarData = useCallback(async (weekDates) => {
    setLoading(true);
    setError(null);

    try {
      const apiData = await fetchCalendarData(weekDates);
      if (apiData) {
        const transformedData = transformCalendarData(apiData, weekDates);
        setCalendarData(transformedData);
      } else {
        // API 실패 시 빈 배열 표시
        setCalendarData([]);
        setError("데이터를 불러올 수 없습니다.");
      }
    } catch (err) {
      console.error("Failed to load calendar data:", err);
      setError("데이터를 불러오는데 실패했습니다.");
      setCalendarData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const weekDates = getWeekDates();
    setCurrentWeek(weekDates);
    loadCalendarData(weekDates);
  }, [loadCalendarData]);

  const handlePreviousWeek = useCallback(() => {
    const prevWeek = getPreviousWeek(currentWeek);
    setCurrentWeek(prevWeek);
    loadCalendarData(prevWeek);
  }, [currentWeek, loadCalendarData]);

  const handleNextWeek = useCallback(() => {
    const nextWeek = getNextWeek(currentWeek);
    setCurrentWeek(nextWeek);
    loadCalendarData(nextWeek);
  }, [currentWeek, loadCalendarData]);

  return (
    <div className="font-[Pretendard] min-h-screen bg-[#040816] text-white overflow-hidden">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
          캘린더
        </h1>
        <p className="text-gray-400 text-sm lg:text-base mb-6">
          주간 이벤트 및 FOMC 일정을 확인하세요
        </p>

        {/* 날짜 탐색 컨트롤 */}
        <div className="flex items-center justify-center gap-6 mb-8 lg:mb-10">
          <button
            onClick={handlePreviousWeek}
            disabled={loading}
            className="text-white hover:text-blue-300 p-3 disabled:opacity-50 disabled:cursor-not-allowed rounded-full hover:bg-white/10"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <span className="text-lg lg:text-xl font-semibold px-6 py-2 bg-white/10 rounded-full border border-white/20">
            {formatWeekRange(currentWeek)}
          </span>

          <button
            onClick={handleNextWeek}
            disabled={loading}
            className="text-white hover:text-blue-300 p-3 disabled:opacity-50 disabled:cursor-not-allowed rounded-full hover:bg-white/10"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* 로딩 상태 */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-white text-lg">데이터를 불러오는 중...</div>
          </div>
        )}

        {/* 에러 메시지 */}
        {error && (
          <div className="flex justify-center items-center py-6">
            <div className="text-red-400 text-sm lg:text-base">{error}</div>
          </div>
        )}

        {/* 캘린더 그리드 */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 justify-center max-w-[1800px] mx-auto">
          {calendarData.map((day, index) => (
            <CalendarColumn
              key={`${day.dayOfWeek}-${day.preMarketDate}-${index}`}
              data={day}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

CalendarPage.displayName = "CalendarPage";

export default CalendarPage;
