"use client";
import { useState } from "react";
import FinancePaging from "@/components/earning/financeList/financePaging";
import WishListPage from "@/components/earning/financeList/wishListPage";
import AddAssetModal from "@/components/earning/financeList/addAsetModal";
import useAuth from "../../../utils/useAuth";
import { useRouter } from "next/navigation";

export default function EarningPage() {
  const [view, setView] = useState("finance");
  const [showModal, setShowModal] = useState(false);
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  // 로그인 필요 confirm 핸들러
  const handleRequireLogin = () => {
    if (window.confirm("로그인이 필요합니다. 로그인하시겠습니까?")) {
      router.push("/login");
    }
  };

  return (
    <div className="px-8   font-[Pretendard] min-h-screen">
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
              onClick={() => {
                if (key === "wishlist" && !isLoggedIn) {
                  handleRequireLogin();
                  return;
                }
                setView(key);
              }}
              className={`pb-2 text-[20px] cursor-pointer font-semibold relative ${
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

        <div className="pb-2">
          <button
            onClick={() => {
              if (!isLoggedIn) {
                handleRequireLogin();
                return;
              }
              setShowModal(true);
            }}
            className="bg-white text-black font-semibold px-4 py-1.5 cursor-pointer rounded hover:bg-gray-700 transition"
          >
            Add Asset
          </button>
        </div>
      </div>

      {view === "finance" && <FinancePaging />}
      {view === "wishlist" && <WishListPage />}

      {showModal && <AddAssetModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
