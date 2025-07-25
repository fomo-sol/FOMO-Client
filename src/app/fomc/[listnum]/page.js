"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import TabSection from "@/components/fomc/tabSection";
import NasdaqGraph from "@/components/fomc/NasdaqGraph";
import Sp500Graph from "@/components/fomc/Sp500Graph";
import FearGreedGauge from "@/components/earning/chart/fearGreed";
import FOMCSidebar from "@/components/fomc/Sidebar";
import Content from "@/components/fomc/Content";
import GetChartView from "@/components/fomc/GetChartView";

export default function FOMCItemPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  // URL 파라미터에서 count와 date 가져오기
  const count = searchParams.get("count") || "1";
  const dateParam = searchParams.get("date") || "2025.07.10";
  const divType = searchParams.get("div") || "decisions";
  const fomcId = params.listnum;

  const [activeTab, setActiveTab] = useState(
    divType === "minutes" ? "의사록" : "금리결정"
  );
  const [activeLangTab, setActiveLangTab] = useState("한국어");
  const [showSidebar, setShowSidebar] = useState(false);
  const [fomcData, setFomcData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [minutesData, setMinutesData] = useState([]);
  const [decisionsData, setDecisionsData] = useState([]);

  // minutes 데이터 가져오기 (의사록 탭용)
  useEffect(() => {
    async function fetchMinutesData() {
      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/fomc/minutes?year=${new Date().getFullYear()}`
        );
        const data = await response.json();
        if (data.success) {
          setMinutesData(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching minutes data:", error);
      }
    }

    fetchMinutesData();
  }, []);

  // decisions 데이터 가져오기 (금리결정/연설 탭용)
  useEffect(() => {
    async function fetchDecisionsData() {
      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/fomc/decisions?year=${new Date().getFullYear()}`
        );
        const data = await response.json();
        if (data.success) {
          setDecisionsData(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching decisions data:", error);
      }
    }

    fetchDecisionsData();
  }, []);

  // API 데이터 가져오기
  useEffect(() => {
    async function fetchFOMCData() {
      setLoading(true);
      try {
        const url =
          divType === "minutes"
            ? `${process.env.NEXT_PUBLIC_API_URL}/fomc/minutes/${fomcId}?date=${dateParam}`
            : `${process.env.NEXT_PUBLIC_API_URL}/fomc/decisions/${fomcId}?date=${dateParam}`;

        console.log("Fetching FOMC data from:", url);
        console.log(
          "fomcId:",
          fomcId,
          "divType:",
          divType,
          "dateParam:",
          dateParam
        );

        const response = await fetch(url);
        const data = await response.json();

        console.log("API response:", data);

        if (data.success) {
          setFomcData(data.data);
        } else {
          console.error("Failed to fetch FOMC data:", data);
        }
      } catch (error) {
        console.error("Error fetching FOMC data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (fomcId) {
      fetchFOMCData();
    }
  }, [fomcId, divType, dateParam]);

  // 날짜 포맷 변환 (2025-01-29 -> 2025.01.29)
  const formattedDate = dateParam.replace(/-/g, ".");

  // 탭 클릭 핸들러 - 해당하는 API로 이동
  const handleTabClick = (tabName) => {
    if (tabName === "금리결정") {
      if (divType === "minutes") {
        // minutes 페이지에서 decisions로 이동
        const currentYear = new Date(dateParam).getFullYear();
        const currentCount = parseInt(count);

        // 같은 연도의 decisions 데이터에서 해당 회차 찾기
        const sameYearDecisions = decisionsData.filter((item) => {
          const itemYear = new Date(item.fed_release_date_str).getFullYear();
          return itemYear === currentYear;
        });

        // 날짜순 정렬 후 해당 회차의 decisions 찾기
        const sortedDecisions = sameYearDecisions.sort(
          (a, b) =>
            new Date(a.fed_release_date_str) - new Date(b.fed_release_date_str)
        );

        const targetDecision = sortedDecisions[currentCount - 1];

        if (targetDecision) {
          router.push(
            `/fomc/${targetDecision.id}?div=decisions&date=${targetDecision.fed_release_date_str}&count=${currentCount}`
          );
        } else {
          console.error("Decisions data not found for the current count");
        }
      } else {
        // decisions 페이지에서 탭만 변경
        setActiveTab("금리결정");
      }
    } else if (tabName === "연설") {
      if (divType === "minutes") {
        // minutes 페이지에서 decisions로 이동 (연설은 decisions API에서 가져옴)
        const currentYear = new Date(dateParam).getFullYear();
        const currentCount = parseInt(count);

        const sameYearDecisions = decisionsData.filter((item) => {
          const itemYear = new Date(item.fed_release_date_str).getFullYear();
          return itemYear === currentYear;
        });

        const sortedDecisions = sameYearDecisions.sort(
          (a, b) =>
            new Date(a.fed_release_date_str) - new Date(b.fed_release_date_str)
        );

        const targetDecision = sortedDecisions[currentCount - 1];

        if (targetDecision) {
          router.push(
            `/fomc/${targetDecision.id}?div=decisions&date=${targetDecision.fed_release_date_str}&count=${currentCount}`
          );
        } else {
          console.error("Decisions data not found for the current count");
        }
      } else {
        // decisions 페이지에서 탭만 변경
        setActiveTab("연설");
      }
    } else if (tabName === "의사록") {
      if (divType === "decisions") {
        // decisions 페이지에서 minutes로 이동
        const currentYear = new Date(dateParam).getFullYear();
        const currentCount = parseInt(count);

        // 같은 연도의 minutes 데이터에서 해당 회차 찾기
        const sameYearMinutes = minutesData.filter((item) => {
          const itemYear = new Date(item.fomc_release_date_str).getFullYear();
          return itemYear === currentYear;
        });

        // 날짜순 정렬 후 해당 회차의 minutes 찾기
        const sortedMinutes = sameYearMinutes.sort(
          (a, b) =>
            new Date(a.fomc_release_date_str) -
            new Date(b.fomc_release_date_str)
        );

        const targetMinutes = sortedMinutes[currentCount - 1];

        if (targetMinutes) {
          router.push(
            `/fomc/${targetMinutes.id}?div=minutes&date=${targetMinutes.fomc_release_date_str}&count=${currentCount}`
          );
        } else {
          console.error("Minutes data not found for the current count");
        }
      } else {
        // minutes 페이지에서 탭만 변경
        setActiveTab("의사록");
      }
    }
  };

  // 탭별 파일 매핑 (실제 API 데이터 기반)
  const getFileMap = () => {
    if (!fomcData) return {};

    if (divType === "minutes") {
      const script = fomcData.script;
      return {
        의사록: {
          한국어: script?.minutes_release_content_kr || null,
          영어: script?.minutes_release_content_en_pdf || null,
          "AI 요약분석": script?.minutes_release_content_an || null,
        },
      };
    } else {
      // decisions API에서 가져온 데이터
      const statements = fomcData.statements;
      const speeches = fomcData.speeches;
      return {
        금리결정: {
          한국어: statements?.decisions_release_content_kr_html_stat || null,
          영어: statements?.decisions_release_content_en_html_stat || null,
          "AI 요약분석": statements?.decisions_release_content_an || null,
        },
        연설: {
          한국어: speeches?.fomc_speech_content_kr || null,
          영어: speeches?.fomc_speech_content_en || null,
          "AI 요약분석": speeches?.fomc_speech_content_an || null,
        },
      };
    }
  };

  const fileMap = getFileMap();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#040816] text-white font-[Pretendard] px-6 py-6 flex items-center justify-center">
        <div>로딩중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040816] text-white font-[Pretendard] px-6 py-6">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex gap-6">
          {/* 왼쪽 영역 */}
          <div className="w-[600px] flex flex-col gap-2">
            {/* 제목 + sidebar 버튼 */}
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => setShowSidebar((prev) => !prev)}
                className="cursor-pointer flex-shrink-0  rounded p-1 hover:bg-white/20 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="29"
                  height="28"
                  viewBox="0 0 29 28"
                  fill="none"
                >
                  <path
                    d="M14.5 27C17.4632 27 19.7788 26.8455 21.5938 26.4561C23.399 26.0686 24.6444 25.4617 25.5332 24.6035C27.3262 22.8722 28 19.7977 28 14C28 8.20228 27.3262 5.12785 25.5332 3.39648C24.6444 2.5383 23.399 1.93136 21.5938 1.54395C19.7788 1.1545 17.4632 1 14.5 1C11.5368 1 9.2212 1.1545 7.40625 1.54395C5.601 1.93136 4.35563 2.5383 3.4668 3.39648C1.67382 5.12785 1 8.20228 1 14C1 19.7977 1.67382 22.8722 3.4668 24.6035C4.35563 25.4617 5.601 26.0686 7.40625 26.4561C9.2212 26.8455 11.5368 27 14.5 27Z"
                    stroke="#FFFEFE"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12.0832 9.33337L16.9165 14L12.0832 18.6667"
                    stroke="#FFFEFE"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <h1 className="text-2xl font-bold">
                FOMC | {count}차 ({formattedDate})
              </h1>
            </div>

            {/* 그래프 */}
            <div>
              <h2 className="text-lg font-bold text-[#5BE49B] mb-2">
                S&P 500 SPY
              </h2>
              <div className="w-full flex items-center justify-center overflow-hidden mb-4">
                <Sp500Graph />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#5BE49B] mb-2">
                라이브 차트 불러오기
              </h2>
              <div className="w-full flex items-center justify-center overflow-hidden mb-4">
                <GetChartView />
              </div>
            </div>
          </div>

          {/* 공포탐욕지수 */}
          {/*<FearGreedGauge />*/}

          {/* 오른쪽 영역 */}
          <div className="flex-1">
            <div className="mb-4">
              <TabSection
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                divType={divType}
                onTabClick={handleTabClick}
              />
            </div>
            <Content activeTab={activeTab} fileMap={fileMap} />
          </div>
        </div>
      </div>

      {/* 사이드바 오버레이 */}
      <div className="fixed inset-0 z-50 pointer-events-none">
        {showSidebar && (
          <div
            className="absolute inset-0 bg-black/40 pointer-events-auto"
            onClick={() => setShowSidebar(false)}
          />
        )}

        <div
          className={`fixed top-0 left-0 h-full w-[412px] transition-transform duration-300 bg-[#242932] backdrop-blur-md shadow-lg p-4 pt-12 text-white pointer-events-auto ${
            showSidebar ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setShowSidebar(false)}
            className="absolute top-4 right-4 z-50 bg-black/50 cursor-pointer rounded-full p-1 text-white w-8 h-8 flex items-center justify-center"
            aria-label="사이드바 닫기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          <FOMCSidebar />
        </div>
      </div>
    </div>
  );
}
