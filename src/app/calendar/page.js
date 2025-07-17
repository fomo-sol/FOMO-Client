"use client";

import CalendarColumn from "@/components/calendar/CalendarColumn";
const calendarData = [
  {
    dayOfWeek: "월요일",
    preMarketDate: "7월 7일",
    afterMarketDate: "7월 8일",
    preMarket: [
      { id: 1, name: "NVIDIA", time: "오후 8:30", logo: "/엔비디아.png" },
    ],
    afterMarket: [
      { id: 2, name: "APPL", time: "오전 5:05", logo: "/아마존.png" },
      { id: 3, name: "APPL", time: "오전 5:05", logo: "/아마존.png" },
    ],
    notices: [
      {
        id: 1,
        type: "highlight",
        title: "FOMC 금리발표",
        time: "오후 12시 예정",
      },
      {
        id: 2,
        type: "highlight",
        title: "FOMC 연설",
        time: "오전 3시 예정",
      },
    ],
  },
  {
    dayOfWeek: "화요일",
    preMarketDate: "7월 8일",
    afterMarketDate: "7월 9일",
    preMarket: [
      { id: 4, name: "NVIDIA", time: "오후 8:30", logo: "/엔비디아.png" },
    ],
    afterMarket: [
      { id: 5, name: "APPL", time: "오전 5:05", logo: "/아마존.png" },
    ],
    notice: null,
  },
  {
    dayOfWeek: "수요일",
    preMarketDate: "7월 9일",
    afterMarketDate: "7월 10일",
    preMarket: [
      { id: 6, name: "NVIDIA", time: "오후 8:30", logo: "/엔비디아.png" },
    ],
    afterMarket: [
      { id: 7, name: "APPL", time: "오전 5:05", logo: "/아마존.png" },
    ],
    notice: null,
  },
  {
    dayOfWeek: "목요일",
    preMarketDate: "7월 10일",
    afterMarketDate: "7월 11일",
    preMarket: [
      { id: 8, name: "NVIDIA", time: "오후 8:30", logo: "/엔비디아.png" },
    ],
    afterMarket: [
      { id: 9, name: "APPL", time: "오전 5:05", logo: "/아마존.png" },
    ],
    notice: null,
  },
  {
    dayOfWeek: "금요일",
    preMarketDate: "7월 11일",
    afterMarketDate: "7월 12일",
    preMarket: [
      { id: 10, name: "NVIDIA", time: "오후 8:30", logo: "/엔비디아.png" },
    ],
    afterMarket: [
      { id: 11, name: "APPL", time: "오전 5:05", logo: "/아마존.png" },
    ],
    notices: [
      { id: 1, title: "FOMC 금리발표", time: "오후 12시 예정" },
      { id: 2, title: "FOMC 연설", time: "오전 3시 예정" },
    ],
  },
];

export default function CalendarPage() {
  return (
    <div className="px-8   font-[Pretendard] min-h-screen">
      <h1 className="text-2xl font-bold mb-10">캘린더</h1>
      <div className="flex gap-4 justify-center max-w-[1440px] mx-auto">
        {calendarData.map((day) => (
          <CalendarColumn key={day.dayOfWeek} data={day} />
        ))}
      </div>
    </div>
  );
}
