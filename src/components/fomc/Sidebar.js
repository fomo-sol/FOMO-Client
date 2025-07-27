"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./Sidebar.module.css";

export default function FOMCSidebar() {
  const router = useRouter();
  const scrollRef = useRef(null);

  const [selectedYear, setSelectedYear] = useState(() => {
    // localStorage에서 저장된 연도 불러오기, 없으면 현재 연도
    if (typeof window !== "undefined") {
      const savedYear = localStorage.getItem("fomcSelectedYear");
      return savedYear || String(new Date().getFullYear());
    }
    return String(new Date().getFullYear());
  });
  const [decisions, setDecisions] = useState([]);
  const [minutes, setMinutes] = useState([]);

  // API fetch (decisions, minutes 둘 다)
  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/fomc/decisions?year=${selectedYear}`
    )
      .then((res) => res.json())
      .then((json) => setDecisions(json.data || []));
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/fomc/minutes?year=${selectedYear}`
    )
      .then((res) => res.json())
      .then((json) => setMinutes(json.data || []));
  }, [selectedYear]);

  // decisions(의사록) 기준으로 8개 정렬
  const sortedDecisions = Array.isArray(decisions)
    ? [...decisions].sort(
        (a, b) =>
          new Date(a.fed_release_date_str) - new Date(b.fed_release_date_str)
      )
    : [];
  // minutes(금리발표)도 같은 방식으로 정렬
  const sortedMinutes = Array.isArray(minutes)
    ? [...minutes].sort(
        (a, b) =>
          new Date(a.fomc_release_date_str) - new Date(b.fomc_release_date_str)
      )
    : [];

  // 회차 계산 함수 (슬라이드/표에서 모두 사용)
  const getFomcTitle = (idx, date) => {
    const year = date ? new Date(date).getFullYear() : "-";
    return `${year}년 ${idx + 1}회차`;
  };

  // 슬라이드 카드용 데이터 가공 (오늘 기준 과거 5개 + 미래 5개)
  const today = new Date();

  const rateCards = Array.isArray(minutes)
    ? minutes
        .filter(
          (d) =>
            d.fomc_release_date_str &&
            new Date(d.fomc_release_date_str) >= today
        )
        .map((d) => ({
          ...d,
          date: d.fomc_release_date_str,
          type: "의사록",
        }))
    : [];

  const minuteCards = Array.isArray(decisions)
    ? decisions
        .filter(
          (d) =>
            d.fed_release_date_str && new Date(d.fed_release_date_str) >= today
        )
        .map((d) => ({
          ...d,
          date: d.fed_release_date_str,
          type: "금리 발표",
        }))
    : [];

  // 합쳐서 날짜순 정렬
  const allCards = [...rateCards, ...minuteCards].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // 오늘 기준 과거/미래 분리 (각 5개씩)
  const pastCards = allCards.filter((d) => new Date(d.date) < today).slice(-5);
  const futureCards = allCards
    .filter((d) => new Date(d.date) >= today)
    .slice(0, 5);
  const displayCards = [...pastCards, ...futureCards];

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

  // 카드 클릭 핸들러
  const handleCardClick = (id, date, type) => {
    // count 계산 (같은 연도의 몇 번째인지)
    const year = date ? new Date(date).getFullYear() : new Date().getFullYear();
    const sameYearItems = sortedDecisions.filter((item) => {
      const itemYear = item.fed_release_date_str
        ? new Date(item.fed_release_date_str).getFullYear()
        : null;
      return itemYear === year;
    });

    // 날짜순으로 정렬 후 현재 아이템의 인덱스 찾기
    const sortedItems = sameYearItems.sort(
      (a, b) =>
        new Date(a.fed_release_date_str) - new Date(b.fed_release_date_str)
    );
    const currentIndex = sortedItems.findIndex(
      (item) => item.fed_release_date_str === date
    );
    const count = currentIndex !== -1 ? currentIndex + 1 : 1;

    // 날짜 포맷 (YYYY-MM-DD) - fed_release_date_str 사용
    const formattedDate = date || "";

    const divType = type === "의사록" ? "decisions" : "minutes";
    router.push(
      `/fomc/${id}?div=${divType}&date=${formattedDate}&count=${count}`
    );
  };

  // 날짜 포맷 함수 (YYYY.MM.DD)
  const formatDate = (dateStr) => (dateStr ? dateStr.replace(/-/g, ".") : "-");

  // 연도 리스트 동적 생성 (현재 연도 ~ 2020)
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear; y >= 2020; y--) {
    years.push(String(y));
  }

  // 연도 변경 시 localStorage에 저장
  const handleYearChange = (year) => {
    setSelectedYear(year);
    localStorage.setItem("fomcSelectedYear", year);
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-3">FOMC 일정</h2>
      <div
        className={`flex overflow-x-auto gap-3 pb-2 ${styles["no-scrollbar"]}`}
      >
        {displayCards.length === 0 ? (
          <div className="text-white/60 px-4 py-8">일정 데이터 없음</div>
        ) : (
          displayCards.map((item, idx) => {
            const dateStr = item.date ? item.date.split("T")[0] : null;
            const dateObj = dateStr ? new Date(dateStr + "T00:00:00") : null;
            return (
              <div
                key={item.id + item.type}
                className="w-[110px] h-[150px] flex-shrink-0 rounded-[20px] transition-colors bg-gradient-to-r from-slate-700/30 to-slate-800/30 hover:from-slate-600/40 hover:to-slate-700/40 border border-slate-600/30 hover:border-slate-500/50 flex flex-col items-center justify-center text-white text-sm font-semibold"
              >
                <div className="text-lg mb-0.5">
                  {dateObj ? `${dateObj.getMonth() + 1}월` : "-"}
                </div>
                <div className="text-2xl mb-1">
                  {dateObj ? dateObj.getDate() : "-"}
                </div>
                <Image src="/FOMC.png" alt="fomc" width={32} height={32} />
                <div className="text-xs mt-2">{item.type}</div>
              </div>
            );
          })
        )}
      </div>

      {/* 연도 셀렉트 */}
      <div className="flex items-center gap-3 mb-3 mt-2 border-b border-white pb-2">
        <select
          value={selectedYear}
          onChange={(e) => handleYearChange(e.target.value)}
          className="bg-transparent cursor-pointer border border-white rounded px-2 py-1 text-sm"
        >
          {years.map((year) => (
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
              <th>금리 발표일</th>
              <th>의사록 발표일</th>
            </tr>
          </thead>
          <tbody>
            {sortedDecisions.length > 0 ? (
              sortedDecisions.map((event, idx) => {
                const d = event.fed_release_date_str
                  ? event.fed_release_date_str.replace(/-/g, ".")
                  : null;

                // 2020년도 의사록 데이터 조정
                const year = event.fed_release_date_str
                  ? new Date(event.fed_release_date_str).getFullYear()
                  : null;
                let minutesObj;

                if (year === 2020) {
                  // 2020년도: 2회차는 건너뛰고, 3회차부터는 한 칸씩 앞으로
                  if (idx === 1) {
                    // 2회차
                    minutesObj = null; // "-" 표시
                  } else if (idx >= 2) {
                    // 3회차부터
                    minutesObj = sortedMinutes[idx - 1]; // 한 칸 앞의 데이터 사용
                  } else {
                    // 1회차
                    minutesObj = sortedMinutes[idx];
                  }
                } else {
                  // 다른 연도는 기존 로직
                  minutesObj = sortedMinutes[idx];
                }

                const minutesDate = minutesObj?.fomc_release_date_str
                  ? minutesObj.fomc_release_date_str.replace(/-/g, ".")
                  : null;

                return (
                  <tr
                    key={event.id}
                    onClick={() =>
                      handleCardClick(
                        event.id,
                        event.fed_release_date_str,
                        "의사록"
                      )
                    }
                    className="cursor-pointer hover:bg-[#2c2c2c] transition rounded"
                  >
                    <td className="py-3 flex items-center gap-2">
                      <Image
                        src="/FOMC.png"
                        alt="fomc"
                        width={20}
                        height={20}
                      />
                      {d ? getFomcTitle(idx, event.fed_release_date_str) : "-"}
                    </td>
                    <td>{d}</td>
                    <td>{minutesDate || "-"}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={3} className="text-center text-white/60 py-8">
                  데이터 없음
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
