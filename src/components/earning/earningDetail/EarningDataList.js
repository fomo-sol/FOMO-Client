"use client";
import { useState, useEffect, use, useRef } from "react";

export default function EarningDataList({
  englishUrl,
  firstFinanceId,
  symbol,
  earningData,
}) {
  const [activeTab, setActiveTab] = useState("영어");
  const [loading, setLoading] = useState(false);

  const [isExistEn, setIsExistEn] = useState(false);
  const [isExistKr, setIsExistKr] = useState(false);
  const [isExistAn, setIsExistAn] = useState(false);

  // earningData가 변경될 때마다 처리
  useEffect(() => {
    if (earningData && earningData.length > 0) {
      // 첫 번째 데이터 사용 (API 응답이 배열 형태)
      const data = earningData[0];
      console.log("EarningDataList received data:", data);
    }
  }, [earningData]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // earningData에서 첫 번째 항목 가져오기
  const currentData =
    earningData && earningData.length > 0 ? earningData[0] : null;

  useEffect(() => {
    if (currentData?.stock_release_content_en) {
      fetch(currentData.stock_release_content_en, {
        method: "GET",
        mode: "cors",
      })
        .then((response) => {
          if (response.ok) {
            setIsExistEn(true);
          } else {
            setIsExistEn(false);
          }
        })
        .catch(() => setIsExistEn(false));
    }
    if (currentData?.stock_release_content_kr) {
      fetch(currentData.stock_release_content_kr, {
        method: "GET",
        mode: "cors",
      })
        .then((response) => {
          if (response.ok) {
            setIsExistKr(true);
          } else {
            setIsExistKr(false);
          }
        })
        .catch(() => setIsExistKr(false));
    }
    if (currentData?.stock_release_content_an) {
      fetch(currentData.stock_release_content_an, {
        method: "GET",
        mode: "cors",
      })
        .then((response) => {
          if (response.ok) {
            setIsExistAn(true);
          } else {
            setIsExistAn(false);
          }
        })
        .catch(() => setIsExistAn(false));
    }
  }, [currentData]);

  return (
    <div className="bg-gray-800 rounded-[10px] h-full shadow-md pt-4 pb-14 px-4 relative">
      {/* 탭 선택 */}
      <div className="flex justify-start gap-[48px] mb-3 pl-[6px]">
        {["한국어", "영어", "AI 요약분석"].map((lang) => (
          <div key={lang} className="flex flex-col items-center text-center">
            <button
              onClick={() => handleTabClick(lang)}
              className={`transition-all cursor-pointer ${
                activeTab === lang
                  ? "text-white font-bold text-xl"
                  : "text-white/50 text-lg"
              } `}
            >
              {lang}
            </button>
            {activeTab === lang && (
              <div
                className="-mb-[4px]"
                style={{
                  width: "37px",
                  height: "5px",
                  backgroundColor: "#7CA9EF",
                  borderRadius: "2px",
                }}
              />
            )}
          </div>
        ))}
      </div>
      {/* 본문 */}
      <div className="bg-white rounded-[10px] mt-2  h-full overflow-hidden text-[#040816]">
        {loading ? (
          <div className="text-center pt-20 text-gray-500">로딩중...</div>
        ) : activeTab === "영어" ? (
          currentData?.stock_release_content_en && isExistEn ? (
            <iframe
              src={currentData.stock_release_content_en}
              width="100%"
              height="100%"
              className="rounded-[10px]"
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            />
          ) : (
            <div className="text-center pt-20 text-gray-500">
              영어 원문 URL이 없습니다.
            </div>
          )
        ) : activeTab === "한국어" ? (
          currentData?.stock_release_content_kr && isExistKr ? (
            <iframe
              src={currentData.stock_release_content_kr}
              width="100%"
              height="100%"
              className="rounded-[10px]"
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            />
          ) : (
            <div className="text-center pt-20 text-gray-500">
              한국어 데이터가 없습니다.
            </div>
          )
        ) : currentData?.stock_release_content_an && isExistAn ? (
          <iframe
            src={currentData.stock_release_content_an}
            width="100%"
            height="100%"
            className="rounded-[10px]"
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          />
        ) : (
          <div className="text-center pt-20 text-gray-500">
            AI 요약/분석 데이터가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
