"use client";
import { useEffect, useState } from "react";

export default function useAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // 초기 토큰 검사
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);

        // 로그인/로그아웃 시 storage 이벤트로 감지
        const syncAuth = () => {
            const token = localStorage.getItem("token");
            setIsLoggedIn(!!token);
        };

        window.addEventListener("storage", syncAuth);
        return () => window.removeEventListener("storage", syncAuth);
    }, []);

    return isLoggedIn;
}