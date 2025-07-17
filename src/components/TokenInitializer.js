"use client";
import { useEffect } from "react";
import axiosInstance from "@/services/axios-instance";

export default function InterestPage() {
    useEffect(() => {
        const fetchMe = async () => {
            try {
                const res = await axiosInstance.get("/user/me");
                console.log("🙆‍♀️ 유저 정보:", res.data.data);
            } catch (err) {
                console.error("❌ 유저 정보 호출 실패:", err);
            }
        };

        fetchMe();
    }, []);

    return <div>관심 종목 페이지</div>;
}
