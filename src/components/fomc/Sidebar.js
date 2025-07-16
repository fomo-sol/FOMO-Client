"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./Sidebar.module.css";

export default function FOMCSidebar() {
  const router = useRouter();
  const scrollRef = useRef(null);

  const [selectedYear, setSelectedYear] = useState("2025");
  const [activeTab, setActiveTab] = useState("금리");

  // 더미데이터 (교체필요)
  const upcomingDates = [
    { month: "6월", day: 24 },
    { month: "7월", day: 10 },
    { month: "8월", day: 17 },
    { month: "9월", day: 14 },
    { month: "10월", day: 14 },
    { month: "11월", day: 14 },
  ];

  // 더미데이터 (교체필요)
  const events = [
    {
      name: "1차 FOMC",
      date: "1/10",
      minutes: "2/1",
      path: "/fomc/1",
    },
    {
      name: "2차 FOMC",
      date: "3/17",
      minutes: "4/10",
      path: "/fomc/2",
    },
    {
      name: "3차 FOMC",
      date: "7/10",
      minutes: "8/8",
      path: "/fomc/3",
    },
  ];

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

  return (
    <div>
      <h2 className="text-lg font-bold mb-3">실적 발표</h2>
      <div
        ref={scrollRef}
        className={`flex overflow-x-auto gap-3 pb-4 ${styles["no-scrollbar"]}`}
      >
        {upcomingDates.map((item, idx) => (
          <div
            key={idx}
            className="w-[84px] h-[130px] flex-shrink-0 rounded-[20px] bg-[#717171] flex flex-col items-center justify-center text-white text-sm font-semibold"
          >
            <div className="text-2xl mb-1">{item.day}</div>
            <div>{item.month}</div>
            <Image src="/FOMC.png" alt="fomc" width={32} height={32} />
          </div>
        ))}
      </div>

      {/* 연도 및 탭 */}
      <div className="flex items-center gap-3 mb-3 mt-2 border-b border-white pb-2">
        {/* 실제 데이터로 교체 필요함 */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="bg-transparent border border-white rounded px-2 py-1 text-sm"
        >
          {["2025", "2024", "2023", "2022", "2021", "2020"].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* 표 형식 리스트 */}
      <div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-gray-600 text-gray-300">
              <th className="py-2">FOMC</th>
              <th>금리 발표 및 연설</th>
              <th>의사록</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, idx) => (
              <tr
                key={idx}
                onClick={() => router.push(event.path)}
                className="cursor-pointer hover:bg-[#2c2c2c] transition rounded"
              >
                <td className="py-3 flex items-center gap-2">
                  <Image src="/FOMC.png" alt="fomc" width={20} height={20} />
                  {event.name}
                </td>
                <td>{event.date}</td>
                <td>{event.minutes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
