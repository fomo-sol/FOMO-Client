"use client";
import { useState } from "react";
import TabSection from "@/components/fomc/tabSection";
import NasdaqGraph from "@/components/fomc/NasdaqGraph";
import Sp500Graph from "@/components/fomc/Sp500Graph";
import FearGreedGauge from "@/components/earning/chart/fearGreed";
export default function FOMCItemPage() {
  const [activeTab, setActiveTab] = useState("연설"); // 연설, 의사록, 금리결정, 경제전망
  const [activeLangTab, setActiveLangTab] = useState("한국어");

  // 파일 경로 매핑(나중에 백엔드랑 연동 필요)
  const fileMap = {
    연설: {
      한국어: "/fomc/20200129_transcript_en ko.txt", // 텍스트 파일이지만 iframe으로 보기 어려움
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
      <h1 className="text-2xl font-bold mb-6">FOMC | 1차 (2025.07.10)</h1>

      <div className="flex gap-6">
        {/* 왼쪽 영역 */}
        <div className="w-[368px] flex flex-col gap-6">
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

        <div className="flex-1">
          <div className="mb-4">
            <TabSection activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

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

            <div className="bg-white rounded-[10px] h-[420px] overflow-hidden text-[#081835]">
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
  );
}
