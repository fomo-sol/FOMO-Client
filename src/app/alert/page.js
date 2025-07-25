"use client";
import AlertCard from "@/components/alert/AlertCard";
import AlertSidebar from "@/components/alert/AlertSidebar";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, Suspense } from "react";

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
    const month = date.getMonth() + 1;
    const day = date.getDate();
    let hours = date.getHours();
    const minutes = date.getMinutes();

    const isAM = hours < 12;
    const ampm = isAM ? "오전" : "오후";

    if (!isAM) hours = hours === 12 ? 12 : hours - 12;
    if (isAM && hours === 0) hours = 12;

    return `${month}월 ${day}일 ${ampm} ${hours}시 ${minutes}분`;
  };

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

  useEffect(() => {
    if (Object.keys(companyMap).length === 0) return;

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
          const mapped = json.data.map((item) => {
            const status = item.status || "";
            const alertContent = item.alert_content || "";
            const stripColor =
              status === "earning_global"
                ? "#7CA9EF"
                : ["earning_analysis", "fomc_analysis"].includes(status)
                ? "#FF0540"
                : "#636363";

            const stockId = item.stock_id?.toString();
            const company = companyMap[stockId];

            const title = status.includes("fomc")
              ? "FOMC"
              : company?.name_kr || "FOMC";

            const iconSrc = status.includes("fomc")
              ? "/FOMC.png"
              : company?.logo || "/FOMC.png";

            return {
              id: item.id,
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
  }, [companyMap]);

  useEffect(() => {
    if (!selectedId || alerts.length === 0) return;

    const isVisible = alerts.some(
      (alert) =>
        alert.id.toString() === selectedId &&
        (filter === "all" || alert.stripColor === "#FF0540")
    );

    if (!isVisible) return;

    const frame = requestAnimationFrame(() => {
      const el = cardRefs.current[selectedId];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        el.classList.add("ring-2", "ring-[#FF0540]");
        setTimeout(() => el.classList.remove("ring-2", "ring-[#FF0540]"), 2000);
      } else {
        console.warn("❌ 해당 ref가 없습니다:", selectedId);
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [selectedId, alerts.length, filter]);

  return (
    <div className="px-8 font-[Pretendard] min-h-screen">
      <h1 className="text-2xl font-bold mb-10">알림</h1>
      <div className="w-full max-w-[1200px] mx-auto flex gap-8 justify-between">
        <div className="flex flex-col gap-4 w-[850px] pb-12">
          {(filter === "custom"
            ? alerts.filter((alert) => alert.stripColor === "#FF0540")
            : alerts
          ).map((alert) => (
            <div
              key={alert.id}
              ref={(el) => {
                if (el) {
                  cardRefs.current[alert.id] = el;
                } else {
                  delete cardRefs.current[alert.id];
                }
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
        <div className="w-[320px] flex justify-center">
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
