"use client";
import { useState } from "react";
import TabSection from "@/components/fomc/tabSection";
import NasdaqGraph from "@/components/fomc/NasdaqGraph";
import Sp500Graph from "@/components/fomc/Sp500Graph";
import FearGreedGauge from "@/components/earning/chart/fearGreed";
import { useRouter } from "next/navigation";
import FOMCSidebar from "@/components/fomc/Sidebar";
import Content from "@/components/fomc/Content";

import GetChartView from "@/components/fomc/GetChartView";

export default function FOMCItemPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("연설");
  const [activeLangTab, setActiveLangTab] = useState("한국어");
  const [showSidebar, setShowSidebar] = useState(false);

  const fileMap = {
    연설: {
      한국어: "/fomc/20250618_statement_ko.txt",
      영어: "/fomc/20250618_transcript_en.txt",
      "AI 요약분석": "/fomc/20250618_transcript_summary_ko.html",
    },
    의사록: {
      한국어: "/fomc/20250618_statement_ko.txt",
      영어: "/fomc/2025-06-18_minutes_en.txt",
      "AI 요약분석": "/fomc/20250618_minutes_summary_ko.html",
    },
    금리결정: {
      한국어: "/fomc/20250618_imple_ko.txt",
      영어: "/fomc/2025-06-18_statement_en.txt",
      "AI 요약분석": "/fomc/20250618_imple_state_summary_ko.html",
    },
    경제전망: {
      영어: "/fomc/FOMCpresconf20250129.pdf",
    },
  };

  const getFile = () => {
    const langFiles = fileMap[activeTab];
    return langFiles ? langFiles[activeLangTab] || langFiles["영어"] : null;
  };

  const fileSrc = getFile();

  return (
    <div className="min-h-screen bg-[#081835] text-white font-[Pretendard] px-6 py-6">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex gap-6">
          {/* 왼쪽 영역 */}
          <div className="w-[600px] flex flex-col gap-2">
            {/* 제목 + sidebar 버튼  */}
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => setShowSidebar((prev) => !prev)}
                className="w-[29px] h-[28px] cursor-pointer flex-shrink-0">
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
            <h1 className="text-2xl font-bold">FOMC | 1차 (2025.07.10)</h1>
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
          </div>

            <div>
              <h2 className="text-lg font-bold text-[#5BE49B] mb-2">
                라이브 차트 불러오기
              </h2>
              <div className="w-full flex items-center justify-center overflow-hidden mb-4">
                <GetChartView/>
              </div>
            </div>

            {/*<FearGreedGauge />*/}
          </div>

          <FearGreedGauge />
        </div>

        {/* 오른쪽 영역 */}
        <div className="flex-1">
          {/* 탭 */}
          <div className="mb-4">
            <TabSection activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          <Content activeTab={activeTab} fileMap={fileMap} />
        </div>
      </div>
      <div className="fixed inset-0 z-50 pointer-events-none">
        {/* 오버레이 */}
        {showSidebar && (
          <div
            className="absolute inset-0 bg-black/40 pointer-events-auto"
            onClick={() => setShowSidebar(false)}
          />
        )}
        {/* 슬라이드 사이드바 */}
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
