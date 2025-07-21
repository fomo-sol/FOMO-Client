"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/common/inputField";
import LabelLinkRow from "@/components/common/labelLinkRow";
import { loginUser } from "@/services/user-service";
import { requestFcmToken } from "@/services/fcm-service";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [passwd, setPasswd] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const { user, token } = await loginUser({ email, passwd });
      await requestFcmToken();

      // ✅ storage 이벤트로 로그인 상태 반영되게 강제 트리거
      window.dispatchEvent(new Event("storage"));

      router.push("/"); // 홈으로 이동
    } catch (error) {
      console.error("로그인 실패:", error.message);
      alert(error.response?.data?.message || "로그인 중 오류 발생");
    }
  };

  return (
      <div className="grid place-items-center pt-32 px-4">
        <div className="w-[470px] h-auto bg-[#EAEAEA] rounded-[5px] shadow-md flex flex-col items-center justify-center space-y-5 px-6 py-8">
          <h2 className="text-[#353535] text-[25px] font-medium font-[Pretendard] text-center">
            로그인
          </h2>

          <div className="w-full max-w-[340px] space-y-3">
            <InputField
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <InputField
                type="password"
                placeholder="Password"
                value={passwd}
                onChange={(e) => setPasswd(e.target.value)}
            />
          </div>

          <LabelLinkRow />

          <button
              onClick={handleLogin}
              className="w-[338px] h-[52px] rounded-full bg-[#171717] text-white font-semibold"
          >
            Login
          </button>

          <p className="text-xs text-[#353535] font-lato">
            계정이 없으신가요?{" "}
            <a
                href="/signup"
                className="text-[#063FA1] underline underline-offset-2"
            >
              회원가입
            </a>
          </p>
        </div>
      </div>
  );
}
