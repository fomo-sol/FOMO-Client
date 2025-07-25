"use client";
import { useEffect, useState, useMemo, useCallback } from "react";

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

function isTokenExpired(payload) {
  if (!payload || !payload.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  const isExpired = payload.exp < currentTime;

  if (isExpired) {
    console.log("[useAuth] Token expired:", {
      currentTime,
      tokenExp: payload.exp,
      difference: currentTime - payload.exp,
    });
  }

  return isExpired;
}

export default function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 토큰 갱신 함수
  const refreshToken = async (oldToken) => {
    if (isRefreshing) return null; // 중복 요청 방지

    setIsRefreshing(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${oldToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.token) {
          localStorage.setItem("token", data.token);
          console.log("[useAuth] Token refreshed successfully");
          return data.token;
        }
      }

      console.log("[useAuth] Token refresh failed");
      return null;
    } catch (error) {
      console.error("[useAuth] Token refresh error:", error);
      return null;
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      console.log("[useAuth] Checking token:", token ? "exists" : "not found");

      if (token) {
        const payload = parseJwt(token);
        console.log("[useAuth] Token payload:", payload);

        if (payload && !isTokenExpired(payload)) {
          setIsLoggedIn(true);
          setUser(payload);
          console.log("[useAuth] User logged in:", payload);
        } else if (payload && isTokenExpired(payload)) {
          // 토큰이 만료된 경우 갱신 시도
          console.log("[useAuth] Token expired, attempting refresh...");
          const newToken = await refreshToken(token);

          if (newToken) {
            // 토큰 갱신 성공
            const newPayload = parseJwt(newToken);
            setIsLoggedIn(true);
            setUser(newPayload);
            console.log(
              "[useAuth] Token refreshed, user logged in:",
              newPayload
            );
          } else {
            // 토큰 갱신 실패
            localStorage.removeItem("token");
            setIsLoggedIn(false);
            setUser(null);
            setFavorites([]);
            console.log("[useAuth] Token refresh failed, logged out");
            alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
          }
        } else {
          // 토큰이 유효하지 않은 경우
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          setUser(null);
          setFavorites([]);
          console.log("[useAuth] Invalid token, logged out");
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setFavorites([]);
        console.log("[useAuth] No token, logged out");
      }
    };

    checkAuth();

    const syncAuth = () => {
      checkAuth();
    };

    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  // 유저 id가 있으면 관심종목 fetch
  useEffect(() => {
    if (user?.id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites/${user.id}`)
        .then((res) => res.json())
        .then((res) => setFavorites(res.data || []))
        .catch(() => setFavorites([]));
    } else {
      setFavorites([]);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      console.log("[useAuth] 관심종목(favorites):", favorites);
    }
  }, [favorites, user?.id]);

  // setFavorites 함수를 메모리제이션
  const setFavoritesMemo = useCallback((newFavorites) => {
    setFavorites(newFavorites);
  }, []);

  // 메모이제이션 제거하여 상태 업데이트가 즉시 반영되도록 함
  return { isLoggedIn, user, favorites, setFavorites: setFavoritesMemo };
}
