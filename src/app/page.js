"use client";
import { useRouter } from "next/navigation";
import useAuth from "@/utils/useAuth";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";

export default function Home() {
  const router = useRouter();
  const isLoggedIn = useAuth();

  const words = [
    {
      text: "발표가 끝나면 바로 도착하는",
      className: "text-white",
    },

    { text: " 한글 요약", className: "text-blue-500 dark:text-blue-500" },
  ];

  const content = [
    {
      title: '<span class="text-blue-500">FOMC</span> 실시간 요약 & 번역',
      description:
        "시장을 움직이는 FOMC 발표, 새벽에 놓치셨나요?|| FOMC 금리 발표와 실적 발표 직후| 핵심만 추린 한글 번역과 요약으로 빠르게 확인하세요",
      content: (
        <img
          src="/landing_fomc.png"
          className="w-180 h-auto object-cover"
          alt="FOMC demo"
        />
      ),
    },
    {
      title: '<span class="text-blue-500">실적발표</span> 실시간 요약 & 번역',
      description:
        "관심 종목의 실적 발표는 주가의 분기점입니다|| 불필요한 해석과 복잡한 자료 분석 없이| 한글 요약으로 핵심만 빠르게 전달해드립니다",
      content: (
        <img
          src="/landing_earning.png"
          className="w-180 h-auto object-cover"
          alt="FOMC demo"
        />
      ),
    },
    {
      title:
        '투자에 필요한 정보만, <span class="text-blue-500">즉시 알림</span>',
      description:
        "브라우저와 텔레그램으로 |원하는 정보만 선택적으로 수신하세요|| 중요 발표를 실시간으로 받아 기회를 놓치지 마세요",
      content: (
        <img
          src="/landing_alarm.png"
          width={300}
          height={300}
          className="w-180 h-auto object-cover"
          alt="FOMC demo"
        />
      ),
    },
    {
      title: '한눈에 보는 발표 일정 <span class="text-blue-500">캘린더</span>',
      description:
        "다가오는 FOMC 일정과 실적 발표를 한 화면에서 확인하세요|| 시장의 주요 이벤트를 미리 파악하고| 전략적으로 대응할 수 있습니다",
      content: (
        <img
          src="/landing_calendar.png"
          width={300}
          height={300}
          className="w-180 h-auto object-cover"
          alt="FOMC demo"
        />
      ),
    },
  ];

  const handleStart = () => {
    if (isLoggedIn) {
      router.push("/calendar");
    } else {
      router.push("/login");
    }
  };

  return (
    <div>
      <div>
        <div
          className="min-h-full bg-[#040816] flex flex-col items-center justify-start text-center pt-[20vh] pb-70
    "
        >
          <h1 className="text-white text-7xl md:text-8xl font-semibold ">
            FOMO
          </h1>

          <TypewriterEffectSmooth words={words} cursorClassName="bg-white" />
          <div className=" text-xl text-gray-200">
            해외 주식 정보에 한 발 늦었다고 생각한 당신에게
          </div>
          <button
            className="bg-white text-[#040816] cursor-pointer text-2xl font-semibold rounded-[5px] px-[2.3vw] py-[1.3vh] shadow hover:bg-gray-200 transition mt-10"
            onClick={handleStart}
          >
            시작하기
          </button>
        </div>
      </div>
      <div className="absolute w-full left-0 h-[10rem] pb-180">
        <StickyScroll content={content} />
      </div>
    </div>
  );
}
