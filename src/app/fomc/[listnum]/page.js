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
  const tabParam =
    searchParams.get("tab") || (divType === "minutes" ? "의사록" : "금리결정");
  const fomcId = params.listnum;

  const [activeTab, setActiveTab] = useState(tabParam);
  const [activeLangTab, setActiveLangTab] = useState("한국어");
  const [showSidebar, setShowSidebar] = useState(false);
  const [fomcData, setFomcData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [minutesData, setMinutesData] = useState([]);
  const [decisionsData, setDecisionsData] = useState([]);
  const [selectedChartSymbol, setSelectedChartSymbol] = useState(null);

  // tabParam이 변경될 때 activeTab 업데이트
  useEffect(() => {
    setActiveTab(tabParam);
  }, [tabParam]);

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

  // 탭 클릭 핸들러 - 백엔드 API 사용
  const handleTabClick = async (tabName) => {
    if (tabName === "금리결정" || tabName === "연설") {
      if (divType === "minutes") {
        // minutes 페이지에서 decisions로 이동
        try {
          console.log("Fetching decision for minutes date:", dateParam);
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/fomc/minutes/${dateParam}/decision`
          );
          const data = await response.json();
          console.log("API response for decision:", data);

          if (data.success && data.data) {
            const targetDecision = data.data;
            console.log("Found target decision:", targetDecision);

            // 기존 count 그대로 사용, tab 파라미터 추가
            router.push(
              `/fomc/${targetDecision.id}?div=decisions&date=${targetDecision.fed_release_date_str}&count=${count}&tab=${tabName}`
            );
          } else {
            console.error(
              "Decisions data not found for the current minutes date"
            );
            console.log("API response was:", data);
          }
        } catch (error) {
          console.error("Error fetching decision by minutes date:", error);
        }
      } else {
        // decisions 페이지에서 탭만 변경
        setActiveTab(tabName);
      }
    } else if (tabName === "의사록") {
      if (divType === "decisions") {
        // decisions 페이지에서 minutes로 이동
        try {
          console.log("Fetching minutes for decision date:", dateParam);
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/fomc/decisions/${dateParam}/minutes`
          );
          const data = await response.json();
          console.log("API response for minutes:", data);

          if (data.success && data.data) {
            const targetMinutes = data.data;
            console.log("Found target minutes:", targetMinutes);

            // 기존 count 그대로 사용, tab 파라미터 추가
            router.push(
              `/fomc/${targetMinutes.id}?div=minutes&date=${targetMinutes.fomc_release_date_str}&count=${count}&tab=${tabName}`
            );
          } else {
            console.error(
              "Minutes data not found for the current decision date"
            );
            console.log("API response was:", data);
          }
        } catch (error) {
          console.error("Error fetching minutes by decision date:", error);
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
          한국어: statements?.decisions_release_content_kr_html_impl || null,
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
    <div className=" bg-[#040816] text-white font-[Pretendard] px-6 py-6">
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
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                FOMC | {count}차 ({formattedDate})
              </h1>
            </div>

            {/* 그래프 */}
            <div className="pb-1">
              <h2 className="text-2xl pb-1 font-semibold text-[#5BE49B] mb-2">
                S&P 500 SPY
              </h2>
              <div className="w-full flex items-center justify-center overflow-hidden mb-4">
                <Sp500Graph />
              </div>
            </div>

            <div>
              <h2 className="text-2xl pb-1 font-semibold text-[#5BE49B] mb-2">
                {selectedChartSymbol ? selectedChartSymbol : ""}
              </h2>
              <div className="w-full flex items-center justify-center overflow-hidden mb-4">
                <GetChartView onSymbolSelect={setSelectedChartSymbol} />
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
        {/*bg-[#242932] 제거함, 여기 밑에 디자인 수정함 조정현*/}
        <div
          className={`fixed top-0 left-0 h-full w-[412px] transition-transform duration-300 backdrop-blur-md shadow-lg p-4 pt-12 text-white pointer-events-auto ${
            showSidebar ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setShowSidebar(false)}
            className="absolute top-4 right-4 z-50 bg-slate-700/50 backdrop-blur-sm cursor-pointer rounded-full p-1 text-slate-200 w-8 h-8 flex items-center justify-center hover:bg-slate-600/60 hover:text-white transition-colors border border-slate-600/30"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <FOMCSidebar />
        </div>
      </div>
    </div>
  );
}
