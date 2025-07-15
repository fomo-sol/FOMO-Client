import { useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./Sidebar.module.css";

export default function FOMCSidebar() {
  const router = useRouter();
  const scrollRef = useRef(null);

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
          </div>
        ))}
      </div>

      {/* 연도 및 탭 */}
      <div className="flex items-center gap-3 mb-3 mt-2 border-b border-white pb-2">
        <select className="bg-transparent border border-white rounded px-2 py-1 text-sm">
          <option>2025</option>
          <option>2024</option>
        </select>
        <div className="flex gap-4 text-sm ml-2">
          <div className="border-b-2 border-white">금리</div>
          <div>발표 및 연설</div>
          <div>의사록</div>
        </div>
      </div>

      {/* FOMC 일정 */}
      <div className="space-y-3 overflow-y-auto">
        {events.map((event, idx) => (
          <div
            key={idx}
            onClick={() => router.push(event.path)}
            className="flex items-center justify-between border-b border-gray-600 py-3 cursor-pointer hover:bg-[#2c2c2c] rounded px-2 transition"
          >
            <div className="flex items-center gap-2">
              <Image src="/FOMC.png" alt="fomc" width={32} height={32} />
              <span className="font-semibold text-[15px]">{event.name}</span>
            </div>
            <div className="text-right text-[13px] leading-tight text-[#D3D3D3]">
              <div>금리: {event.date}</div>
              <div>의사록: {event.minutes}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
