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
import "./Calendarstyle.css";

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
    <div className="font-[Pretendard] bg-[#040816] text-white h-screen flex flex-col">
      {/* 헤더 영역 (캘린더 제목 + 날짜 범위 컨트롤 우측 배치) */}
      <div className="shrink-0 px-4 sm:px-5 lg:px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        {/* 왼쪽: 타이틀과 설명 */}
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-1">캘린더</h1>
          <p className="text-gray-400 text-sm lg:text-base">
            주간 이벤트 및 FOMC 일정을 확인하세요
          </p>
        </div>

        {/* 오른쪽: 날짜 이동 컨트롤 */}
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <button
            onClick={handlePreviousWeek}
            disabled={loading}
            className="text-white hover:text-blue-300 p-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-full hover:bg-white/10"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <span className="text-sm sm:text-base font-semibold px-3 py-1.5 bg-white/10 rounded-full border border-white/20 whitespace-nowrap">
            {formatWeekRange(currentWeek)}
          </span>

          <button
            onClick={handleNextWeek}
            disabled={loading}
            className="text-white hover:text-blue-300 p-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-full hover:bg-white/10"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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
      </div>

      {/* 고정된 요일/날짜 라벨 */}
      <div className="overflow-x-auto pb-3">
        <div className="flex justify-center gap-6 lg:gap-8 w-full max-w-[1800px] mx-auto px-6">
          {calendarData.map((day, index) => (
            <div
              key={`label-${day.dayOfWeek}-${index}`}
              className="min-w-[280px] max-w-[280px] lg:min-w-[245px] lg:max-w-[245px] text-center flex-shrink-0"
            >
              <h3
                className={`text-[20px] lg:text-[22px] font-bold mb-3 ${
                  day.isToday ? "text-blue-400" : "text-white"
                }`}
              >
                {day.dayOfWeek}
              </h3>
              <div
                className={`text-[14px] lg:text-[16px] font-medium ${
                  day.isToday ? "text-blue-300" : "text-gray-300"
                }`}
              >
                {day.formattedDate}
              </div>
              <div className="text-[14px] lg:text-[15px] font-medium text-gray-400 flex justify-center gap-22.5 mt-1">
                <span>장전</span>
                <span>장후</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-white text-lg">데이터를 불러오는 중...</div>
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center py-6">
            <div className="text-red-400 text-sm lg:text-base">{error}</div>
          </div>
        )}

        <div className="overflow-x-auto hide-scrollbar">
          <div className="flex flex-row gap-6 lg:gap-8 justify-center max-w-[1800px] mx-auto px-6">
            {calendarData.map((day, index) => (
              <CalendarColumn
                key={`${day.dayOfWeek}-${day.preMarketDate}-${index}`}
                data={day}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

CalendarPage.displayName = "CalendarPage";

export default CalendarPage;
