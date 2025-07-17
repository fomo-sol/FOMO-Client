"use client";
import { useState } from "react";
import companylogo from "./companylogo.json";
import "./scrollbar.css";
import { motion, AnimatePresence } from "framer-motion"; // 애니메이션 추가 (관심종목 선택 후 )
import { useRouter } from "next/navigation";

// 기업 종목 더미 데이터 (추후에 db 데이터로 대체하기!)
const dummyStocks = companylogo;

// 추천 기업 더미 데이터 (나중에 카테고리 별 랜덤 데이터로 대체하기)
const recommended = [
  { name: "AMD", logo: "https://eodhd.com/img/logos/US/AMD.png" },
  { name: "Intel", logo: "https://eodhd.com/img/logos/US/INTC.png" },
  { name: "Meta", logo: "https://eodhd.com/img/logos/US/meta.png" },
  { name: "ASML", logo: "https://eodhd.com/img/logos/US/ASML.png" },
  { name: "Qualcomm", logo: "https://eodhd.com/img/logos/US/QCOM.png" },
];

const recommended2 = [
  { name: "NVIDIA", logo: "https://eodhd.com/img/logos/US/NVDA.png" },
  { name: "Intel", logo: "https://eodhd.com/img/logos/US/INTC.png" },
  { name: "Meta", logo: "https://eodhd.com/img/logos/US/meta.png" },
  { name: "ASML", logo: "https://eodhd.com/img/logos/US/ASML.png" },
  { name: "Amazon", logo: "https://eodhd.com/img/logos/US/amzn.png" },
];

const chunkStocks = (arr, size) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

export default function InterestPage() {
  const router = useRouter();
  const [selectedSymbols, setSelectedSymbols] = useState(new Set());
  const [activatedRows, setActivatedRows] = useState(new Set());
  const chunked = chunkStocks(dummyStocks, 5);

  const toggleSelect = (symbol, rowIndex) => {
    const newSet = new Set(selectedSymbols);
    const newActivated = new Set(activatedRows);

    if (newSet.has(symbol)) {
      newSet.delete(symbol);
    } else {
      newSet.add(symbol);
      newActivated.add(rowIndex);
    }
    setSelectedSymbols(newSet);
    setActivatedRows(newActivated);
  };

  return (
    <div className="relative h-screen font-[Pretendard]">
      <div className="h-[calc(100vh-80px)] overflow-y-auto no-scrollbar px-6 pb-40 pt-12">
        <div className="text-center">
          <h1 className="text-[60px] font-semibold text-[#FFFEFE]">
            지구님, 환영합니다!
          </h1>
          <p className="mt-4 text-[20px] text-[#f7f7f7]">
            관심 종목을 추가하고, 가장 빠른 한글 요약본을 받아보세요
          </p>
        </div>

        <div className="mt-10">
          {chunked.map((row, rowIndex) => (
            <div key={rowIndex} className="mb-12">
              <div className="grid grid-cols-5 gap-x-4 gap-y-5 justify-items-center">
                {row.map((stock, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center space-y-2 cursor-pointer"
                    onClick={() => toggleSelect(stock.symbol, rowIndex)}
                  >
                    <div
                      className={`w-[92px] h-[92px] bg-white rounded-[16px] flex items-center justify-center ${
                        selectedSymbols.has(stock.symbol)
                          ? "border-4 border-yellow-400"
                          : ""
                      }`}
                    >
                      {stock.logo && (
                        <img
                          src={stock.logo}
                          alt={stock.name}
                          className="h-10 object-contain"
                        />
                      )}
                    </div>
                    <span className="text-[20px] font-medium text-[#F7F7F7] text-center">
                      {stock.name}
                    </span>
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activatedRows.has(rowIndex) && (
                  <motion.div
                    key={`recommend-${rowIndex}`}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="mt-8 grid grid-cols-5 gap-x-4 gap-y-5 justify-items-center"
                  >
                    {(rowIndex % 2 === 0 ? recommended : recommended2).map(
                      (stock, i) => (
                        <div
                          key={i}
                          className="flex flex-col items-center space-y-2 opacity-90"
                        >
                          <div className="w-[92px] h-[92px] bg-white rounded-[16px] flex items-center justify-center">
                            {stock.logo && (
                              <img
                                src={stock.logo}
                                alt={stock.name}
                                className="h-10 object-contain"
                              />
                            )}
                          </div>
                          <span className="text-[20px] font-medium text-[#F7F7F7] text-center">
                            {stock.name}
                          </span>
                        </div>
                      )
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full h-20 bg-[#040816]/70 backdrop-blur-md flex justify-center items-center border-t border-white/10 shadow-md">
        <button
          onClick={() => router.push("/interest-done")}
          className="bg-white text-black px-6 py-2 rounded-full font-semibold shadow"
        >
          완료
        </button>
      </div>
    </div>
  );
}
