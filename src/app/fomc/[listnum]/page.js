"use client";
import { useState } from "react";
import TabSection from "@/components/fomc/tabSection";
import NasdaqGraph from "@/components/fomc/NasdaqGraph";
import Sp500Graph from "@/components/fomc/Sp500Graph";
import FearGreedGauge from "@/components/earning/chart/fearGreed";
import { useRouter } from "next/navigation";
import FOMCSidebar from "@/components/fomc/Sidebar";

export default function FOMCItemPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("연설");
  const [activeLangTab, setActiveLangTab] = useState("한국어");
  const [showSidebar, setShowSidebar] = useState(false);

  const fileMap = {
    연설: {
      한국어: "/fomc/20200129_transcript_en ko.txt",
      영어: "/fomc/20200129_transcript_en.txt",
      "AI 요약분석": "/fomc/20250618_fomcproj_ko.txt",
    },
    의사록: {
      한국어: "/fomc/2020-01-29_minutes_en.txt",
      영어: "/fomc/FOMCpresconf20250129.pdf",
      "AI 요약분석": "/fomc/2020-01-29_minutes_en.txt",
    },
    금리결정: {
      한국어: "/fomc/20250618_statement.html",
      영어: "/fomc/2020-01-29_statement_en.html",
      "AI 요약분석": "/fomc/2020-01-29_statement_en.html",
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
          <div className="w-[460px] flex flex-col gap-6">
            {/* 제목 + 뒤로가기 */}
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => setShowSidebar((prev) => !prev)}
                className="w-[29px] h-[28px] flex-shrink-0"
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
              <h1 className="text-2xl font-bold">FOMC | 1차 (2025.07.10)</h1>
            </div>

            {/* 그래프 및 게이지 */}
            <div>
              <h2 className="text-xs text-[#FF5555] mb-2">NASDAQ</h2>
              <div className="h-[105px] flex items-center justify-center">
                <NasdaqGraph />
              </div>
            </div>

            <div>
              <h2 className="text-xs text-[#5BE49B] mb-2">S&P 500</h2>
              <div className="h-[138px] flex items-center justify-center overflow-visible">
                <Sp500Graph />
              </div>
            </div>

            <FearGreedGauge />
          </div>

          {/* 오른쪽 영역 */}
          <div className="flex-1">
            {/* 탭 */}
            <div className="mb-4">
              <TabSection activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            {/* 언어 탭 + 본문 */}
            <div className="bg-[#1A2642] rounded-[10px] shadow-md pt-4 pb-6 px-6 relative">
              <div className="flex justify-start gap-[48px] mb-3 pl-[6px]">
                {["한국어", "영어", "AI 요약분석"].map((lang) => (
                  <div
                    key={lang}
                    className="flex flex-col items-center w-[80px] text-center"
                  >
                    <button
                      onClick={() => setActiveLangTab(lang)}
                      className={`transition-all ${
                        activeLangTab === lang
                          ? "text-white font-bold"
                          : "text-white/50"
                      }`}
                    >
                      {lang}
                    </button>
                    {activeLangTab === lang && (
                      <div
                        className="-mb-[7px]"
                        style={{
                          width: "37px",
                          height: "8px",
                          backgroundColor: "#7CA9EF",
                          borderRadius: "4px",
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* 본문 파일 뷰 */}
              <div className="bg-white rounded-[10px] h-[600px] overflow-hidden text-[#081835]">
                {fileSrc ? (
                  <iframe
                    src={fileSrc}
                    width="100%"
                    height="100%"
                    className="rounded-[10px]"
                    style={{ border: "1px solid #ccc", borderRadius: "8px" }}
                  />
                ) : (
                  <div className="text-center pt-20 text-gray-500">
                    해당 파일이 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showSidebar && (
        <div
          className="fixed top-0 left-0 h-full w-[412px] z-50 backdrop-blur-md"
          style={{
            backgroundColor: "rgba(36, 41, 50, 0.90)",
            boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)",
          }}
        >
          <button
            onClick={() => setShowSidebar(false)}
            className="absolute top-4 right-4 z-50 bg-black/50 rounded-full p-1 text-white"
          >
            ✕
          </button>

          <div className="p-4 pt-12 text-white">
            <FOMCSidebar />
          </div>
        </div>
      )}
    </div>
  );
}
