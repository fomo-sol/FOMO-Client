"use client";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav
      className="text-white text-lg items-center justify-between px-16 py-6 flex gap-4 border-b"
      style={{ backgroundColor: "#081835", borderBlockColor: "#282C34" }}
    >
      <Link href="/" className="font-bold text-2xl">
        FOMO
      </Link>
      <div className="flex items-center gap-10">
        <div className="relative">
          <input
            className="bg-white text-black rounded-2xl focus:outline-none text-center"
            style={{ width: "170px", height: "30px" }}
          />
          <img
            src="/icon_search.svg"
            alt="Search_icon"
            width={24}
            height={24}
            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
          />
        </div>
        <Link href="/fomc">FOMC</Link>
        <Link href="/earning">실적발표</Link>
        <Link href="/calendar">
          <Image
            src="/icon_calendar.svg"
            alt="Calendar_page"
            width={24}
            height={24}
          />
        </Link>
        <Link href="/alert">
          <Image
            src="/icon_alert.svg"
            alt="Alert_page"
            width={24}
            height={24}
          />
        </Link>
        <Link href="/mypage">
          <Image src="/icon_mypage.svg" alt="My_page" width={30} height={30} />
        </Link>
      </div>
    </nav>
  );
}
