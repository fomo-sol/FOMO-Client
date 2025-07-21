"use client";
import { useState, useMemo } from "react";

export default function Content({ activeTab, fileMap }) {
  const [activeLangTab, setActiveLangTab] = useState("한국어");

  const fileSrc = useMemo(() => {
    const langFiles = fileMap[activeTab];
    return langFiles ? langFiles[activeLangTab] || langFiles["영어"] : null;
  }, [activeTab, activeLangTab, fileMap]);

  return (
    <div className="bg-[#1A2642] rounded-[10px] shadow-md pt-2 pb-4 px-4 relative">
      {/* select tab */}
      <div className="flex justify-start gap-[48px] mb-3 pl-[6px]">
        {["한국어", "영어", "AI 요약분석"].map((lang) => (
          <div key={lang} className="flex flex-col items-center text-center">
            <button
              onClick={() => setActiveLangTab(lang)}
              className={`transition-all ${
                activeLangTab === lang
                  ? "text-white font-bold"
                  : "text-white/50"
              }
                text-sm`}
            >
              {lang}
            </button>
            {activeLangTab === lang && (
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
  );
}
