"use client";
import { useState } from "react";
import FinancePaging from "@/components/earning/financeList/financePaging";
import WishListPage from "@/components/earning/financeList/wishListPage";
import AddAssetModal from "@/components/earning/financeList/addAsetModal";

export default function EarningPage() {
  const [view, setView] = useState("finance");
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="px-8 py-6 font-[Pretendard] min-h-screen">
      <h1 className="text-2xl font-bold mb-10">실적발표 페이지</h1>

      {/* 스타일 맞춰서 탭으로 변경했음! */}
      <div className="flex justify-between items-center border-b border-white/30 mb-6">
        <div className="flex gap-8">
          {[
            { key: "finance", label: "실적발표" },
            { key: "wishlist", label: "관심종목" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`pb-2 text-[20px] font-semibold relative ${
                view === key ? "text-white" : "text-gray-400"
              }`}
            >
              {label}
              {view === key && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#93B9FF]" />
              )}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-white text-black font-semibold px-4 py-1.5 cursor-pointer rounded hover:bg-[#7eaaff] transition"
        >
          Add Asset
        </button>
      </div>

      {view === "finance" && <FinancePaging />}
      {view === "wishlist" && <WishListPage />}

      {showModal && <AddAssetModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
