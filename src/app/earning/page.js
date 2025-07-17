"use client";
import { useState } from "react";
import FinancePaging from "@/components/earning/financeList/financePaging";
import WishListPage from "@/components/earning/financeList/wishListPage";
import AddAssetModal from "@/components/earning/financeList/addAsetModal";

export default function EarningPage() {
    const [view, setView] = useState("finance");
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="px-8 py-6 bg-[#081835] text-white font-[Pretendard] min-h-screen">
            <h1 className="text-2xl font-bold mb-6">실적발표 페이지</h1>

            <div className="mb-4 flex justify-between items-center">
                <div className="space-x-6 text-lg">
                    <span
                        onClick={() => setView("finance")}
                        className={`cursor-pointer ${
                            view === "finance" ? "text-white font-semibold" : "text-gray-400"
                        }`}
                    >
                        실적발표
                    </span>
                    <span
                        onClick={() => setView("wishlist")}
                        className={`cursor-pointer ${
                            view === "wishlist" ? "text-white font-semibold" : "text-gray-400"
                        }`}
                    >
                        관심종목
                    </span>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="bg-white text-black font-semibold px-4 py-2 cursor-pointer rounded hover:bg-[#7eaaff] transition"
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
