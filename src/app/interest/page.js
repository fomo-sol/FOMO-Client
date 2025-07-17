"use client";
import { useState, useEffect } from "react";
import "./scrollbar.css";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import StockItemCard from "@/components/interest/StockItemCard";

const chunkStocks = (arr, size) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

export default function InterestPage() {
  const router = useRouter();
  const [originalCompanies, setOriginalCompanies] = useState([]);
  const [displayCompanies, setDisplayCompanies] = useState([]);
  const [sectorMap, setSectorMap] = useState({});
  const [selectedList, setSelectedList] = useState([]); // {symbol, rowIndex}
  const [recommendations, setRecommendations] = useState([]); // {symbol, recList}
  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/companies");
        const json = await res.json();
        if (json.success) {
          setOriginalCompanies(json.data);

          const sectorGroup = {};
          json.data.forEach((company) => {
            if (!sectorGroup[company.sector]) {
              sectorGroup[company.sector] = [];
            }
            sectorGroup[company.sector].push(company);
          });
          setSectorMap(sectorGroup);
          setDisplayCompanies(json.data);
        }
      } catch (e) {
        console.error("Failed to fetch companies", e);
      }
    };

    const accessToken = localStorage.getItem("token");
    if (accessToken) setToken(accessToken);

    fetchCompanies();
  }, []);

  const selectedSymbols = new Set(selectedList.map((s) => s.symbol));

  const toggleSelect = (symbol, rowIndex) => {
    const isAlreadySelected = selectedList.some((s) => s.symbol === symbol);
    if (isAlreadySelected) {
      setSelectedList((prev) => prev.filter((s) => s.symbol !== symbol));
      return;
    }

    const selectedCompany = [
      ...displayCompanies,
      ...recommendations.flatMap((r) => r.recList),
    ].find((c) => c.symbol === symbol);
    if (!selectedCompany) return;

    const allExcluded = new Set([
      ...selectedList.map((s) => s.symbol),
      ...recommendations.flatMap((r) => r.recList.map((c) => c.symbol)),
      symbol,
    ]);

    const candidates = (sectorMap[selectedCompany.sector] || []).filter(
      (c) => !allExcluded.has(c.symbol)
    );
    const shuffled = [...candidates].sort(() => Math.random() - 0.5);
    const top5 = shuffled.slice(0, 5);

    setSelectedList((prev) => [...prev, { symbol, rowIndex }]);
    setRecommendations((prev) => [...prev, { symbol, recList: top5 }]);
    setDisplayCompanies((prev) =>
      prev.filter((c) => !top5.some((r) => r.symbol === c.symbol))
    );
  };

  const buildRowsWithRecommendations = () => {
    const rows = chunkStocks(displayCompanies, 5);
    const result = [];

    for (let i = 0; i < rows.length; i++) {
      result.push({ type: "main", data: rows[i], rowIndex: i });

      const selectedInRow = [...selectedList]
        .filter((s) => s.rowIndex === i)
        .reverse();

      selectedInRow.forEach((s) => {
        const rec = recommendations.find((r) => r.symbol === s.symbol);
        if (rec) {
          result.push({ type: "recommend", data: rec.recList });
        }
      });
    }

    return result;
  };

  const isSelected = (symbol) => selectedList.some((s) => s.symbol === symbol);

  const handleDone = async () => {
    if (selectedList.length < 5) {
      alert(
        "관심 종목을 최소 5개 이상 선택해야 분석 결과를 받아보실 수 있습니다."
      );
      return;
    }
    const token = localStorage.getItem("token"); // 또는 cookie 등
    if (!token) {
      alert("인증 정보가 없습니다. 다시 로그인 해주세요.");
      return;
    }

    // JWT decode 없이 userId 꺼내기
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log("🔍 JWT payload:", payload);

    const userId = payload.id;

    // symbol → stock_id 매핑
    const selectedIds = selectedList
      .map((s) => {
        const company =
          originalCompanies.find((c) => c.symbol === s.symbol) ||
          displayCompanies.find((c) => c.symbol === s.symbol) ||
          recommendations
            .flatMap((r) => r.recList)
            .find((c) => c.symbol === s.symbol);
        return company?.stock_id;
      })
      .filter(Boolean);

    const favoritePayload = selectedIds.map((id) => ({ stock_id: id }));
    try {
      const res = await fetch(`http://localhost:4000/api/favorites/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(favoritePayload), // ← 여기서도 payload가 아니라 favoritePayload로 수정 필요
      });

      if (!res.ok) throw new Error("저장 실패");

      router.push("/interest-done");
    } catch (err) {
      console.error("선택 종목 저장 실패", err);
      alert("관심 종목 저장 중 문제가 발생했습니다.");
    }
  };

  const rowsWithRecommendations = buildRowsWithRecommendations();

  return (
    <div className="relative h-screen bg-[#081835] text-white font-[Pretendard]">
      <div className="h-[calc(100vh-80px)] overflow-y-auto no-scrollbar px-6 pb-40 pt-12">
        <div className="text-center">
          <h1 className="text-[60px] font-semibold text-[#FFFEFE]">
            지구님, 환영합니다!
          </h1>
          <p className="mt-4 text-[20px] text-[#f7f7f7]">
            관심 종목을 추가하고, 가장 빠른 한글 요약본을 받아보세요
          </p>
        </div>

        <div className="flex flex-col gap-6 pb-24">
          {rowsWithRecommendations.map((row, index) => (
            <AnimatePresence key={`${row.type}-${index}`}>
              {row.type === "recommend" ? (
                <motion.div
                  initial={{ opacity: 0, x: -50, backgroundColor: "#1e2a44" }}
                  animate={{ opacity: 1, x: 0, backgroundColor: "transparent" }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{
                    duration: 0.8,
                    ease: "easeOut",
                    backgroundColor: { duration: 1.2, ease: "easeInOut" },
                  }}
                  className="grid grid-cols-5 gap-x-4 gap-y-5 justify-items-center rounded-xl"
                >
                  {row.data.map((stock) => (
                    <StockItemCard
                      key={stock.symbol}
                      stock={stock}
                      onClick={() => toggleSelect(stock.symbol, index)}
                      selected={isSelected(stock.symbol)}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="grid grid-cols-5 gap-x-4 gap-y-5 justify-items-center"
                >
                  {row.data.map((stock) => (
                    <StockItemCard
                      key={stock.symbol}
                      stock={stock}
                      onClick={() => toggleSelect(stock.symbol, row.rowIndex)}
                      selected={isSelected(stock.symbol)}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full h-20 bg-[#081835]/70 backdrop-blur-md flex justify-center items-center border-t border-white/10 shadow-md">
        <button
          onClick={handleDone}
          className="bg-white text-black px-6 py-2 rounded-full font-semibold shadow"
        >
          완료
        </button>
      </div>
    </div>
  );
}
