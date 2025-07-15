"use client";
import InputField from "@/components/common/inputField";
import LabelLinkRow from "@/components/common/labelLinkRow";

export default function LoginPage() {
  return (
    <div className="grid place-items-center pt-32 px-4">
      <div className="w-[470px] h-auto bg-[#EAEAEA] rounded-[5px] shadow-md flex flex-col items-center justify-center space-y-5 px-6 py-8">
        <h2 className="text-[#353535] text-[25px] font-medium font-[Pretendard] text-center">
          로그인
        </h2>

        <div className="w-full max-w-[340px] space-y-3">
          <InputField type="email" placeholder="Email" />
          <InputField type="password" placeholder="Password" />
        </div>

        <LabelLinkRow />

        <button className="w-[338px] h-[52px] rounded-full bg-[#171717] text-white font-semibold">
          Login
        </button>

        <p className="text-xs text-[#353535] font-lato">
          Don’t have an account?{" "}
          <a href="#" className="text-[#063FA1] underline underline-offset-2">
            Signup
          </a>
        </p>
      </div>
    </div>
  );
}
