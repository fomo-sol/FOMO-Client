"use client";
import AlertCard from "@/components/alert/AlertCard";
import AlertSidebar from "@/components/alert/AlertSidebar";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function AlertPage() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const selectedId = idParam ? parseInt(idParam) : null;
  const allAlerts = [
    {
      id: 1,
      iconSrc: "/엔비디아.png",
      title: "NVIDIA",
      subtitle: "2025 Q1 실적발표",
      description:
        "엔비디아(NVDA)의 2025년 1분기 실적 발표 일정이 확정되었습니다.",
      time: "07/10 오후 4시 30분",
      stripColor: "#7CA9EF",
    },
    {
      id: 2,
      iconSrc: "/fomc.png",
      title: "FOMC",
      subtitle: "2025 2차 의사록",
      description: "FOMC 회의록이 공개될 예정입니다.",
      time: "07/10 오전 4시 30분",
      stripColor: "#636363",
    },
    {
      id: 3,
      iconSrc: "/fomc.png",
      title: "FOMC",
      subtitle: "긴급 정책 발표",
      description: "중요한 금리 정책 발표가 예정되어 있습니다.",
      time: "07/10 오후 10시",
      stripColor: "#FF0540",
    },
    {
      id: 4,
      iconSrc: "/엔비디아.png",
      title: "NVIDIA",
      subtitle: "2025 Q1 실적발표",
      description:
        "엔비디아(NVDA)의 2025년 1분기 실적 발표 일정이 확정되었습니다.",
      time: "07/10 오후 4시 30분",
      stripColor: "#7CA9EF",
    },
    {
      id: 5,
      iconSrc: "/fomc.png",
      title: "FOMC",
      subtitle: "2025 2차 의사록",
      description: "FOMC 회의록이 공개될 예정입니다.",
      time: "07/10 오전 4시 30분",
      stripColor: "#636363",
    },
    {
      id: 6,
      iconSrc: "/fomc.png",
      title: "FOMC",
      subtitle: "긴급 정책 발표",
      description: "중요한 금리 정책 발표가 예정되어 있습니다.",
      time: "07/10 오후 10시",
      stripColor: "#FF0540",
    },
    {
      id: 7,
      iconSrc: "/엔비디아.png",
      title: "NVIDIA",
      subtitle: "2025 Q1 실적발표",
      description:
        "엔비디아(NVDA)의 2025년 1분기 실적 발표 일정이 확정되었습니다.",
      time: "07/10 오후 4시 30분",
      stripColor: "#7CA9EF",
    },
    {
      id: 8,
      iconSrc: "/fomc.png",
      title: "FOMC",
      subtitle: "2025 2차 의사록",
      description: "FOMC 회의록이 공개될 예정입니다.",
      time: "07/10 오전 4시 30분",
      stripColor: "#636363",
    },
    {
      id: 9,
      iconSrc: "/fomc.png",
      title: "FOMC",
      subtitle: "긴급 정책 발표",
      description: "중요한 금리 정책 발표가 예정되어 있습니다.",
      time: "07/10 오후 10시",
      stripColor: "#FF0540",
    },
    {
      id: 10,
      iconSrc: "/엔비디아.png",
      title: "NVIDIA",
      subtitle: "2025 Q1 실적발표",
      description:
        "엔비디아(NVDA)의 2025년 1분기 실적 발표 일정이 확정되었습니다.",
      time: "07/10 오후 4시 30분",
      stripColor: "#7CA9EF",
    },
    {
      id: 11,
      iconSrc: "/fomc.png",
      title: "FOMC",
      subtitle: "2025 2차 의사록",
      description: "FOMC 회의록이 공개될 예정입니다.",
      time: "07/10 오전 4시 30분",
      stripColor: "#636363",
    },
    {
      id: 12,
      iconSrc: "/fomc.png",
      title: "FOMC",
      subtitle: "긴급 정책 발표",
      description: "중요한 금리 정책 발표가 예정되어 있습니다.",
      time: "07/10 오후 10시",
      stripColor: "#FF0540",
    },
  ];
  const cardRefs = useRef({});
  useEffect(() => {
    if (selectedId && cardRefs.current[selectedId]) {
      // 선택된 카드로 스크롤
      cardRefs.current[selectedId].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedId]);

  return (
    <div className="min-h-screen bg-[#081835] px-8 pt-8 text-white font-[Pretendard] flex justify-center">
      <div className="flex w-full max-w-[1440px] gap-8">
        {/* 왼쪽: 알림 리스트 */}
        <div className="flex flex-col gap-4 flex-[3]">
          <h2 className="text-[35px] font-bold mb-2">실적발표</h2>

          {allAlerts.map((alert) => (
            <div
              key={alert.id}
              ref={(el) => {
                if (el) cardRefs.current[alert.id] = el;
              }}
            >
              <AlertCard
                iconSrc={alert.iconSrc}
                title={alert.title}
                subtitle={alert.subtitle}
                description={alert.description}
                time={alert.time}
                stripColor={alert.stripColor}
              />
            </div>
          ))}
        </div>

        {/* 오른쪽: 알림 사이드바 */}
        <div className="flex-[1]">
          <AlertSidebar />
        </div>
      </div>
    </div>
  );
}
