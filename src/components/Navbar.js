"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      className="text-white text-lg items-center justify-between px-6 py-6 flex gap-4 border-b"
      style={{ backgroundColor: "#081835", borderBlockColor: "#282C34" }}
    >
      <Link href="/" className="font-bold text-2xl">
        FOMO
      </Link>
      <div className="flex items-center gap-4">
        <input
          className="bg-white text-black rounded-2xl focus:outline-none text-center"
          style={{ width: "200px" }}
        ></input>
        <Link href="/fomc">FOMC</Link>
        <Link href="/earning">실적발표</Link>
        <Link href="/calendar">캘린더</Link>
        <Link href="/alert">알람</Link>
        <Link href="/mypage">마이페이지</Link>
      </div>
    </nav>
  );
}
