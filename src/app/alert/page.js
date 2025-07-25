"use client";
import AlertCard from "@/components/alert/AlertCard";
import AlertSidebar from "@/components/alert/AlertSidebar";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Suspense } from "react";

function AlertPageContent() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const selectedId = idParam ? parseInt(idParam) : null;

  const [alerts, setAlerts] = useState([]);
  const [companyMap, setCompanyMap] = useState({});
  const cardRefs = useRef({});
  const [filter, setFilter] = useState("all");
  const formatKoreanDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1; // 0-based
    const day = date.getDate();
    let hours = date.getHours();
    const minutes = date.getMinutes();

    const isAM = hours < 12;
    const ampm = isAM ? "오전" : "오후";

    if (!isAM) hours = hours === 12 ? 12 : hours - 12;
    if (isAM && hours === 0) hours = 12;

    return `${month}월 ${day}일 ${ampm} ${hours}시 ${minutes}분`;
  };

  // ✅ 1. 기업 정보 먼저 불러오기
  useEffect(() => {
    const fetchCompanies = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies`);
      const json = await res.json();

      if (json.success) {
        const map = {};
        json.data.forEach((c) => {
          map[c.id.toString()] = {
            name_kr: c.name_kr,
            logo: c.logo,
          };
        });
        setCompanyMap(map);
      }
    };

    fetchCompanies();
  }, []);

  // ✅ 2. 기업 정보가 준비된 이후에 알림 불러오기
  useEffect(() => {
    if (Object.keys(companyMap).length === 0) return; // 기업 정보 준비될 때까지 대기

    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem("token");
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.userId || payload.sub || payload.id;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/notifications?filter=all&userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const json = await res.json();
        if (json.success) {
          const mapped = json.data.map((item, idx) => {
            const status = item.status || "";
            const alertContent = item.alert_content || "";
            const stripColor =
              status === "earning_global"
                ? "#7CA9EF"
                : ["earning_analysis", "fomc_analysis"].includes(status)
                ? "#FF0540"
                : "#636363";

            const stockId = item.stock_id?.toString(); // 반드시 문자열로
            const company = companyMap[stockId];

            const title = status.includes("fomc")
              ? "FOMC"
              : company?.name_kr || "기업명 없음";

            const iconSrc = status.includes("fomc")
              ? "/fomc.png"
              : company?.logo || "/default.png";

            return {
              id: idx + 1,
              iconSrc,
              title,
              description: alertContent,
              time: item.created_at
                ? formatKoreanDate(item.created_at)
                : "시간 정보 없음",

              stripColor,
            };
          });

          setAlerts(mapped);
        }
      } catch (err) {
        console.error("❌ 알림 불러오기 실패:", err);
      }
    };

    fetchAlerts();
  }, [companyMap]); // companyMap이 준비된 이후에 실행됨

  // 선택된 카드 스크롤
  useEffect(() => {
    if (selectedId && cardRefs.current[selectedId]) {
      cardRefs.current[selectedId].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedId]);

  return (
    <div className="px-8 font-[Pretendard] min-h-screen">
      <h1 className="text-2xl font-bold mb-10">알림</h1>
      <div className="flex gap-8">
        <div className="flex flex-col gap-4 flex-[3]">
          {(filter === "custom"
            ? alerts.filter((alert) => alert.stripColor === "#FF0540")
            : alerts
          ).map((alert) => (
            <div
              key={alert.id}
              ref={(el) => {
                if (el) cardRefs.current[alert.id] = el;
              }}
            >
              <AlertCard
                iconSrc={alert.iconSrc}
                title={alert.title}
                description={alert.description}
                time={alert.time}
                stripColor={alert.stripColor}
              />
            </div>
          ))}
        </div>
        <div className="flex-[1] flex justify-center">
          <AlertSidebar filter={filter} setFilter={setFilter} />
        </div>
      </div>
    </div>
  );
}

export default function AlertPage() {
  return (
    <Suspense>
      <AlertPageContent />
    </Suspense>
  );
}
