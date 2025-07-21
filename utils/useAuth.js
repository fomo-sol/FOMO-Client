"use client";
import { useEffect, useState } from "react";

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export default function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = parseJwt(token);
      setIsLoggedIn(true);
      setUser(payload);
    } else {
      setIsLoggedIn(false);
      setUser(null);
      setFavorites([]);
    }

    const syncAuth = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const payload = parseJwt(token);
        setIsLoggedIn(true);
        setUser(payload);
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setFavorites([]);
      }
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

  return { isLoggedIn, user, favorites, setFavorites };
}
