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
      {/* 헤더 영역 */}
      <div className="shrink-0 px-4 sm:px-5 lg:px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-1">캘린더</h1>
          <p className="text-gray-400 text-sm lg:text-base">
            주간 이벤트 및 FOMC 일정을 확인하세요
          </p>
        </div>

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

      {/* 요일 라벨 */}
      {/* 요일 라벨 */}
      <div className="w-full px-4 sm:px-6 mt-3">
        <div className="grid grid-cols-5 gap-x-2 sm:gap-x-4">
          {calendarData.map((day, index) => (
            <div
              key={`label-${day.dayOfWeek}-${index}`}
              className="text-center"
            >
              <div className="flex flex-col gap-1.5 py-2">
                <h3
                  className={`text-[16px] sm:text-[18px] font-bold ${
                    day.isToday ? "text-blue-400" : "text-white"
                  } whitespace-nowrap truncate`}
                >
                  {day.dayOfWeek}
                </h3>
                <div
                  className={`text-[13px] sm:text-[14px] font-medium ${
                    day.isToday ? "text-blue-300" : "text-gray-300"
                  } whitespace-nowrap truncate`}
                >
                  {day.formattedDate}
                </div>
                <div className="text-[12px] sm:text-[13px] font-medium text-gray-400 flex justify-center gap-2 whitespace-nowrap">
                  <span>장전</span>
                  <span>장후</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 본문 */}
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
          <div className="flex gap-4 sm:gap-6 px-4 sm:px-6 max-w-full">
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
