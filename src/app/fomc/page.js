"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
const tabs = ["금리 결정 및 연설", "의사록", "경제전망"];
const years = ["2025", "2024", "2023", "2022", "2021", "2020"];

// 연도별 데이터 (더미데이터 나중에 실제 데이터로 교체)
const generateData = (type, count) => {
  const dataByYear = {};
  for (const year of years) {
    dataByYear[year] = Array.from({ length: count }, (_, i) => ({
      title: `제 ${i + 1}차 ${type}`,
      rate: "4.5%",
      date: `${year}.07.11`,
    }));
  }
  return dataByYear;
};

const interestData = generateData("금리 결정", 8);
const minutesData = generateData("의사록", 8);
const projectionData = generateData("경제전망", 4);

export default function FomcPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("금리 결정 및 연설");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedIndex, setSelectedIndex] = useState(null);

  const getContent = () => {
    if (activeTab === "금리 결정 및 연설") return interestData[selectedYear];
    if (activeTab === "의사록") return minutesData[selectedYear];
    return projectionData[selectedYear];
  };

  return (
    <div className="px-8   font-[Pretendard] min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-6">FOMC 리스트</h1>
        <select
          className="bg-[#F5F5F5] text-black border-[3px] border-[#E0E0E0] rounded-[4px] px-2 py-1 w-[95px]"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* 탭 */}
      <div className="flex gap-8 border-b border-white/30 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-[20px] font-semibold relative ${
              activeTab === tab ? "text-white" : "text-gray-400"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#93B9FF]" />
            )}
          </button>
        ))}
      </div>

      {/* 헤더 */}
      <div className="grid grid-cols-4 text-lg font-semibold text-white/80 border-b border-white/10 pb-2 mb-2">
        <span>번호</span>
        <span>제목</span>
        <span>금리</span>
        <span>날짜</span>
      </div>

      {/* 리스트 */}
      <div className="space-y-2">
        {getContent().map((item, idx) => (
          <div
            key={idx}
            onClick={() => router.push(`/fomc/${idx + 1}`)} // 임의로 이동경로 해놓음
            className="grid grid-cols-4 py-3 px-2 cursor-pointer bg-white/5 hover:bg-white/10 transition-all rounded"
          >
            <span>{idx + 1}</span>
            <span>{item.title}</span>
            <span>{item.rate}</span>
            <span>{item.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
