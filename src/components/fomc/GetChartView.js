"use client";

import { useState, useEffect } from "react";
import StockChart from "@/components/earning/chart/chart";

export default function GetChartView({ onSymbolSelect }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [search, setSearch] = useState("");
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);

  // 모달 열릴 때 전체 종목 fetch
  useEffect(() => {
    if (showModal && search === "") {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies`)
        .then((res) => res.json())
        .then((res) => setStocks(res.data || []))
        .finally(() => setLoading(false));
    }
  }, [showModal, search]);

  // 검색어 입력 시 fetch
  useEffect(() => {
    if (showModal && search) {
      setLoading(true);
      fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/companies?search=${encodeURIComponent(search)}`
      )
        .then((res) => res.json())
        .then((res) => setStocks(res.data || []))
        .finally(() => setLoading(false));
    }
  }, [search, showModal]);

  // 종목 선택 시 부모 컴포넌트에 알림
  const handleSymbolSelect = (symbol) => {
    setSelectedSymbol(symbol);
    setShowModal(false);
    if (onSymbolSelect) {
      onSymbolSelect(symbol);
    }
  };

  return (
    <div className="w-full flex items-center justify-center bg-[#040816] rounded-lg relative">
      {!selectedSymbol ? (
        <div className="pt-20">
          <button
            className="bg-gray-800 text-white cursor-pointer hover:bg-gray-600 px-6 py-3 rounded-lg font-bold"
            onClick={() => setShowModal(true)}
          >
            주식 차트 불러오기
          </button>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center">
          <StockChart symbol={selectedSymbol} />
          <div className="pt-6">
            <button
              className="px-3 py-1 cursor-pointer border-1 hover:bg-gray-400 border-gray600 font-medium rounded-[5px] transition-all duration-200 bg-white text-black focus:outline-none"
              onClick={() => setShowModal(true)}
            >
              다른 종목 선택
            </button>
          </div>
        </div>
      )}

      {/* 모달 */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-[#23272f] rounded-lg p-6 w-[650px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="font-bold text-lg text-white">
                종목 검색(한글/영문)
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-300 cursor-pointer text-xl"
              >
                &times;
              </button>
            </div>
            <input
              className="w-full border px-3 py-2 rounded mb-3 bg-[#181c23] text-white placeholder-gray-400 border-gray-600"
              placeholder="종목명(한글) 또는 심볼(영문) 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="h-60 overflow-y-auto">
              {loading && (
                <div className="text-center text-gray-400 py-4">로딩중...</div>
              )}
              {!loading && stocks.length === 0 && (
                <div className="text-gray-400 text-center py-4">
                  검색 결과 없음
                </div>
              )}
              {!loading &&
                stocks.map((stock) => (
                  <div
                    key={stock.symbol}
                    className="py-2 px-2 hover:bg-blue-100 hover:text-black cursor-pointer rounded text-white flex items-center"
                    onClick={() => handleSymbolSelect(stock.symbol)}
                  >
                    <span className="font-bold w-24">{stock.symbol}</span>
                    <span className="text-gray-400 ml-2 truncate">
                      {stock.name_kr}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
