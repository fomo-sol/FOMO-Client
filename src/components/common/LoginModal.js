"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/common/inputField";
import { loginUser } from "@/services/user-service";
import { requestFcmToken } from "@/services/fcm-service";

export default function LoginModal({ onClose, onSwitchToSignup }) {
  const [email, setEmail] = useState("");
  const [passwd, setPasswd] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const modalRef = useRef(null);
  const router = useRouter();

  // Remember Me: 모달 열릴 때 localStorage에서 이메일 불러오기
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // 이메일 입력/체크박스 변경 시 localStorage에 저장/삭제
  useEffect(() => {
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }
  }, [rememberMe, email]);

  // 이메일 형식 검증 함수
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    // 이메일 형식 검증
    if (!validateEmail(email)) {
      alert("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    // 비밀번호 길이 검증
    if (passwd.length < 1) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    try {
      const { user, token } = await loginUser({ email, passwd });
      await requestFcmToken();

      // ✅ storage 이벤트로 로그인 상태 반영되게 강제 트리거
      window.dispatchEvent(new Event("storage"));

      // alert("로그인에 성공하였습니다!"); // 중복 alert 제거
      onClose(); // 모달 닫기
    } catch (error) {
      console.error("로그인 실패:", error.message);
      alert(error.response?.data?.message || "로그인 중 오류 발생");
    }
  };

  // 모달 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div
        ref={modalRef}
        className="w-[470px] h-auto bg-[#EAEAEA] rounded-[5px] shadow-md flex flex-col items-center justify-center space-y-5 px-6 py-8 relative"
      >
        <h2 className="text-[#353535] text-[25px] font-medium pt-3 pb-2 font-[Pretendard] text-center">
          로그인
        </h2>

        <form
          className="w-full max-w-[340px] space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <InputField
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin();
            }}
          />
          <InputField
            type="password"
            placeholder="Password"
            value={passwd}
            onChange={(e) => setPasswd(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin();
            }}
          />
          <div className="flex items-center gap-2 mt-1 mb-2">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 accent-[#171717] cursor-pointer"
            />
            <label
              htmlFor="rememberMe"
              className="text-sm text-gray-700 cursor-pointer select-none"
            >
              Remember Me
            </label>
          </div>
          <button
            type="submit"
            className="w-[338px] h-[42px] rounded-[15px] mt-5 bg-[#171717] text-white font-medium hover:bg-[#333333] transition-colors cursor-pointer"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-[#353535] font-lato">
          계정이 없으신가요?{" "}
          <button
            onClick={onSwitchToSignup}
            className="text-[#063FA1] underline underline-offset-2 cursor-pointer hover:text-[#0056b3] transition-colors"
          >
            회원가입
          </button>
        </p>

        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl font-bold text-gray-600 hover:text-black transition-colors cursor-pointer"
        >
          ×
        </button>
      </div>
    </div>
  );
}
