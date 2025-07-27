import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import pretendard from "@/app/fonts/pretendard";
import TokenInitializer from "@/components/TokenInitializer";

export const metadata = {
  title: "FOMO - 실시간 주식 정보 및 투자 분석 플랫폼",
  description: "FOMO - 실시간 주식 정보 및 투자 분석 플랫폼",
  icons: {
    icon: "/fomoDesign.png",
    shortcut: "/fomoDesign.png",
    apple: "/fomoDesign.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={`${pretendard.variable} `}>
      <body className="">
        <Navbar />

        <div className="px-16 py-2 justify-center">{children}</div>
      </body>
    </html>
  );
}
