"use client";
import { useState } from "react";

export default function EarningDataList({ englishUrl }) {
  const [activeTab, setActiveTab] = useState("한국어");

  return (
    <div className="bg-[#1A2642] rounded-[10px] shadow-md pt-2 pb-4 px-4 relative">
      {/* 탭 선택 */}
      <div className="flex justify-start gap-[48px] mb-3 pl-[6px]">
        {["한국어", "영어", "AI 요약분석"].map((lang) => (
          <div key={lang} className="flex flex-col items-center text-center">
            <button
              onClick={() => setActiveTab(lang)}
              className={`transition-all cursor-pointer ${
                activeTab === lang ? "text-white font-bold" : "text-white/50"
              } text-sm`}
            >
              {lang}
            </button>
            {activeTab === lang && (
              <div
                className="-mb-[7px]"
                style={{
                  width: "37px",
                  height: "2px",
                  backgroundColor: "#7CA9EF",
                  borderRadius: "4px",
                }}
              />
            )}
          </div>
        ))}
      </div>
      {/* 본문 */}
      <div className="bg-white rounded-[10px] h-[600px] overflow-hidden text-[#040816]">
        {activeTab === "영어" ? (
          englishUrl ? (
            <iframe
              src={englishUrl}
              width="100%"
              height="100%"
              className="rounded-[10px]"
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                backgroundColor: "#e1e1e1",
              }}
            />
          ) : (
            <div className="text-center pt-20 text-gray-500">
              영어 원문 URL이 없습니다.
            </div>
          )
        ) : activeTab === "한국어" ? (
          <div className="p-8 text-center text-gray-700">
            한국어 데이터(더미)
          </div>
        ) : (
          <div className="p-8 text-center text-gray-700">
            AI 요약/분석 데이터(더미)
          </div>
        )}
      </div>
    </div>
  );
}
