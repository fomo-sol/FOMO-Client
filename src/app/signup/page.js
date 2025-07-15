"use client";
import InputField from "@/components/common/inputField";
export default function SignupPage() {
  return (
    <div className="grid place-items-center pt-32 px-4">
      <div className="w-[470px] h-[361px] bg-[#EAEAEA] rounded-[5px] shadow-md flex flex-col items-center justify-center space-y-5">
        <h2 className="text-[#353535] text-[25px] font-medium font-[Pretendard] text-center">
          회원가입
        </h2>

        <div className="w-full max-w-[340px] space-y-3">
          <InputField type="text" placeholder="User name" />
          <InputField type="email" placeholder="Email" />
          <InputField type="password" placeholder="Password" />
        </div>

        <button className="w-[338px] h-[52px] rounded-full bg-[#171717] text-white font-semibold">
          Signup
        </button>
      </div>
    </div>
  );
}
