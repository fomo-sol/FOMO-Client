import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
});

// 요청마다 Authorization 헤더 삽입 (클라이언트에서만)
axiosInstance.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        console.log("✅ 인터셉터 토큰 확인:", token); // 디버깅용
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log("✅ Authorization 헤더 추가됨:", config.headers.Authorization);
        }
    }
    return config;
});

export default axiosInstance;
