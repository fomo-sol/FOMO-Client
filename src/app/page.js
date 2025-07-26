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
      className: "text-white dark:text-blue-500",
    },

    { text: " 한글 요약", className: "text-blue-500 dark:text-blue-500" },
  ];

  const content = [
    {
      title: "실시간 FOMC & 실적 발표 추적",
      description:
        "FOMC 성명서, 연설, 기업 실적 발표를 실시간으로 감지해 자동으로 수집합니다. 이제 중요한 금융 이벤트를 놓치지 말고 바로 확인하세요.",
      content: (
        <div className="flex h-full w-full items-center justify-center text-white">
          <img
            src="/fomc_r.png"
            className="w-200 h-auto object-cover"
            alt="FOMC demo"
          />
        </div>
      ),
    },
    {
      title: "AI 요약 및 자동 번역",
      description:
        "전문적인 금융 문서를 인공지능이 자동 번역하고 핵심만 요약해드립니다. 복잡한 내용도 한눈에 파악할 수 있어요.",
      content: (
        <img
          src="/earning.png"
          className="w-200 h-auto object-cover"
          alt="FOMC demo"
        />
      ),
    },
    {
      title: "개인 맞춤형 종목 알림",
      description:
        "당신의 관심 종목과 포트폴리오에 영향을 주는 뉴스만 골라서 알려드립니다. 더 똑똑한 투자 결정을 도와드려요.",
      content: (
        <img
          src="/alert.png"
          width={300}
          height={300}
          className="w-200 h-auto object-cover"
          alt="FOMC demo"
        />
      ),
    },
    {
      title: "데이터로 움직이는 통찰력",
      description:
        "과거 FOMC 결과와 시장 반응, 기업 실적 흐름을 한눈에 분석할 수 있습니다. 투자 판단에 필요한 데이터를 시각화해 더 명확한 전략을 세울 수 있어요.",
      content: (
        <img
          src="/calendar.png"
          width={300}
          height={300}
          className="w-200 h-auto object-cover"
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
          className="min-h-full bg-[#040816] flex flex-col items-center justify-start text-center pt-50 pb-70
    "
        >
          <h1 className="text-white text-7xl md:text-8xl font-semibold ">
            FOMO
          </h1>
          <TypewriterEffectSmooth words={words} cursorClassName="bg-white" />
          주식 정보에 한 발 늦었다고 생각한 당신에게
          <button
            className="bg-white text-[#040816] text-2xl font-semibold rounded-xl px-12 py-4 shadow hover:bg-gray-200 transition mt-10"
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
