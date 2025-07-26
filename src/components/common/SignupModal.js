"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/common/inputField";
import { registerUser, loginUser } from "@/services/user-service";
import { requestFcmToken } from "@/services/fcm-service";

export default function SignupModal({ onClose, onSwitchToLogin }) {
  const router = useRouter();
  const modalRef = useRef(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    passwd: "",
  });
  const [confirmPasswd, setConfirmPasswd] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async () => {
    // 입력값 검증
    if (!formData.username.trim()) {
      alert("사용자명을 입력해주세요.");
      return;
    }
    if (!validateEmail(formData.email)) {
      alert("올바른 이메일 형식을 입력해주세요.");
      return;
    }
    if (formData.passwd.length < 6) {
      alert("비밀번호는 6자 이상이어야 합니다.");
      return;
    }
    if (formData.passwd !== confirmPasswd) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      // 회원가입 요청
      const signupRes = await registerUser(formData);
      console.log("✅ 회원가입 성공:", signupRes);

      // 이어서 로그인 요청
      const { user, token } = await loginUser({
        email: formData.email,
        passwd: formData.passwd,
      });
      console.log("✅ 로그인 성공:", { user, token });

      // FCM 토큰 요청
      await requestFcmToken();

      // ✅ storage 이벤트로 로그인 상태 반영되게 강제 트리거
      window.dispatchEvent(new Event("storage"));

      // 모달 닫기
      onClose();

      // /interest로 리다이렉트
      router.push("/interest");
    } catch (error) {
      console.error("회원가입 실패:", error.message);
      if (error.response?.data?.message === "이미 사용 중인 이메일입니다.") {
        alert("이미 사용 중인 이메일입니다. 다른 이메일을 사용해주세요.");
      } else {
        alert(error.response?.data?.message || "회원가입 중 오류 발생");
      }
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
        className="w-[470px] h-auto bg-[#EAEAEA] rounded-[5px] shadow-md flex flex-col items-center justify-center space-y-5 px-6 py-8"
      >
        <h2 className="text-[#353535] text-[25px] py-1 font-medium font-[Pretendard] text-center">
          회원가입
        </h2>

        <form
          className="w-full max-w-[340px] space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleSignup();
          }}
        >
          <InputField
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            name="username"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSignup();
            }}
          />
          <InputField
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            name="email"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSignup();
            }}
          />
          <InputField
            type="password"
            placeholder="Password"
            value={formData.passwd}
            onChange={handleChange}
            name="passwd"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSignup();
            }}
          />
          <InputField
            type="password"
            placeholder="Confirm Password"
            value={confirmPasswd}
            onChange={(e) => setConfirmPasswd(e.target.value)}
            name="confirmPasswd"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSignup();
            }}
          />
          <div className="pt-5">
            <button
              type="submit"
              className="w-[338px] h-[42px] rounded-[15px] bg-[#171717] text-white font-medium hover:bg-[#333333] transition-colors cursor-pointer"
            >
              Register
            </button>
          </div>
        </form>

        <p className="text-sm text-[#353535] font-lato">
          이미 계정이 있으신가요?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-[#063FA1] underline underline-offset-2 cursor-pointer hover:text-[#0056b3] transition-colors"
          >
            로그인
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
