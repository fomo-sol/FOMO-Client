"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    // 모달로 대체되었으므로 홈페이지로 리다이렉트
    router.push("/");
  }, [router]);

  return (
    <div className="grid place-items-center pt-32 px-4">
      <div className="w-[470px] h-[361px] bg-[#EAEAEA] rounded-[5px] shadow-md flex flex-col items-center justify-center space-y-5">
        <h2 className="text-[#353535] text-[25px] font-medium font-[Pretendard] text-center">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="text-[#353535] text-center">
          회원가입은 모달을 통해 진행됩니다.
        </p>
      </div>
    </div>
  );
}
