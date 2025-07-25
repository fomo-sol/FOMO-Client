"use client";
import { useRouter } from "next/navigation";
import useAuth from "@/utils/useAuth";

export default function Home() {
  const router = useRouter();
  const isLoggedIn = useAuth();

  const handleStart = () => {
    if (isLoggedIn) {
      router.push("/calendar");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#040816] flex flex-col items-center justify-start text-center pt-40">
      <h2 className="text-white text-4xl md:text-5xl font-medium mb-8">
        발표가 끝나면 바로 도착하는 한글 요약
      </h2>
      <h1 className="text-white text-7xl md:text-8xl font-semibold mb-10">FOMO</h1>
      <button
        className="bg-white text-[#040816] text-2xl font-semibold rounded-xl px-12 py-4 shadow hover:bg-gray-200 transition"
        onClick={handleStart}
      >
        시작하기
      </button>
    </div>
  );
}
