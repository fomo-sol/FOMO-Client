"use client";
import axiosInstance from "@/services/axios-instance";

// 회원가입 요청
export const registerUser = async (data) => {
    const response = await axiosInstance.post("/user/register", data);
    return response.data;
};

// 로그인 요청
export const loginUser = async (data) => {
    const response = await axiosInstance.post("/user/login", data);

    const token = response.data?.data?.token;
    const user = response.data?.data?.user;

    if (token && typeof window !== "undefined") {
        // localStorage 저장
        localStorage.setItem("token", token);
        // axiosInstance 전역 헤더에 설정
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    return { user, token };
};

// 로그아웃 요청
export const logoutUser = async () => {
    try {
        const response = await axiosInstance.post("/user/logout");
        // 토큰 제거
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
        }
        delete axiosInstance.defaults.headers.common["Authorization"];
        return response.data;
    } catch (err) {
        throw err;
    }
};

// fcm 토큰 보내기
export const registerFcmToken = async (fcm_token) => {
    const res = await axiosInstance.post("/user/fcm", { fcm_token });
    return res.data;
};