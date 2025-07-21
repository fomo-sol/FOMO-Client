"use client";

import React from "react";

export default function AddAssetModal({ onClose }) {
    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
            <div className="bg-white text-black rounded-lg shadow-lg w-[400px] p-6">
                <h2 className="text-xl font-bold mb-4">자산 추가</h2>
                <p>여기에 자산 추가 폼 또는 내용을 넣을 수 있습니다.</p>

                <div className="mt-6 flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        취소
                    </button>
                    <button
                        className="px-4 py-2 bg-white text-black font-bold rounded hover:bg-[#7eaaff]"
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
}
